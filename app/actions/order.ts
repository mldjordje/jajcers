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
    const response = await fetchPhpApiJson<OrdersResponse>('adminOrders.php');
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
