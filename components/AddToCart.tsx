'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart-client';

export default function AddToCart({ product }: { product: { id: number; name: string } }) {
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => Math.max(1, q - 1));

  const handleAdd = () => {
    addToCart(Number(product.id), qty);
    setMsg(`OK ${product.name} je dodat u korpu, kolicina ${qty}.`);
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div className="ltn__product-details-menu-2 mt-20">
      <ul>
        <li>
          <div className="cart-plus-minus">
            <div className="dec qtybutton" onClick={decrease}>
              -
            </div>
            <input type="text" name="qtybutton" className="cart-plus-minus-box" value={qty} readOnly />
            <div className="inc qtybutton" onClick={increase}>
              +
            </div>
          </div>
        </li>
        <li>
          <button type="button" onClick={handleAdd} className="theme-btn-1 btn btn-effect-1" title="Add to Cart">
            <i className="fas fa-shopping-cart" />
            <span>Dodaj u korpu</span>
          </button>
        </li>
      </ul>
      {msg ? <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>{msg}</p> : null}
    </div>
  );
}
