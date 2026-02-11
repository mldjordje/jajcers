import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid form payload.' }, { status: 400 });
  }

  const upstreamBody = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    upstreamBody.set(key, String(value));
  }

  try {
    const response = await fetch(buildPhpApiUrl('contact.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: upstreamBody.toString(),
      cache: 'no-store',
    });

    const payload = (await response.json()) as { status?: string; message?: string };
    return NextResponse.json(payload, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('Contact proxy error:', error);
    return NextResponse.json({ status: 'error', message: 'Contact service unavailable.' }, { status: 503 });
  }
}
