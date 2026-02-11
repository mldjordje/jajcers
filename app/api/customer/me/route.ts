import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { CUSTOMER_AUTH_COOKIE, CustomerUser } from '@/lib/customer-auth';

export async function GET() {
  const cookieStore = await cookies();
  const encoded = cookieStore.get(CUSTOMER_AUTH_COOKIE)?.value;

  if (!encoded) {
    return NextResponse.json({ user: null });
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CustomerUser;
    if (!parsed?.id || !parsed?.email) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: parsed });
  } catch {
    return NextResponse.json({ user: null });
  }
}
