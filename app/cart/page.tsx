'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCartEntries, removeCartItem, updateCartQuantity } from '@/lib/cart-client';
import { fetchProductsByIds } from '@/lib/products-client';
import { Button, Card, CardBody } from '@heroui/react';
import { resolveProductImage } from '@/lib/product-image';

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

      const ids = storedCart.map((item) => item.product_id);
      const products = await fetchProductsByIds(ids);

      const mergedItems = storedCart
        .map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          if (!product) return null;
          return {
            ...item,
            name: product.name,
            price: product.price_per_piece,
            image: resolveProductImage(product.name, product.main_image),
            subtotal: product.price_per_piece * item.quantity,
          };
        })
        .filter(Boolean) as CartItem[];

      setCartItems(mergedItems);
      setLoading(false);
    };

    void loadCart();
  }, []);

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.product_id === productId
        ? { ...item, quantity: newQty, subtotal: (item.price || 0) * newQty }
        : item,
    );
    setCartItems(updatedCart);
    updateCartQuantity(productId, newQty);
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
    removeCartItem(productId);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.subtotal || 0), 0);

  if (loading) {
    return <div className="container pt-100 pb-100 text-center">Ucitavanje korpe...</div>;
  }

  return (
    <div className="liton__shoping-cart-area mb-120 pt-80 section-animate">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area ltn__section-title-2 text-center">
              <h1 className="section-title">Korpa</h1>
            </div>

            <div className="shoping-cart-inner">
              <Card className="cart-shell">
                <CardBody className="p-20">
                <div className="shoping-cart-table table-responsive">
                  <table className="table">
                    <thead>
                      {cartItems.length > 0 ? (
                        <tr>
                          <th className="cart-product-remove">Ukloni</th>
                          <th className="cart-product-image">Slika</th>
                          <th className="cart-product-info">Proizvod</th>
                          <th className="cart-product-price">Cena</th>
                          <th className="cart-product-quantity">Kolicina</th>
                          <th className="cart-product-subtotal">Ukupno</th>
                        </tr>
                      ) : null}
                    </thead>
                    <tbody>
                      {cartItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            Vasa korpa je prazna.
                          </td>
                        </tr>
                      ) : (
                        cartItems.map((item) => (
                          <tr key={item.product_id}>
                            <td className="cart-product-remove">
                              <Button
                                type="button"
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => removeItem(item.product_id)}
                              >
                                Ukloni
                              </Button>
                            </td>
                            <td className="cart-product-image">
                              <Link href={`/product/${item.product_id}`}>
                                <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                              </Link>
                            </td>
                            <td className="cart-product-info">
                              <h4>
                                <Link href={`/product/${item.product_id}`}>{item.name}</Link>
                              </h4>
                            </td>
                            <td className="cart-product-price">{Number(item.price).toFixed(2)} RSD</td>
                            <td className="cart-product-quantity">
                              <div className="cart-plus-minus">
                                <Button
                                  size="sm"
                                  variant="flat"
                                  onPress={() => updateQuantity(item.product_id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <input type="text" value={item.quantity} className="cart-plus-minus-box" readOnly />
                                <Button
                                  size="sm"
                                  variant="flat"
                                  onPress={() => updateQuantity(item.product_id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="cart-product-subtotal">{Number(item.subtotal).toFixed(2)} RSD</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                </CardBody>
              </Card>

              {cartItems.length > 0 ? (
                <Card className="shoping-cart-total mt-30 cart-summary">
                  <CardBody className="p-20">
                  <h4>Ukupno</h4>
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Ukupno</strong>
                        </td>
                        <td>
                          <strong>{total.toFixed(2)} RSD</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="btn-wrapper text-right text-end">
                    <Button as={Link} href="/checkout" color="primary" className="ui-cta">
                      Nastavi na placanje
                    </Button>
                  </div>
                  </CardBody>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
