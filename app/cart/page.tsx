'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductsByIds } from '@/app/actions/product';
import { getCartEntries, removeCartItem, updateCartQuantity } from '@/lib/cart-client';

interface CartItem {
    product_id: number;
    quantity: number;
    name?: string;
    price?: number;
    image?: string;
    subtotal?: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCart = async () => {
            const storedCart = getCartEntries();
            if (storedCart.length === 0) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            const ids = storedCart.map((item: any) => item.product_id);
            const products = await getProductsByIds(ids);

            const mergedItems = storedCart.map((item: any) => {
                const product = products.find((p: any) => p.id === item.product_id);
                if (product) {
                    return {
                        ...item,
                        name: product.name,
                        price: product.price_per_piece,
                        image: product.main_image,
                        subtotal: product.price_per_piece * item.quantity
                    };
                }
                return null;
            }).filter(Boolean); // Filter out items not found in DB

            setCartItems(mergedItems);
            setLoading(false);
        };

        loadCart();
    }, []);

    const updateQuantity = (productId: number, newQty: number) => {
        if (newQty < 1) return;
        
        const updatedCart = cartItems.map(item => {
            if (item.product_id === productId) {
                return { ...item, quantity: newQty, subtotal: (item.price || 0) * newQty };
            }
            return item;
        });
        setCartItems(updatedCart);
        
        // Update localStorage
        updateCartQuantity(productId, newQty);
    };

    const removeItem = (productId: number) => {
        const updatedCart = cartItems.filter(item => item.product_id !== productId);
        setCartItems(updatedCart);
        
        // Update localStorage
        removeCartItem(productId);
    };

    const total = cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

    if (loading) {
        return <div className="container pt-100 pb-100 text-center">Učitavanje korpe...</div>;
    }

    return (
        <div className="liton__shoping-cart-area mb-120 pt-80">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="section-title-area ltn__section-title-2 text-center">
                            <h1 className="section-title">Korpa</h1>
                        </div>
                        <div className="shoping-cart-inner">
                            <div className="shoping-cart-table table-responsive">
                                <table className="table">
                                    <thead>
                                        {cartItems.length > 0 ? (
                                            <tr>
                                                <th className="cart-product-remove">Ukloni</th>
                                                <th className="cart-product-image">Slika</th>
                                                <th className="cart-product-info">Proizvod</th>
                                                <th className="cart-product-price">Cena</th>
                                                <th className="cart-product-quantity">Količina</th>
                                                <th className="cart-product-subtotal">Ukupno</th>
                                            </tr>
                                        ) : null}
                                    </thead>
                                    <tbody>
                                        {cartItems.length === 0 ? (
                                            <tr><td colSpan={6} className="text-center">Vaša korpa je prazna!</td></tr>
                                        ) : (
                                            cartItems.map((item) => (
                                                <tr key={item.product_id}>
                                                    <td className="cart-product-remove">
                                                        <button onClick={() => removeItem(item.product_id)}>x</button>
                                                    </td>
                                                    <td className="cart-product-image">
                                                        <Link href={`/product/${item.product_id}`}>
                                                            <img src={item.image} alt={item.name} />
                                                        </Link>
                                                    </td>
                                                    <td className="cart-product-info">
                                                        <h4><Link href={`/product/${item.product_id}`}>{item.name}</Link></h4>
                                                    </td>
                                                    <td className="cart-product-price">{Number(item.price).toFixed(2)} RSD</td>
                                                    <td className="cart-product-quantity">
                                                        <div className="cart-plus-minus">
                                                            <div className="dec qtybutton" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</div>
                                                            <input type="text" value={item.quantity} className="cart-plus-minus-box" readOnly />
                                                            <div className="inc qtybutton" onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</div>
                                                        </div>
                                                    </td>
                                                    <td className="cart-product-subtotal">{Number(item.subtotal).toFixed(2)} RSD</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {cartItems.length > 0 && (
                                <div className="shoping-cart-total mt-50">
                                    <h4>Ukupno</h4>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td><strong>Ukupno</strong></td>
                                                <td><strong>{total.toFixed(2)} RSD</strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="btn-wrapper text-right text-end">
                                        <Link href="/checkout" className="theme-btn-1 btn btn-effect-1">Nastavi na plaćanje</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
