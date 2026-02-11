'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CustomerOrder {
  id: number;
  created_at: string | null;
  total_amount: number | string;
  status: string;
  city: string | null;
  address: string | null;
}

interface SessionUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

const currency = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('sr-RS', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function MyOrdersPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const meResponse = await fetch('/api/customer/me', { cache: 'no-store' });
        const mePayload = (await meResponse.json()) as { user: SessionUser | null };

        if (!mePayload.user) {
          window.location.href = '/login?next=/account/orders';
          return;
        }

        setUser(mePayload.user);

        const ordersResponse = await fetch('/api/customer/orders', { cache: 'no-store' });
        const ordersPayload = (await ordersResponse.json()) as {
          status?: string;
          orders?: CustomerOrder[];
          message?: string;
        };

        if (!ordersResponse.ok || ordersPayload.status !== 'success') {
          setMessage(ordersPayload.message || 'Nije moguce ucitati porudzbine.');
          setLoading(false);
          return;
        }

        setOrders(ordersPayload.orders ?? []);
        setLoading(false);
      } catch {
        setMessage('Doslo je do greske pri ucitavanju.');
        setLoading(false);
      }
    };

    void load();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/customer/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="container pt-100 pb-100 text-center">Ucitavanje...</div>;
  }

  return (
    <div className="ltn__account-area pb-110 pt-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="section-title-area text-center">
              <h1 className="section-title">Moje porudzbine</h1>
              <p>
                {user ? `${user.firstname} ${user.lastname} (${user.email})` : 'Korisnicki nalog'}
              </p>
            </div>

            <div className="text-right text-end mb-20">
              <button type="button" onClick={handleLogout} className="btn btn-outline-secondary">
                Odjava
              </button>
            </div>

            {message ? <p className="text-center">{message}</p> : null}

            {orders.length === 0 ? (
              <p className="text-center">Trenutno nema porudzbina.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Datum</th>
                      <th>Status</th>
                      <th>Dostava</th>
                      <th>Ukupno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{formatDate(order.created_at)}</td>
                        <td>{order.status}</td>
                        <td>
                          {order.city ?? '-'} / {order.address ?? '-'}
                        </td>
                        <td>{currency.format(Number(order.total_amount) || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="text-center mt-30">
              <Link href="/shop" className="theme-btn-1 btn btn-effect-1">
                Nastavi kupovinu
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
