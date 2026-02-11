'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart-client';

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  className?: string;
}

export default function AddToCartButton({ productId, productName, className }: AddToCartButtonProps) {
  const [message, setMessage] = useState('');

  const handleClick = () => {
    addToCart(productId, 1);
    setMessage(`${productName} je dodat u korpu.`);
    window.setTimeout(() => setMessage(''), 1800);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className ?? 'theme-btn-1 btn btn-effect-1'}
        aria-label={`Dodaj ${productName} u korpu`}
      >
        <i className="fas fa-shopping-cart" /> Dodaj u korpu
      </button>
      {message ? <p className="mt-10" style={{ color: '#0f766e', fontWeight: 600 }}>{message}</p> : null}
    </>
  );
}
