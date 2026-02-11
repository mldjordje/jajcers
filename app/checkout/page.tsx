'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getProductsByIds } from '@/app/actions/product';
import { clearCart, getCartEntries } from '@/lib/cart-client';

interface CartItem {
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  subtotal?: number;
}

interface SessionUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface AppSettings {
  delivery_fee_bg: string;
  nis_delivery_window_text: string;
  bg_delivery_window_text: string;
}

const defaultSettings: AppSettings = {
  delivery_fee_bg: '250',
  nis_delivery_window_text: 'Dostava u Nisu radnim danima 18:00-21:00.',
  bg_delivery_window_text: 'Dostava u Beogradu subotom, termin se javlja u petak.',
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);
  const [orderMessage, setOrderMessage] = useState('');
  const [customer, setCustomer] = useState<SessionUser | null>(null);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState<'Nis' | 'Beograd'>('Nis');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const meResponse = await fetch('/api/customer/me', { cache: 'no-store' });
        const mePayload = (await meResponse.json()) as { user: SessionUser | null };
        if (!mePayload.user) {
          window.location.href = '/login?next=/checkout';
          return;
        }
        setCustomer(mePayload.user);
        setFirstName(mePayload.user.firstname ?? '');
        setLastName(mePayload.user.lastname ?? '');
        setEmail(mePayload.user.email ?? '');

        const settingsResponse = await fetch('/api/public/settings', { cache: 'no-store' });
        const settingsPayload = (await settingsResponse.json()) as {
          settings?: Partial<AppSettings>;
        };
        setSettings((prev) => ({ ...prev, ...(settingsPayload.settings ?? {}) }));
      } catch {
        window.location.href = '/login?next=/checkout';
        return;
      }

      const storedCart = getCartEntries();
      if (storedCart.length === 0) {
        setLoading(false);
        return;
      }

      const ids = storedCart.map((item) => item.product_id);
      try {
        const products = await getProductsByIds(ids);
        const mergedItems = storedCart
          .map((item) => {
            const product = products.find((p: { id: number }) => p.id === item.product_id);
            if (!product) return null;

            return {
              ...item,
              name: product.name,
              price: product.price_per_piece,
              subtotal: product.price_per_piece * item.quantity,
            };
          })
          .filter(Boolean) as CartItem[];

        setCartItems(mergedItems);
      } catch {
        setCartItems([]);
      }

      setLoading(false);
    };

    void load();
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0),
    [cartItems],
  );
  const deliveryFee = city === 'Beograd' ? Number(settings.delivery_fee_bg || 250) : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      window.location.href = '/login?next=/checkout';
      return;
    }

    setIsSubmitting(true);
    const orderData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      note,
      customerUserId: customer.id,
      cartItems: cartItems.map(({ product_id, quantity }) => ({ product_id, quantity })),
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = (await res.json()) as { orderId?: number; message?: string };

      if (res.ok && data.orderId) {
        setOrderSuccess(data.orderId);
        setOrderMessage(data.message || '');
        clearCart();
      } else {
        alert(data.message || 'Greska prilikom porucivanja.');
      }
    } catch {
      alert('Doslo je do greske.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container pt-100 pb-100 text-center">
        <h2>Hvala na porudzbini!</h2>
        <p>
          Broj vase porudzbine je: <strong>#{orderSuccess}</strong>
        </p>
        {orderMessage ? <p>{orderMessage}</p> : null}
        <Link href="/" className="theme-btn-1 btn btn-effect-1 mt-20">
          Nazad na pocetnu
        </Link>
      </div>
    );
  }

  if (loading) return <div className="container pt-100 pb-100 text-center">Ucitavanje...</div>;

  if (!customer) return <div className="container pt-100 pb-100 text-center">Preusmeravanje na prijavu...</div>;

  return (
    <div className="ltn__checkout-area mb-105 pt-80">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="ltn__checkout-inner">
              <h4 className="title-2">Podaci za placanje</h4>
              <div className="ltn__checkout-single-content-info">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-item input-item-name ltn__custom-icon">
                        <input type="text" placeholder="Ime *" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item input-item-name ltn__custom-icon">
                        <input type="text" placeholder="Prezime *" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="input-item input-item-email ltn__custom-icon">
                        <input type="email" placeholder="Email *" required value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="input-item input-item-phone ltn__custom-icon">
                        <input type="text" placeholder="Telefon *" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="input-item">
                        <input type="text" placeholder="Adresa * (npr. Ulica i broj)" required value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="input-item">
                        <select value={city} onChange={(e) => setCity(e.target.value as 'Nis' | 'Beograd')} required>
                          <option value="Nis">Nis</option>
                          <option value="Beograd">Beograd</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <h6>Napomena (opciono)</h6>
                  <div className="input-item input-item-textarea ltn__custom-icon">
                    <textarea placeholder="Mozete ostaviti poruku..." value={note} onChange={(e) => setNote(e.target.value)} />
                  </div>

                  <p className="mb-1">
                    <strong>Niš:</strong> {settings.nis_delivery_window_text}
                  </p>
                  <p className="mb-2">
                    <strong>Beograd:</strong> {settings.bg_delivery_window_text}
                  </p>

                  <h4 className="mt-3">Nacin placanja</h4>
                  <p className="mb-2">Placanje pouzećem (gotovinom na dostavi).</p>
                  <button type="submit" className="btn theme-btn-1 btn-effect-1 text-uppercase w-100 mt-20" disabled={isSubmitting || cartItems.length === 0}>
                    {isSubmitting ? 'Slanje...' : 'Zavrsi narudzbinu'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="shoping-cart-total mt-50">
              <h4 className="title-2">Vasa korpa</h4>
              <table className="table">
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product_id}>
                      <td>
                        {item.name} x {item.quantity}
                      </td>
                      <td>{Number(item.subtotal).toFixed(2)} RSD</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Subtotal</td>
                    <td>{subtotal.toFixed(2)} RSD</td>
                  </tr>
                  <tr>
                    <td>Dostava</td>
                    <td>{deliveryFee.toFixed(2)} RSD</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Ukupno</strong>
                    </td>
                    <td>
                      <strong>{grandTotal.toFixed(2)} RSD</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
