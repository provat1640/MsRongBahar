import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getDashboardMetrics() {
    const [totalOrders, pendingOrders, completedOrders, usersCount, products] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { orderStatus: 'PENDING' } }),
      this.prisma.order.count({ where: { orderStatus: 'DELIVERED' } }),
      this.prisma.user.count(),
      this.prisma.product.findMany({
        include: { variants: true, category: true },
      }),
    ]);

    const deliveredOrders = await this.prisma.order.findMany({
      where: { orderStatus: 'DELIVERED' },
      select: { totalAmount: true },
    });

    const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const lowStockItems = [];
    products.forEach((p) => {
      if (p.stock <= 10) {
        lowStockItems.push({
          id: p.id,
          title: p.title,
          sku: p.sku,
          stock: p.stock,
          unit: p.unit,
        });
      }
      p.variants.forEach((v) => {
        if (v.stock <= 10) {
          lowStockItems.push({
            id: v.id,
            title: `${p.title} (${v.name})`,
            sku: v.sku,
            stock: v.stock,
            unit: p.unit,
          });
        }
      });
    });

    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true, variant: true } } },
    });

    const pendingRequests = await this.prisma.productRequest.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    return {
      metrics: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalCustomers: usersCount,
        totalProducts: products.length,
        lowStockAlertCount: lowStockItems.length,
      },
      lowStockItems,
      recentOrders,
      pendingRequests,
    };
  }

  async updateStock(id: string, isVariant: boolean, stock: number) {
    if (isVariant) {
      await this.prisma.productVariant.update({
        where: { id },
        data: { stock },
      });
    } else {
      await this.prisma.product.update({
        where: { id },
        data: { stock },
      });
    }

    // Invalidate caches
    await this.redis.del('cache:products:featured');
    return { success: true, updatedStock: stock };
  }
}
