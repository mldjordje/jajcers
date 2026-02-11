import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';
import { CUSTOMER_AUTH_COOKIE, CustomerUser } from '@/lib/customer-auth';

interface LoginPayload {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ success: false, message: 'Neispravan JSON payload.' }, { status: 400 });
  }

  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';

  if (!email || !password) {
    return NextResponse.json({ success: false, message: 'Email i lozinka su obavezni.' }, { status: 400 });
  }

  const upstreamBody = new URLSearchParams();
  upstreamBody.set('email', email);
  upstreamBody.set('password', password);

  try {
    const response = await fetch(buildPhpApiUrl('login.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: upstreamBody.toString(),
      cache: 'no-store',
    });

    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      user?: CustomerUser;
    };

    if (!response.ok || payload.status !== 'success' || !payload.user) {
      return NextResponse.json(
        { success: false, message: payload.message || 'Prijava nije uspela.' },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: CUSTOMER_AUTH_COOKIE,
      value: Buffer.from(JSON.stringify(payload.user)).toString('base64url'),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14,
    });

    return NextResponse.json({ success: true, user: payload.user });
  } catch (error) {
    console.error('customer login failed:', error);
    return NextResponse.json({ success: false, message: 'Servis za prijavu nije dostupan.' }, { status: 503 });
  }
}
