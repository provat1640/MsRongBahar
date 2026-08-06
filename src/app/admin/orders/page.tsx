import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminOrdersClient from '@/app/admin/orders/AdminOrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <AdminOrdersClient initialOrders={orders as any} />
    </div>
  );
}
