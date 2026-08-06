import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const units = await prisma.unit.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ units });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category } = body;

    if (!name) {
      return NextResponse.json({ error: 'Unit name is required' }, { status: 400 });
    }

    const unit = await prisma.unit.create({
      data: {
        name,
        category: category || 'General',
      },
    });

    return NextResponse.json({ unit }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Unit ID is required' }, { status: 400 });
    }

    await prisma.unit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
