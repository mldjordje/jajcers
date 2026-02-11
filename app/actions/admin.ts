'use server';

import { fetchPhpApiJson } from '@/lib/php-api';

export interface DashboardStats {
  totalOrders: number;
  monthlyRevenue: number;
  totalUsers: number;
  openOrders: number;
}

export interface AdminRecentOrder {
  id: number;
  first_name: string;
  last_name: string;
  total_amount: number | string;
  status: string;
  created_at: string | null;
}

export interface AdminProduct {
  id: number;
  name: string;
  price_per_piece: number | string;
  stock: number | string;
  main_image: string | null;
  created_at: string | null;
}

export interface AdminUser {
  id: number;
  firstname: string | null;
  lastname: string | null;
  email: string;
  created_at: string | null;
  orders_count: number;
}

interface DashboardStatsResponse {
  status: string;
  stats?: DashboardStats;
}

interface RecentOrdersResponse {
  status: string;
  orders?: AdminRecentOrder[];
}

interface AdminProductsResponse {
  status: string;
  products?: AdminProduct[];
}

interface AdminUsersResponse {
  status: string;
  users?: AdminUser[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await fetchPhpApiJson<DashboardStatsResponse>('adminStats.php');
    if (response.status === 'success' && response.stats) {
      return response.stats;
    }
  } catch (error) {
    console.error('getDashboardStats failed:', error);
  }

  return {
    totalOrders: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
    openOrders: 0,
  };
}

export async function getRecentOrders(limit = 7): Promise<AdminRecentOrder[]> {
  try {
    const response = await fetchPhpApiJson<RecentOrdersResponse>(
      `adminRecentOrders.php?limit=${encodeURIComponent(String(limit))}`,
    );
    return response.status === 'success' ? response.orders ?? [] : [];
  } catch (error) {
    console.error('getRecentOrders failed:', error);
    return [];
  }
}

export async function getAdminProducts(limit = 100): Promise<AdminProduct[]> {
  try {
    const response = await fetchPhpApiJson<AdminProductsResponse>(
      `adminProducts.php?limit=${encodeURIComponent(String(limit))}`,
    );
    return response.status === 'success' ? response.products ?? [] : [];
  } catch (error) {
    console.error('getAdminProducts failed:', error);
    return [];
  }
}

export async function getAdminUsers(limit = 100): Promise<AdminUser[]> {
  try {
    const response = await fetchPhpApiJson<AdminUsersResponse>(
      `adminUsers.php?limit=${encodeURIComponent(String(limit))}`,
    );
    return response.status === 'success' ? response.users ?? [] : [];
  } catch (error) {
    console.error('getAdminUsers failed:', error);
    return [];
  }
}
