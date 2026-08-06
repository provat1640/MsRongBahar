import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  let images: string[] = ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800'];
  try {
    const parsed = JSON.parse(product.images);
    if (Array.isArray(parsed) && parsed.length > 0) images = parsed;
  } catch (e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-amber-400">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-400">Products</Link>
        <span>/</span>
        <span className="text-slate-200">{product.title}</span>
      </div>

      <ProductDetailClient product={product as any} images={images} />
    </div>
  );
}
