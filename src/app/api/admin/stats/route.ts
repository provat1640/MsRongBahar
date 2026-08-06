import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized Admin Access' }, { status: 401 });
    }

    // 1. Total Sales
    const totalSalesResult = await prisma.order.aggregate({
      where: {
        orderStatus: { notIn: ['CANCELLED'] },
      },
      _sum: {
        totalAmount: true,
      },
    });
    const totalSales = totalSalesResult._sum.totalAmount || 0;

    // 2. Pending Orders
    const pendingOrdersCount = await prisma.order.count({
      where: { orderStatus: 'PENDING' },
    });

    // 3. Low Stock Items (< 5 units)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lt: 5 },
      },
      include: { category: true },
    });

    const lowStockVariants = await prisma.productVariant.findMany({
      where: {
        stock: { lt: 5 },
      },
      include: { product: true },
    });

    const totalLowStockAlerts = lowStockProducts.length + lowStockVariants.length;

    // 4. Total Customers
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' },
    });

    // 5. Recent Orders
    const recentOrders = await prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalSales,
        pendingOrdersCount,
        totalLowStockAlerts,
        totalCustomers,
      },
      lowStockItems: {
        products: lowStockProducts,
        variants: lowStockVariants,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
