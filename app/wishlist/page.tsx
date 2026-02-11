'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProductsByIds } from '@/lib/products-client';

interface WishlistItem {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      const raw = localStorage.getItem('wishlist');
      const parsed = raw ? (JSON.parse(raw) as Array<{ product_id?: number; id?: number }>) : [];
      const ids = parsed
        .map((entry) => entry.product_id ?? entry.id)
        .filter((value): value is number => Number.isFinite(value));

      if (ids.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const products = await fetchProductsByIds(ids);
      const normalized = products.map((product) => ({
        id: Number(product.id),
        name: product.name,
        price_per_piece: Number(product.price_per_piece),
        main_image: product.main_image,
      }));

      setItems(normalized);
      setLoading(false);
    };

    loadWishlist().catch(() => {
      setItems([]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="container pt-100 pb-100 text-center">Ucitavanje liste zelja...</div>;
  }

  return (
    <div className="ltn__wishlist-area pb-110 pt-80">
      <div className="container">
        <div className="section-title-area text-center mb-30">
          <h1 className="section-title">Lista zelja</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center">
            <p>Lista zelja je prazna.</p>
            <Link href="/shop" className="theme-btn-1 btn btn-effect-1">
              Idi u prodavnicu
            </Link>
          </div>
        ) : (
          <div className="row">
            {items.map((item) => (
              <div className="col-lg-3 col-md-4 col-sm-6 col-6" key={item.id}>
                <div className="ltn__product-item ltn__product-item-3 text-center">
                  <div className="product-img">
                    <Link href={`/product/${item.id}`}>
                      <img src={item.main_image} alt={item.name} />
                    </Link>
                  </div>
                  <div className="product-info">
                    <h2 className="product-title">
                      <Link href={`/product/${item.id}`}>{item.name}</Link>
                    </h2>
                    <div className="product-price">
                      <span>{item.price_per_piece.toFixed(2)} RSD</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
