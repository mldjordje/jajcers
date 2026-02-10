import { NextResponse } from 'next/server';
import pool, { isDatabaseConfigured } from '@/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface CheckoutCartItem {
    product_id: number;
    quantity: number;
}

interface CheckoutPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city?: string;
    note?: string;
    cartItems: CheckoutCartItem[];
}

interface ProductPriceRow extends RowDataPacket {
    id: number;
    price_per_piece: number;
}

export async function POST(request: Request) {
    if (!isDatabaseConfigured) {
        return NextResponse.json(
            { message: 'Baza nije konfigurisana. Proverite DB_* varijable.' },
            { status: 503 },
        );
    }

    try {
        const body = (await request.json()) as CheckoutPayload;
        const { firstName, lastName, email, phone, address, city, note, cartItems } = body;

        if (!firstName || !lastName || !email || !phone || !address || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ message: 'Nedostaju podaci za porudzbinu.' }, { status: 400 });
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            let total = 0;

            const productIds = cartItems.map((item) => item.product_id);
            const [products] = await connection.query<ProductPriceRow[]>(
                'SELECT id, price_per_piece FROM products WHERE id IN (?)',
                [productIds],
            );

            const dbItems = cartItems.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                if (!product) {
                    throw new Error(`Proizvod ID ${item.product_id} ne postoji.`);
                }
                total += product.price_per_piece * item.quantity;
                return { ...item, price: product.price_per_piece };
            });

            const [orderResult] = await connection.query<ResultSetHeader>(
                `INSERT INTO orders (user_id, first_name, last_name, email, phone, address, city, note, total_amount, status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
                [null, firstName, lastName, email, phone, address, city ?? 'Nis', note ?? '', total, 'pending'],
            );

            const orderId = orderResult.insertId;

            for (const item of dbItems) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price],
                );
            }

            await connection.commit();
            return NextResponse.json({ status: 'success', orderId, message: 'Porudzbina je uspesno kreirana.' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error: unknown) {
        console.error('Checkout API Error:', error);

        if (error instanceof Error && error.message.includes('Access denied')) {
            return NextResponse.json({ message: 'Neuspesna konekcija ka bazi.' }, { status: 503 });
        }

        const message = error instanceof Error ? error.message : 'Greska na serveru';
        return NextResponse.json({ message }, { status: 500 });
    }
}
