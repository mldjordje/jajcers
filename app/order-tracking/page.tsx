import { getOrder } from '@/app/actions/order';
import Link from 'next/link';
import { RowDataPacket, FieldPacket } from 'mysql2';

interface OrderItem extends RowDataPacket {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  main_image: string;
}

interface Order extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  total_amount: number;
  status: string;
  created_at: Date;
  address: string;
  city: string;
  phone: string;
  items: OrderItem[];
}

export default async function OrderTrackingPage({ searchParams }: { searchParams: Promise<{ order_id?: string; email?: string }> }) {
    const params = await searchParams;
    const orderId = params.order_id ? parseInt(params.order_id) : undefined;
    const email = params.email;

    if (!orderId || !email) {
        return (
            <div className="container pt-100 pb-100 text-center">
                <h2>Neispravni podaci.</h2>
                <p>Molimo proverite link za praćenje porudžbine.</p>
                <Link href="/" className="theme-btn-1 btn btn-effect-1 mt-20">Nazad</Link>
            </div>
        );
    }

    const order = await getOrder(orderId, email) as Order | null;

    if (!order) {
         return (
            <div className="container pt-100 pb-100 text-center">
                <h2>Porudžbina nije pronađena.</h2>
                <p>Proverite broj porudžbine i email adresu.</p>
                 <Link href="/" className="theme-btn-1 btn btn-effect-1 mt-20">Nazad</Link>
            </div>
        );
    }

    return (
        <div className="liton__order-tracking-area mb-120 pt-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="ltn__order-tracking-inner text-center">
                            <h2>Detalji Porudžbine #{order.id}</h2>
                            <p>Status: <strong>{order.status}</strong></p>
                            <p>Datum: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p>Ukupno: {Number(order.total_amount).toFixed(2)} RSD</p>
                            
                             <div className="table-responsive mt-50">
                                <table className="table text-left">
                                    <thead>
                                        <tr>
                                            <th>Proizvod</th>
                                            <th>Cena</th>
                                            <th>Količina</th>
                                            <th>Ukupno</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item: any) => (
                                            <tr key={item.product_id}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <img src={item.main_image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td>{Number(item.price).toFixed(2)} RSD</td>
                                                <td>{item.quantity}</td>
                                                <td>{(item.price * item.quantity).toFixed(2)} RSD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="customer-details mt-50 text-left" style={{ textAlign: 'left' }}>
                                <h4>Podaci za dostavu</h4>
                                <p><strong>Ime:</strong> {order.first_name} {order.last_name}</p>
                                <p><strong>Email:</strong> {order.email}</p>
                                <p><strong>Telefon:</strong> {order.phone}</p>
                                <p><strong>Adresa:</strong> {order.address}, {order.city}</p>
                            </div>
                            
                            <Link href="/" className="theme-btn-1 btn btn-effect-1 mt-50">Nazad na kupovinu</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
