import React from 'react';
import { prisma } from '@/lib/prisma';
import AdminProductsClient from './AdminProductsClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <AdminProductsClient initialProducts={products as any} categories={categories as any} />
    </div>
  );
}
