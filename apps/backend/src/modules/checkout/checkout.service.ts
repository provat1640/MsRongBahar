import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PlaceOrderDto, ReserveInventoryDto, DeliveryFeeCalculateDto } from './checkout.dto';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  calculateDeliveryFee(dto: DeliveryFeeCalculateDto): { fee: number; estimatedDelivery: string } {
    const districtLower = (dto.district || '').toLowerCase().trim();
    const thanaLower = (dto.thana || '').toLowerCase().trim();

    if (thanaLower === 'pakundia') {
      return { fee: 40, estimatedDelivery: '1-3 Hours (Express Local Van)' };
    }
    if (districtLower === 'kishoreganj') {
      return { fee: 60, estimatedDelivery: 'Same-Day Courier' };
    }
    if (['dhaka', 'gazipur', 'narayanganj', 'narsingdi'].includes(districtLower)) {
      return { fee: 100, estimatedDelivery: '24-48 Hours (Steadfast / RedX)' };
    }
    return { fee: 130, estimatedDelivery: '2-3 Days Nationwide Courier' };
  }

  async reserveInventory(dto: ReserveInventoryDto) {
    const reservationTtlSeconds = 600; // 10 minutes hold
    const results = [];

    for (const item of dto.items) {
      const lockKey = `inv:${item.variantId || item.productId}`;
      const token = await this.redis.acquireLock(lockKey, 3000);

      if (!token) {
        throw new BadRequestException('High demand on selected product. Please retry in a few seconds.');
      }

      try {
        let availableStock = 0;
        if (item.variantId) {
          const variant = await this.prisma.productVariant.findUnique({ where: { id: item.variantId } });
          if (!variant) throw new BadRequestException('Invalid product variant selected.');
          availableStock = variant.stock;
        } else {
          const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
          if (!product) throw new BadRequestException('Invalid product selected.');
          availableStock = product.stock;
        }

        if (availableStock < item.quantity) {
          throw new BadRequestException(`Insufficient stock available (Only ${availableStock} in inventory).`);
        }

        await this.redis.reserveStock(item.variantId || item.productId, dto.sessionId, item.quantity, reservationTtlSeconds);
        results.push({ id: item.variantId || item.productId, quantity: item.quantity, status: 'RESERVED' });
      } finally {
        await this.redis.releaseLock(lockKey, token);
      }
    }

    return {
      sessionId: dto.sessionId,
      expiresInSeconds: reservationTtlSeconds,
      reservations: results,
    };
  }

  async placeOrder(dto: PlaceOrderDto, userId?: string) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Your checkout cart is empty.');
    }

    if (dto.paymentMethod !== 'COD' && !dto.bkashTrxId) {
      throw new BadRequestException('bKash/Nagad Transaction ID is required for mobile banking orders.');
    }

    const { fee: deliveryFee } = this.calculateDeliveryFee({
      district: dto.district,
      thana: dto.thana,
    });

    const globalLock = await this.redis.acquireLock('checkout:inventory:global', 6000);
    if (!globalLock) {
      throw new BadRequestException('Checkout servers are busy processing orders. Please retry momentarily.');
    }

    try {
      const order = await this.prisma.$transaction(async (tx) => {
        let itemsSubtotal = 0;
        const verifiedItems = [];

        for (const item of dto.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: { variants: true },
          });

          if (!product || !product.isActive) {
            throw new BadRequestException(`Product is currently unavailable.`);
          }

          let unitPrice = product.basePrice;
          let variant = null;

          if (item.variantId) {
            variant = product.variants.find((v) => v.id === item.variantId);
            if (!variant) throw new BadRequestException(`Product variant not found.`);
            if (variant.stock < item.quantity) {
              throw new BadRequestException(`Out of stock: ${product.title} (${variant.name}) has only ${variant.stock} units left.`);
            }
            unitPrice = variant.price;

            // Atomic decrement variant stock
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            if (product.stock < item.quantity) {
              throw new BadRequestException(`Out of stock: ${product.title} has only ${product.stock} units left.`);
            }

            // Atomic decrement base product stock
            await tx.product.update({
              where: { id: product.id },
              data: { stock: { decrement: item.quantity } },
            });
          }

          itemsSubtotal += unitPrice * item.quantity;
          verifiedItems.push({
            productId: product.id,
            variantId: variant ? variant.id : null,
            quantity: item.quantity,
            unitPrice,
          });
        }

        const totalAmount = itemsSubtotal + deliveryFee;
        const orderNumber = `ORD-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;

        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: userId || null,
            customerName: dto.customerName,
            phone: dto.phone,
            deliveryAddress: dto.deliveryAddress,
            district: dto.district,
            thana: dto.thana,
            totalAmount,
            deliveryFee,
            paymentMethod: dto.paymentMethod as PaymentMethod,
            paymentStatus: dto.paymentMethod === 'COD' ? PaymentStatus.PENDING : PaymentStatus.VERIFIED,
            orderStatus: OrderStatus.CONFIRMED,
            bkashTrxId: dto.bkashTrxId || null,
            paymentSenderNo: dto.paymentSenderNo || null,
            notes: dto.notes || null,
            items: {
              create: verifiedItems,
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

        return createdOrder;
      });

      // Clear Cart from Redis if cartId provided
      if (dto.cartId) {
        await this.redis.deleteCart(dto.cartId);
      }

      // Invalidate catalog caches to reflect updated stock counts
      await this.redis.del('cache:products:featured');

      this.logger.log(`🎉 New Order Created: ${order.orderNumber} (Total: ${order.totalAmount} BDT)`);
      return order;
    } catch (err) {
      this.logger.error(`Checkout transaction failed: ${err.message}`);
      throw err instanceof BadRequestException ? err : new InternalServerErrorException(err.message);
    } finally {
      await this.redis.releaseLock('checkout:inventory:global', globalLock);
    }
  }
}
