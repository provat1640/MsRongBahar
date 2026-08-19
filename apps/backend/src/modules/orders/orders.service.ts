import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async trackOrder(query: string) {
    const trimmed = query.trim();
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { equals: trimmed, mode: 'insensitive' } },
          { phone: { contains: trimmed } },
        ],
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    if (orders.length === 0) {
      throw new NotFoundException(`No orders found matching "${query}". Please verify your Order ID or mobile number.`);
    }

    return orders.map((order) => {
      // Build dynamic timeline milestones
      const timeline = [
        { title: 'Order Placed', timestamp: order.createdAt, done: true },
        {
          title: 'Order Confirmed',
          timestamp: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus)
            ? order.createdAt
            : null,
          done: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.orderStatus),
        },
        {
          title: 'Packed & Dispatched',
          timestamp: ['SHIPPED', 'DELIVERED'].includes(order.orderStatus) ? order.updatedAt : null,
          done: ['SHIPPED', 'DELIVERED'].includes(order.orderStatus),
        },
        {
          title: 'Out for Delivery / Delivered',
          timestamp: order.orderStatus === 'DELIVERED' ? order.updatedAt : null,
          done: order.orderStatus === 'DELIVERED',
        },
      ];

      return {
        ...order,
        timeline,
        storeInfo: {
          name: 'M/S Rong Bahar (Paint, Hardware & Sanitary)',
          hotline: '01722-452836 / 01812-345678',
          address: 'Mothkhola Road, Pakundia Bazar, Kishoreganj',
          binNumber: 'BIN-192837465-BD',
        },
      };
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order not found.`);
    }

    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.update({
      where: { id },
      data: { orderStatus: status },
      include: { items: true },
    });

    return order;
  }
}
