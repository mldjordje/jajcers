import { NextResponse } from 'next/server';
import { fetchPhpApiJson } from '@/lib/php-api';

export async function GET() {
  try {
    const payload = await fetchPhpApiJson<{
      status?: string;
      settings?: Record<string, string>;
      public_settings?: Record<string, string>;
    }>('adminSettings.php');

    const settings = payload.public_settings ?? payload.settings ?? {};
    return NextResponse.json({ status: 'success', settings });
  } catch (error) {
    console.error('public settings proxy failed:', error);
    return NextResponse.json({ status: 'error', settings: {} }, { status: 200 });
  }
}
