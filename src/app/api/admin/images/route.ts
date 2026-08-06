import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const publicProductsDir = path.join(process.cwd(), 'public', 'products');
    if (!fs.existsSync(publicProductsDir)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(publicProductsDir);
    const imageFiles = files
      .filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .map((file) => `/products/${file}`);

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error('Error reading local product images:', error);
    return NextResponse.json({ images: [] });
  }
}
