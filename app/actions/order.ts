'use server';

import { buildPhpApiUrl, fetchPhpApiJson } from '@/lib/php-api';
import { isAllowedOrderStatus } from '@/lib/order-status';

export interface OrderRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number | string;
  status: string;
  created_at: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  note: string | null;
}

export interface OrderItemRow {
  product_id: number;
  quantity: number;
  price: number | string;
  name: string | null;
  main_image: string | null;
}

export interface OrderWithItems extends OrderRow {
  items: OrderItemRow[];
}

interface OrderResponse {
  status: string;
  order?: OrderWithItems | null;
}

interface OrdersResponse {
  status: string;
  orders: OrderRow[];
}

interface DeliveryRouteResponse {
  status: string;
  orders?: OrderRow[];
}

interface CreateOrderPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: 'Nis' | 'Beograd';
  note?: string;
  status?: string;
  source?: string;
  items: Array<{ product_id: number; quantity: number; price: number }>;
}

export async function getOrder(orderId: number, email: string): Promise<OrderWithItems | null> {
  try {
    const query = `order_id=${encodeURIComponent(String(orderId))}&email=${encodeURIComponent(email)}`;
    const response = await fetchPhpApiJson<OrderResponse>(`orderTrack.php?${query}`);
    return response.status === 'success' ? response.order ?? null : null;
  } catch (error) {
    console.error('getOrder failed:', error);
    return null;
  }
}

export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  try {
    const response = await fetchPhpApiJson<OrderResponse>(
      `adminOrder.php?id=${encodeURIComponent(String(orderId))}`,
    );
    return response.status === 'success' ? response.order ?? null : null;
  } catch (error) {
    console.error('getOrderById failed:', error);
    return null;
  }
}

export async function getAllOrders(): Promise<OrderRow[]> {
  try {
    const response = await fetchPhpApiJson<OrdersResponse>('adminOrders.php?limit=300');
    return response.status === 'success' ? response.orders ?? [] : [];
  } catch (error) {
    console.error('getAllOrders failed:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  if (!isAllowedOrderStatus(status)) {
    return { success: false, error: 'Unsupported status value.' };
  }

  try {
    const body = new URLSearchParams();
    body.set('order_id', String(orderId));
    body.set('status', status);

    const response = await fetch(buildPhpApiUrl('adminUpdateOrderStatus.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
      cache: 'no-store',
    });

    const payload = (await response.json()) as { status?: string; message?: string };

    if (!response.ok || payload.status !== 'success') {
      return { success: false, error: payload.message || 'Update failed.' };
    }

    return { success: true };
  } catch (error) {
    console.error('updateOrderStatus failed:', error);
    return { success: false, error: 'Update request failed.' };
  }
}

export async function getDeliveryRoute(city: 'Nis' | 'Beograd', date: string): Promise<OrderRow[]> {
  try {
    const query = `city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`;
    const response = await fetchPhpApiJson<DeliveryRouteResponse>(`adminDeliveryRoutes.php?${query}`);
    return response.status === 'success' ? response.orders ?? [] : [];
  } catch (error) {
    console.error('getDeliveryRoute failed:', error);
    return [];
  }
}

export async function saveDeliveryRouteOrder(
  city: 'Nis' | 'Beograd',
  orderIds: number[],
): Promise<{ success: boolean; message?: string }> {
  try {
    const body = new URLSearchParams();
    body.set('city', city);
    body.set('order_ids', JSON.stringify(orderIds));

    const response = await fetch(buildPhpApiUrl('adminDeliveryRouteOrder.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });
    const payload = (await response.json()) as { status?: string; message?: string };
    if (!response.ok || payload.status !== 'success') {
      return { success: false, message: payload.message || 'Snimanje nije uspelo.' };
    }
    return { success: true };
  } catch (error) {
    console.error('saveDeliveryRouteOrder failed:', error);
    return { success: false, message: 'Servis nije dostupan.' };
  }
}

export async function createManualOrder(input: CreateOrderPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const body = new URLSearchParams();
    body.set('first_name', input.first_name);
    body.set('last_name', input.last_name);
    body.set('email', input.email);
    body.set('phone', input.phone);
    body.set('address', input.address);
    body.set('city', input.city);
    body.set('note', input.note || '');
    body.set('status', input.status || 'pending');
    body.set('source', input.source || 'manual');
    body.set('items', JSON.stringify(input.items));

    const response = await fetch(buildPhpApiUrl('adminCreateOrder.php'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });
    const payload = (await response.json()) as { status?: string; message?: string };

    if (!response.ok || payload.status !== 'success') {
      return { success: false, message: payload.message || 'Kreiranje porudzbine nije uspelo.' };
    }
    return { success: true, message: payload.message };
  } catch (error) {
    console.error('createManualOrder failed:', error);
    return { success: false, message: 'Servis nije dostupan.' };
  }
}
