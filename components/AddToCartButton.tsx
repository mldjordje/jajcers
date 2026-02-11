'use client';

import { useState } from 'react';
import { addToCart } from '@/lib/cart-client';
import { Button } from '@heroui/react';

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
      <Button
        type="button"
        onPress={handleClick}
        color="success"
        radius="full"
        variant="shadow"
        size="sm"
        className={className ?? 'cart-add-btn'}
        aria-label={`Dodaj ${productName} u korpu`}
        startContent={<i className="fas fa-shopping-cart" />}
      >
        Dodaj u korpu
      </Button>
      {message ? <p className="mt-10" style={{ color: '#0f766e', fontWeight: 600 }}>{message}</p> : null}
    </>
  );
}
