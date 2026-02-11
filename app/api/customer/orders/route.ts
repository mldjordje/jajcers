import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';
import { CUSTOMER_AUTH_COOKIE, CustomerUser } from '@/lib/customer-auth';

function readUserFromCookie(encoded?: string): CustomerUser | null {
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CustomerUser;
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const user = readUserFromCookie(cookieStore.get(CUSTOMER_AUTH_COOKIE)?.value);

  if (!user) {
    return NextResponse.json({ status: 'error', message: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const response = await fetch(
      buildPhpApiUrl(`customerOrders.php?user_id=${encodeURIComponent(String(user.id))}`),
      { cache: 'no-store' },
    );

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('customer orders proxy failed:', error);
    return NextResponse.json({ status: 'error', message: 'Orders service unavailable.' }, { status: 503 });
  }
}
