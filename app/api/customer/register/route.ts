import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';
import { CUSTOMER_AUTH_COOKIE, CustomerUser } from '@/lib/customer-auth';

interface RegisterPayload {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  confirmpassword?: string;
}

export async function POST(request: Request) {
  let body: RegisterPayload;

  try {
    body = (await request.json()) as RegisterPayload;
  } catch {
    return NextResponse.json({ success: false, message: 'Neispravan JSON payload.' }, { status: 400 });
  }

  const firstname = body.firstname?.trim() ?? '';
  const lastname = body.lastname?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const password = body.password ?? '';
  const confirmpassword = body.confirmpassword ?? '';

  if (!firstname || !lastname || !email || !password || !confirmpassword) {
    return NextResponse.json({ success: false, message: 'Sva polja su obavezna.' }, { status: 400 });
  }

  const upstreamBody = new URLSearchParams();
  upstreamBody.set('firstname', firstname);
  upstreamBody.set('lastname', lastname);
  upstreamBody.set('email', email);
  upstreamBody.set('password', password);
  upstreamBody.set('confirmpassword', confirmpassword);
  upstreamBody.set('honeypot', '');

  try {
    const response = await fetch(buildPhpApiUrl('register.php'), {
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
        { success: false, message: payload.message || 'Registracija nije uspela.' },
        { status: 400 },
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
    console.error('customer register failed:', error);
    return NextResponse.json(
      { success: false, message: 'Servis za registraciju nije dostupan.' },
      { status: 503 },
    );
  }
}
