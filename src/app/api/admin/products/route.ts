import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Admin GET products error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, description, categoryId, basePrice, stock, sku, unit, images, variants } = body;

    if (!title || !slug || !description || !categoryId || !basePrice || !sku) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        basePrice: parseFloat(basePrice),
        stock: parseInt(stock || 0),
        sku,
        unit: unit || 'pcs',
        images: JSON.stringify(images || ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800']),
        variants: {
          create: (variants || []).map((v: any) => ({
            name: v.name,
            price: parseFloat(v.price),
            stock: parseInt(v.stock || 0),
            sku: v.sku || `${sku}-${v.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Admin POST product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, categoryId, basePrice, stock, sku, unit, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        categoryId,
        basePrice: basePrice ? parseFloat(basePrice) : undefined,
        stock: stock !== undefined ? parseInt(stock) : undefined,
        sku,
        unit,
        isActive,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Admin PUT product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE product error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
