import { NextResponse } from 'next/server';
import { buildPhpApiUrl } from '@/lib/php-api';

interface CheckoutItemInput {
  product_id: number;
  quantity: number;
}

interface CheckoutRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: 'Nis' | 'Beograd';
  note?: string;
  customerUserId?: number;
  couponCode?: string;
  cartItems: CheckoutItemInput[];
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;

  try {
    body = (await request.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 });
  }

  if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.address || !body.cartItems?.length) {
    return NextResponse.json({ message: 'Missing checkout fields.' }, { status: 400 });
  }

  const formData = new URLSearchParams();
  formData.set('first_name', body.firstName);
  formData.set('last_name', body.lastName);
  formData.set('email', body.email);
  formData.set('phone', body.phone);
  formData.set('address', body.address);
  formData.set('city', body.city || 'Nis');
  formData.set('note', body.note || '');
  formData.set('cart_json', JSON.stringify(body.cartItems));
  if (body.customerUserId && body.customerUserId > 0) {
    formData.set('customer_user_id', String(body.customerUserId));
  }
  if (body.couponCode) {
    formData.set('coupon_code', body.couponCode);
  }

  try {
    const response = await fetch(buildPhpApiUrl('checkout.php'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      cache: 'no-store',
    });

    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      orderId?: number;
      summary?: {
        subtotal: number;
        delivery_fee: number;
        discount_amount: number;
        grand_total: number;
      };
    };

    if (!response.ok || payload.status !== 'success') {
      return NextResponse.json({ message: payload.message || 'Checkout failed.' }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: payload.message || 'Order created.',
      orderId: payload.orderId,
      summary: payload.summary,
    });
  } catch (error) {
    console.error('Checkout proxy error:', error);
    return NextResponse.json({ message: 'Checkout service is unavailable.' }, { status: 503 });
  }
}
