import { NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: '',
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });
  return response;
}
