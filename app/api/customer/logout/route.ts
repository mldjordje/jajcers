import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CUSTOMER_AUTH_COOKIE } from '@/lib/customer-auth';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CUSTOMER_AUTH_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}
