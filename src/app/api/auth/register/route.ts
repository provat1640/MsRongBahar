import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, phone, email, password, address, district, thana } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, phone number, and password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ phone }, ...(email ? [{ email }] : [])],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this phone number or email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email: email || null,
        password: hashedPassword,
        role: 'USER',
        address: address || null,
        district: district || null,
        thana: thana || null,
      },
    });

    const sessionData = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: 'USER' as const,
    };

    const token = signToken(sessionData);

    const response = NextResponse.json({ success: true, user: sessionData });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
