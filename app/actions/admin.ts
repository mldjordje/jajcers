'use server';

import pool, { isDatabaseConfigured } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface CountRow extends RowDataPacket {
  count: number;
}

interface SumRow extends RowDataPacket {
  total: number | string | null;
}

export interface DashboardStats {
  totalOrders: number;
  monthlyRevenue: number;
  totalUsers: number;
  openOrders: number;
}

export interface AdminRecentOrder extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  total_amount: number | string;
  status: string;
  created_at: Date | string | null;
}

export interface AdminProduct extends RowDataPacket {
  id: number;
  name: string;
  price_per_piece: number | string;
  stock: number | string;
  main_image: string | null;
  created_at: Date | string | null;
}

export interface AdminUser extends RowDataPacket {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  created_at: Date | string | null;
  orders_count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isDatabaseConfigured) {
    return {
      totalOrders: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      openOrders: 0,
    };
  }

  try {
    const [
      [ordersRows],
      [revenueRows],
      [usersRows],
      [openOrdersRows],
    ] = await Promise.all([
      pool.query<CountRow[]>('SELECT COUNT(*) AS count FROM orders'),
      pool.query<SumRow[]>(
        `
          SELECT COALESCE(SUM(total_amount), 0) AS total
          FROM orders
          WHERE YEAR(created_at) = YEAR(CURDATE())
            AND MONTH(created_at) = MONTH(CURDATE())
            AND status <> 'Ne vazeca (Obrisana)'
        `,
      ),
      pool.query<CountRow[]>('SELECT COUNT(*) AS count FROM users'),
      pool.query<CountRow[]>(
        `
          SELECT COUNT(*) AS count
          FROM orders
          WHERE status IN ('pending', 'U obradi', 'Ceka dostavu')
        `,
      ),
    ]);

    return {
      totalOrders: Number(ordersRows[0]?.count ?? 0),
      monthlyRevenue: Number(revenueRows[0]?.total ?? 0),
      totalUsers: Number(usersRows[0]?.count ?? 0),
      openOrders: Number(openOrdersRows[0]?.count ?? 0),
    };
  } catch (error) {
    console.error('Dashboard stats query failed:', error);
    return {
      totalOrders: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      openOrders: 0,
    };
  }
}

export async function getRecentOrders(limit = 7): Promise<AdminRecentOrder[]> {
  if (!isDatabaseConfigured) {
    return [];
  }

  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(50, Math.trunc(limit))) : 7;

  try {
    const [rows] = await pool.query<AdminRecentOrder[]>(
      `
        SELECT id, first_name, last_name, total_amount, status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT ?
      `,
      [normalizedLimit],
    );

    return rows;
  } catch (error) {
    console.error('Recent orders query failed:', error);
    return [];
  }
}

export async function getAdminProducts(limit = 100): Promise<AdminProduct[]> {
  if (!isDatabaseConfigured) {
    return [];
  }

  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(300, Math.trunc(limit))) : 100;

  try {
    const [rows] = await pool.query<AdminProduct[]>(
      `
        SELECT id, name, price_per_piece, stock, main_image, created_at
        FROM products
        ORDER BY id DESC
        LIMIT ?
      `,
      [normalizedLimit],
    );

    return rows;
  } catch (error) {
    console.error('Admin products query failed:', error);
    return [];
  }
}

export async function getAdminUsers(limit = 100): Promise<AdminUser[]> {
  if (!isDatabaseConfigured) {
    return [];
  }

  const normalizedLimit = Number.isFinite(limit) ? Math.max(1, Math.min(300, Math.trunc(limit))) : 100;

  try {
    const [rows] = await pool.query<AdminUser[]>(
      `
        SELECT
          u.id,
          u.firstname,
          u.lastname,
          u.email,
          u.created_at,
          COUNT(o.id) AS orders_count
        FROM users u
        LEFT JOIN orders o ON o.email = u.email
        GROUP BY u.id, u.firstname, u.lastname, u.email, u.created_at
        ORDER BY u.id DESC
        LIMIT ?
      `,
      [normalizedLimit],
    );

    return rows;
  } catch (error) {
    console.error('Admin users query failed:', error);
    return [];
  }
}
