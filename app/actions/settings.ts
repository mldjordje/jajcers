'use server';

import { buildPhpApiUrl, fetchPhpApiJson } from '@/lib/php-api';

export interface AppSettings {
  delivery_fee_bg: string;
  nis_delivery_window_text: string;
  bg_delivery_window_text: string;
  discount_enabled: string;
  discount_percent: string;
  discount_every_n_orders: string;
}

const defaultSettings: AppSettings = {
  delivery_fee_bg: '250',
  nis_delivery_window_text: 'Dostava u Nisu radnim danima 18:00-21:00.',
  bg_delivery_window_text: 'Dostava u Beogradu subotom, termin se javlja u petak.',
  discount_enabled: '1',
  discount_percent: '10',
  discount_every_n_orders: '5',
};

export async function getAdminSettings(): Promise<AppSettings> {
  try {
    const response = await fetchPhpApiJson<{ status?: string; settings?: Partial<AppSettings> }>('adminSettings.php');
    if (response.status === 'success') {
      return { ...defaultSettings, ...(response.settings ?? {}) };
    }
  } catch (error) {
    console.error('getAdminSettings failed:', error);
  }
  return defaultSettings;
}

export async function saveAdminSettings(input: Partial<AppSettings>): Promise<{ success: boolean; message?: string }> {
  try {
    const body = new URLSearchParams();
    Object.entries(input).forEach(([key, value]) => {
      body.set(key, String(value ?? ''));
    });

    const response = await fetch(buildPhpApiUrl('adminSettings.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });

    const payload = (await response.json()) as { status?: string; message?: string };
    if (!response.ok || payload.status !== 'success') {
      return { success: false, message: payload.message || 'Cuvanje nije uspelo.' };
    }

    return { success: true };
  } catch (error) {
    console.error('saveAdminSettings failed:', error);
    return { success: false, message: 'Servis nije dostupan.' };
  }
}
