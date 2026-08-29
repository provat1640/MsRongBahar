import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchProductBySlug, fetchProducts } from '../../../lib/api';
import { ProductDetailClient } from './ProductDetailClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProductBySlug(params.slug);
  if (!product) {
    return {
      title: 'Product Not Found | M/S Rong Bahar',
    };
  }

  const imageUrl = product.images[0] || '/products/2412.jpg';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://msrongbahar.com${imageUrl}`;

  return {
    title: `${product.title} | M/S Rong Bahar Pakundia`,
    description: product.description.slice(0, 160),
    keywords: [
      product.title,
      product.category?.name || 'Paint & Hardware',
      'Pakundia Paint Store',
      'M/S Rong Bahar',
      'Berger Paints',
      product.sku,
    ],
    openGraph: {
      title: `${product.title} | Buy in Pakundia`,
      description: product.description.slice(0, 160),
      url: `https://msrongbahar.com/products/${product.slug}`,
      siteName: 'M/S Rong Bahar',
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description.slice(0, 160),
      images: [fullImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProductBySlug(params.slug);

  // Generate JSON-LD Schema for Google Rich Snippets if product found on server
  const jsonLdProduct = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.images?.map((img) => (img.startsWith('http') ? img : `https://msrongbahar.com${img}`)) || [],
    description: product.description,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.category?.name?.includes('Berger') ? 'Berger' : 'M/S Rong Bahar',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BDT',
      lowPrice: product.basePrice,
      highPrice:
        product.variants && product.variants.length > 0
          ? Math.max(...product.variants.map((v) => v.price))
          : product.basePrice,
      offerCount: product.variants?.length || 1,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'M/S Rong Bahar',
      },
    },
  } : null;

  return (
    <>
      {jsonLdProduct && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
        />
      )}
      <ProductDetailClient initialProduct={product} slug={params.slug} />
    </>
  );
}
