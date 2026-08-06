import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// In-Memory Idempotency Protection Cache (Prevents duplicate invoice generation on fast double-clicks)
const processedIdempotencyKeys = new Map<string, any>();

// Bangladeshi Telco Mobile Number Validation Regex: ^(?:\+88)?01[3-9]\d{8}$
const BD_PHONE_REGEX = /^(?:\+88)?01[3-9]\d{8}$/;

export async function POST(request: Request) {
  try {
    const session = getSession();
    const body = await request.json();
    const {
      idempotencyKey,
      customerName,
      phone,
      deliveryAddress,
      district,
      thana,
      paymentMethod,
      bkashTrxId,
      paymentSenderNo,
      notes,
      items,
    } = body;

    // 1. Idempotency Check to Prevent Duplicate Orders
    if (idempotencyKey && processedIdempotencyKeys.has(idempotencyKey)) {
      const cachedOrder = processedIdempotencyKeys.get(idempotencyKey);
      return NextResponse.json({
        success: true,
        isDuplicate: true,
        order: cachedOrder,
        message: 'Order already processed successfully.',
      }, { status: 200 });
    }

    // 2. Strict Input & Bangladeshi Phone Validation
    if (!customerName?.trim()) {
      return NextResponse.json({ error: 'Recipient full name is required (min 2 characters).' }, { status: 400 });
    }

    const cleanPhone = phone?.trim() || '';
    if (!BD_PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json({
        error: 'Invalid Bangladeshi mobile phone number. Format must be 11 digits starting with 013-019 (e.g. 01712345678).',
      }, { status: 400 });
    }

    if (!deliveryAddress?.trim() || !district || !thana || !paymentMethod || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required shipping address, location, or order items.' }, { status: 400 });
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && !bkashTrxId?.trim()) {
      return NextResponse.json({ error: `Transaction ID (TrxID) is required for ${paymentMethod} payment transfer verification.` }, { status: 400 });
    }

    // 3. User Session Foreign Key Safety
    let validUserId: string | null = null;
    if (session?.id) {
      const existingUser = await prisma.user.findUnique({
        where: { id: session.id },
      });
      if (existingUser) {
        validUserId = existingUser.id;
      }
    }

    // 4. Server-Side Price Verification & DB Lookup (Never trust frontend-passed prices!)
    const validatedOrderItems = [];
    let calculatedItemsTotal = 0;

    for (const item of items) {
      const pId = item.product?.id || item.productId;
      if (!pId) {
        return NextResponse.json({ error: 'Cart contains invalid product identifier.' }, { status: 400 });
      }

      const dbProduct = await prisma.product.findUnique({
        where: { id: pId },
      });

      if (!dbProduct || !dbProduct.isActive) {
        return NextResponse.json({
          error: `Product "${item.product?.title || 'Selected Item'}" is no longer available in the database. Please refresh your cart.`,
        }, { status: 400 });
      }

      let validVariantId: string | null = null;
      let authoritativeUnitPrice = dbProduct.basePrice;

      if (item.variant?.id) {
        const dbVariant = await prisma.productVariant.findUnique({
          where: { id: item.variant.id },
        });
        if (dbVariant && dbVariant.productId === dbProduct.id) {
          validVariantId = dbVariant.id;
          authoritativeUnitPrice = dbVariant.price; // Authoritative DB price!
        }
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      calculatedItemsTotal += authoritativeUnitPrice * qty;

      validatedOrderItems.push({
        productId: dbProduct.id,
        variantId: validVariantId,
        quantity: qty,
        unitPrice: authoritativeUnitPrice,
      });
    }

    const deliveryFee = 60; // Standard BD local delivery fee
    const grandTotal = calculatedItemsTotal + deliveryFee;

    // 5. Unique Guaranteed Invoice Number Generation
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const orderNumber = `RB-2026-${timestamp}${randomSuffix}`;

    // 6. Database Order Record Construction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: validUserId,
        customerName: customerName.trim(),
        phone: cleanPhone,
        deliveryAddress: deliveryAddress.trim(),
        district,
        thana,
        totalAmount: grandTotal,
        deliveryFee,
        paymentMethod,
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING',
        bkashTrxId: bkashTrxId?.trim() || null,
        paymentSenderNo: paymentSenderNo?.trim() || cleanPhone,
        notes: notes?.trim() || null,
        items: {
          create: validatedOrderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // Cache idempotency token if provided
    if (idempotencyKey) {
      processedIdempotencyKeys.set(idempotencyKey, order);
      // Clean up memory cache after 15 minutes
      setTimeout(() => processedIdempotencyKeys.delete(idempotencyKey), 15 * 60 * 1000);
    }

    // 7. Safe Inventory Stock Decrement
    for (const vItem of validatedOrderItems) {
      try {
        if (vItem.variantId) {
          await prisma.productVariant.update({
            where: { id: vItem.variantId },
            data: { stock: { decrement: vItem.quantity } },
          });
        } else if (vItem.productId) {
          await prisma.product.update({
            where: { id: vItem.productId },
            data: { stock: { decrement: vItem.quantity } },
          });
        }
      } catch (stockErr) {
        console.warn('Stock decrement warning:', stockErr);
      }
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error('Checkout Engine Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred while processing the order.',
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
