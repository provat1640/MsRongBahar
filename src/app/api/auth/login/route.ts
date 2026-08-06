import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, AUTH_COOKIE_NAME } from '@/lib/auth';

// Enterprise Rate Limiting Protection (Brute Force Lockout Guard)
const failedLoginTracker = new Map<string, { attempts: number; lockUntil: number }>();

export async function POST(request: Request) {
  try {
    const { loginId, password } = await request.json();

    const cleanLoginId = loginId?.trim() || '';
    if (!cleanLoginId || !password) {
      return NextResponse.json({ error: 'Phone number/Email and password are required.' }, { status: 400 });
    }

    // Check rate limit lockout
    const tracker = failedLoginTracker.get(cleanLoginId);
    if (tracker && tracker.lockUntil > Date.now()) {
      const waitMins = Math.ceil((tracker.lockUntil - Date.now()) / 60000);
      return NextResponse.json({
        error: `Account security lockout active due to multiple failed attempts. Please try again in ${waitMins} minute(s) or use Forgotten Password recovery.`,
      }, { status: 429 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanLoginId }, { email: cleanLoginId }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid login credentials. Check phone number or password.' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      // Record failed attempt
      const attempts = (tracker?.attempts || 0) + 1;
      let lockUntil = 0;
      if (attempts >= 5) {
        lockUntil = Date.now() + 15 * 60 * 1000; // 15 min lock out
      }
      failedLoginTracker.set(cleanLoginId, { attempts, lockUntil });

      return NextResponse.json({
        error: `Invalid login password. ${5 - (attempts % 5)} attempts remaining before security lockout.`,
      }, { status: 401 });
    }

    // Reset tracker on successful login
    failedLoginTracker.delete(cleanLoginId);

    const sessionData = {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role as 'USER' | 'ADMIN',
    };

    const token = signToken(sessionData);

    const response = NextResponse.json({ success: true, user: sessionData });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Enterprise Login error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
