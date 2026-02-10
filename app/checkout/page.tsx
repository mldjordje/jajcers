'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductsByIds } from '@/app/actions/product';

interface CartItem {
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
    subtotal?: number;
}

export default function CheckoutPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderSuccess, setOrderSuccess] = useState<number | null>(null);

    // Form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (storedCart.length === 0) {
            setLoading(false);
            return;
        }

        const ids = storedCart.map((item: any) => item.product_id);
        
        // Fetch product details
        getProductsByIds(ids).then(products => {
             const mergedItems = storedCart.map((item: any) => {
                // Ensure IDs match types (number vs string)
                const product = products.find((p: any) => p.id == item.product_id);
                if (product) {
                    return {
                        ...item,
                        name: product.name,
                        price: product.price_per_piece,
                        subtotal: product.price_per_piece * item.quantity
                    };
                }
                return null;
            }).filter((item:any) => item !== null);
            setCartItems(mergedItems);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });

    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const orderData = {
            firstName,
            lastName,
            email,
            phone,
            address,
            city: 'Niš',
            note,
            cartItems: cartItems.map(({ product_id, quantity }) => ({ product_id, quantity }))
        };

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            
            if (res.ok) {
                setOrderSuccess(data.orderId);
                localStorage.removeItem('cart');
            } else {
                alert(data.message || 'Greška prilikom poručivanja.');
            }
        } catch (error) {
            console.error(error);
            alert('Došlo je do greške.');
        }
    };

    if (orderSuccess) {
        return (
            <div className="container pt-100 pb-100 text-center">
                <h2>Hvala na porudžbini!</h2>
                <p>Broj vaše porudžbine je: <strong>#{orderSuccess}</strong></p>
                <Link href="/" className="theme-btn-1 btn btn-effect-1 mt-20">Nazad na početnu</Link>
            </div>
        );
    }

    if (loading) return <div className="container pt-100 pb-100 text-center">Učitavanje...</div>;

    const total = cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

    return (
        <div className="ltn__checkout-area mb-105 pt-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="ltn__checkout-inner">
                            <h4 className="title-2">Podaci za plaćanje</h4>
                            <div className="ltn__checkout-single-content-info">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-item input-item-name ltn__custom-icon">
                                                <input type="text" placeholder="Ime *" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-item input-item-name ltn__custom-icon">
                                                <input type="text" placeholder="Prezime *" required value={lastName} onChange={e => setLastName(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-item input-item-email ltn__custom-icon">
                                                <input type="email" placeholder="Email *" required value={email} onChange={e => setEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-item input-item-phone ltn__custom-icon">
                                                <input type="text" placeholder="Telefon *" required value={phone} onChange={e => setPhone(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-item">
                                                <input type="text" placeholder="Adresa * (npr. Ulica i broj)" required value={address} onChange={e => setAddress(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <h6>Napomena (opciono)</h6>
                                    <div className="input-item input-item-textarea ltn__custom-icon">
                                        <textarea placeholder="Možete ostaviti poruku..." value={note} onChange={e => setNote(e.target.value)}></textarea>
                                    </div>
                                    <h4 className="mt-3">Način Plaćanja</h4>
                                    <p className="mb-2">Plaćanje pouzećem (gotovinom na dostavi).</p>
                                    <button type="submit" className="btn theme-btn-1 btn-effect-1 text-uppercase w-100 mt-20">Završi narudžbinu</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-lg-6">
                        <div className="shoping-cart-total mt-50">
                            <h4 className="title-2">Vaša Korpa</h4>
                            <table className="table">
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.product_id}>
                                            <td>{item.name} × {item.quantity}</td>
                                            <td>{Number(item.subtotal).toFixed(2)} RSD</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td><strong>Ukupno</strong></td>
                                        <td><strong>{total.toFixed(2)} RSD</strong></td>
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
