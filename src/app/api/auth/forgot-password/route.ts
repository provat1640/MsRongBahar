import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// In-memory store for OTP digital reset tokens
const otpCache = new Map<string, { otp: string; expiresAt: number }>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, phone, otp, newPassword } = body;

    const cleanPhone = phone?.trim() || '';
    if (!cleanPhone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ phone: cleanPhone }, { email: cleanPhone }],
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this phone number or ID.' }, { status: 404 });
    }

    // Step 1: Generate Digital Security Verification OTP
    if (action === 'request-otp') {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins

      otpCache.set(cleanPhone, { otp: generatedOtp, expiresAt });

      return NextResponse.json({
        success: true,
        message: 'Security OTP verification code generated successfully.',
        demoOtp: generatedOtp, // Output in response for instant testing
      });
    }

    // Step 2: Reset Password with Verified OTP
    if (action === 'reset-password') {
      if (!otp || !newPassword) {
        return NextResponse.json({ error: 'OTP and new password are required.' }, { status: 400 });
      }

      const cached = otpCache.get(cleanPhone);
      if (!cached || cached.expiresAt < Date.now()) {
        return NextResponse.json({ error: 'OTP code expired or invalid. Please request a new code.' }, { status: 400 });
      }

      if (cached.otp !== otp.trim()) {
        return NextResponse.json({ error: 'Incorrect OTP verification code.' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      otpCache.delete(cleanPhone);

      return NextResponse.json({
        success: true,
        message: 'Password successfully reset and secured! You can now log in.',
      });
    }

    return NextResponse.json({ error: 'Invalid action parameter.' }, { status: 400 });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Server error during password recovery.' }, { status: 500 });
  }
}
