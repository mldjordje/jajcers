import { NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE, getAdminAuthToken, isValidAdminCredentials } from '@/lib/admin-auth';

interface LoginPayload {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ success: false, message: 'Neispravan JSON payload.' }, { status: 400 });
  }

  const username = body.username?.trim() ?? '';
  const password = body.password ?? '';

  if (!isValidAdminCredentials(username, password)) {
    return NextResponse.json({ success: false, message: 'Pogresno korisnicko ime ili lozinka.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: getAdminAuthToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });

  return response;
}
