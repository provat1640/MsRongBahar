import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserSession } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'rong-bahar-super-secret-key-2026';
export const AUTH_COOKIE_NAME = 'rb_session';

export function signToken(payload: UserSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession;
  } catch (error) {
    return null;
  }
}

export function getSession(): UserSession | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
