'use server';

import pool, { isDatabaseConfigured } from '@/lib/db';
import { isAllowedOrderStatus } from '@/lib/order-status';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface OrderRow extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number | string;
  status: string;
  created_at: Date | string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  note: string | null;
}

export interface OrderItemRow extends RowDataPacket {
  product_id: number;
  quantity: number;
  price: number | string;
  name: string | null;
  main_image: string | null;
}

export interface OrderWithItems extends OrderRow {
  items: OrderItemRow[];
}

async function getOrderItems(orderId: number): Promise<OrderItemRow[]> {
  const [items] = await pool.query<OrderItemRow[]>(
    `
      SELECT
        oi.product_id,
        oi.quantity,
        oi.price,
        p.name,
        p.main_image
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = ?
      ORDER BY oi.id ASC
    `,
    [orderId],
  );

  return items;
}

export async function getOrder(orderId: number, email: string): Promise<OrderWithItems | null> {
  if (!isDatabaseConfigured) {
    return null;
  }

  try {
    const [orders] = await pool.query<OrderRow[]>(
      'SELECT * FROM orders WHERE id = ? AND email = ? LIMIT 1',
      [orderId, email],
    );

    if (orders.length === 0) {
      return null;
    }

    const items = await getOrderItems(orderId);
    return { ...orders[0], items };
  } catch (error) {
    console.error('Order lookup failed:', error);
    return null;
  }
}

export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  if (!isDatabaseConfigured) {
    return null;
  }

  try {
    const [orders] = await pool.query<OrderRow[]>('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);

    if (orders.length === 0) {
      return null;
    }

    const items = await getOrderItems(orderId);
    return { ...orders[0], items };
  } catch (error) {
    console.error('Admin order lookup failed:', error);
    return null;
  }
}

export async function getAllOrders(): Promise<OrderRow[]> {
  if (!isDatabaseConfigured) {
    return [];
  }

  try {
    const [rows] = await pool.query<OrderRow[]>('SELECT * FROM orders ORDER BY created_at DESC');
    return rows;
  } catch (error) {
    console.error('Database error while reading orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  if (!isDatabaseConfigured) {
    return { success: false, error: 'Baza nije konfigurisana.' };
  }

  if (!isAllowedOrderStatus(status)) {
    return { success: false, error: 'Unsupported status value.' };
  }

  try {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, orderId],
    );

    if (result.affectedRows === 0) {
      return { success: false, error: 'Order not found.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Order status update failed:', error);
    return { success: false, error: 'Database update failed.' };
  }
}
