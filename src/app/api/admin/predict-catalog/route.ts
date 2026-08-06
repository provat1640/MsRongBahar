import { NextResponse } from 'next/server';
import { predictCatalogMetadata } from '@/lib/ml-predictor';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Title string is required' }, { status: 400 });
    }

    const prediction = predictCatalogMetadata(title);
    return NextResponse.json({ prediction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
