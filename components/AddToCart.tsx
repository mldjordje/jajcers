'use client';

import { useState } from 'react';

export default function AddToCart({ product }: { product: any }) {
    const [qty, setQty] = useState(1);
    const [msg, setMsg] = useState('');

    const increase = () => setQty(q => q + 1);
    const decrease = () => setQty(q => Math.max(1, q - 1));

    const handleAdd = () => {
        // Local storage logic for guest
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const found = cart.find((item: any) => item.product_id === product.id);
        if (found) {
            found.quantity += qty;
        } else {
            cart.push({ product_id: product.id, quantity: qty });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        
        setMsg(`✔ ${product.name} je dodat u korpu, količina ${qty}!`);
        setTimeout(() => setMsg(''), 3000);
        
        // Dispatch event for Header to pick up (if we implement listener there)
        window.dispatchEvent(new Event('cart-updated')); 
    };

    return (
        <div className="ltn__product-details-menu-2 mt-20">
            <ul>
                <li>
                    <div className="cart-plus-minus">
                        <div className="dec qtybutton" onClick={decrease}>-</div>
                        <input 
                            type="text" 
                            name="qtybutton" 
                            className="cart-plus-minus-box" 
                            value={qty} 
                            readOnly
                        />
                        <div className="inc qtybutton" onClick={increase}>+</div>
                    </div>
                </li>
                <li>
                    <button onClick={handleAdd} className="theme-btn-1 btn btn-effect-1" title="Add to Cart">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Dodaj u korpu</span>
                    </button>
                </li>
            </ul>
            {msg && <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>{msg}</p>}
        </div>
    );
}
