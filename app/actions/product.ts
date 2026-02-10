'use server';

import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
    id: number;
    name: string;
    price_per_piece: number;
    main_image: string;
}

export async function getProductsByIds(ids: number[]) {
    if (ids.length === 0) return [];

    try {
        const placeholders = ids.map(() => '?').join(',');
        const query = `SELECT id, name, price_per_piece, main_image, stock FROM products WHERE id IN (${placeholders})`;
        const [rows] = await pool.query<Product[]>(query, ids);
        return rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}
