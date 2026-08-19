import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { CartItemDto, SyncCartDto } from './cart.dto';

export interface PopulatedCartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
  productTitle: string;
  variantName?: string | null;
  unitPrice: number;
  lineTotal: number;
  image: string;
  unit: string;
  maxStock: number;
}

export interface PopulatedCart {
  cartId: string;
  items: PopulatedCartItem[];
  itemCount: number;
  subtotal: number;
  updatedAt: number;
}

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getCart(cartId: string): Promise<PopulatedCart> {
    const rawCart = await this.redis.getCart(cartId);
    if (!rawCart || !Array.isArray(rawCart.items) || rawCart.items.length === 0) {
      return {
        cartId,
        items: [],
        itemCount: 0,
        subtotal: 0,
        updatedAt: Date.now(),
      };
    }

    return this.recalculateCart(cartId, rawCart.items);
  }

  async addItem(cartId: string, item: CartItemDto): Promise<PopulatedCart> {
    const current = await this.redis.getCart(cartId);
    let items: CartItemDto[] = current && Array.isArray(current.items) ? current.items : [];

    const existingIndex = items.findIndex(
      (i) => i.productId === item.productId && (i.variantId || null) === (item.variantId || null),
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    const calculated = await this.recalculateCart(cartId, items);
    await this.redis.setCart(cartId, { items });
    return calculated;
  }

  async updateItemQuantity(cartId: string, productId: string, variantId: string | undefined, quantity: number): Promise<PopulatedCart> {
    const current = await this.redis.getCart(cartId);
    let items: CartItemDto[] = current && Array.isArray(current.items) ? current.items : [];

    if (quantity <= 0) {
      items = items.filter(
        (i) => !(i.productId === productId && (i.variantId || null) === (variantId || null)),
      );
    } else {
      const match = items.find(
        (i) => i.productId === productId && (i.variantId || null) === (variantId || null),
      );
      if (match) {
        match.quantity = quantity;
      }
    }

    const calculated = await this.recalculateCart(cartId, items);
    await this.redis.setCart(cartId, { items });
    return calculated;
  }

  async removeItem(cartId: string, productId: string, variantId?: string): Promise<PopulatedCart> {
    return this.updateItemQuantity(cartId, productId, variantId, 0);
  }

  async clearCart(cartId: string): Promise<void> {
    await this.redis.deleteCart(cartId);
  }

  async syncCart(cartId: string, syncDto: SyncCartDto): Promise<PopulatedCart> {
    const calculated = await this.recalculateCart(cartId, syncDto.items);
    await this.redis.setCart(cartId, { items: syncDto.items });
    return calculated;
  }

  private async recalculateCart(cartId: string, items: CartItemDto[]): Promise<PopulatedCart> {
    const populatedItems: PopulatedCartItem[] = [];
    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) continue;

      let unitPrice = product.basePrice;
      let variantName: string | null = null;
      let availableStock = product.stock;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (variant) {
          unitPrice = variant.price;
          variantName = variant.name;
          availableStock = variant.stock;
        }
      }

      const qty = Math.min(item.quantity, Math.max(availableStock, 1));
      const lineTotal = unitPrice * qty;
      subtotal += lineTotal;
      itemCount += qty;

      let images: string[] = [];
      try {
        images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      } catch {
        images = ['/products/2412.jpg'];
      }

      populatedItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        quantity: qty,
        productTitle: product.title,
        variantName,
        unitPrice,
        lineTotal,
        image: images[0] || '/products/2412.jpg',
        unit: product.unit,
        maxStock: availableStock,
      });
    }

    return {
      cartId,
      items: populatedItems,
      itemCount,
      subtotal,
      updatedAt: Date.now(),
    };
  }
}
