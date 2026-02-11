import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';

interface Payload {
  ids?: number[];
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ status: 'error', message: 'Invalid JSON payload.' }, { status: 400 });
  }

  const ids = (body.ids ?? []).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0);
  if (ids.length === 0) {
    return NextResponse.json({ status: 'success', products: [] });
  }

  const upstream = new URLSearchParams();
  upstream.set('ids_json', JSON.stringify(ids));

  try {
    const response = await fetch(buildPhpApiUrl('getProductsByIds.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: upstream.toString(),
      cache: 'no-store',
    });

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.ok ? 200 : response.status });
  } catch (error) {
    console.error('products/by-ids proxy failed:', error);
    return NextResponse.json({ status: 'error', message: 'Service unavailable.' }, { status: 503 });
  }
}
