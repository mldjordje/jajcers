'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CartEntry, getCartCount, getCartEntries } from '@/lib/cart-client';

interface CartProduct {
  id: number;
  name: string;
  price_per_piece: number;
  main_image: string;
}

interface CustomerSession {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
}

function getApiBase() {
  return (process.env.NEXT_PUBLIC_PHP_API_BASE || 'https://api.jajce.rs/api').replace(/\/+$/, '');
}

export default function Header() {
  const [cartEntries, setCartEntries] = useState<CartEntry[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [user, setUser] = useState<CustomerSession['user']>(null);

  const subtotal = useMemo(() => {
    return cartEntries.reduce((sum, entry) => {
      const product = cartProducts.find((p) => p.id === entry.product_id);
      return sum + (product ? product.price_per_piece * entry.quantity : 0);
    }, 0);
  }, [cartEntries, cartProducts]);

  const cartCount = useMemo(() => getCartCount(cartEntries), [cartEntries]);

  useEffect(() => {
    const syncCart = () => setCartEntries(getCartEntries());
    syncCart();

    window.addEventListener('cart-updated', syncCart);
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener('cart-updated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    const ids = cartEntries.map((item) => item.product_id);
    if (ids.length === 0) {
      setCartProducts([]);
      return;
    }

    const loadProducts = async () => {
      try {
        const url = `${getApiBase()}/getProductsByIds.php?ids=${encodeURIComponent(ids.join(','))}`;
        const response = await fetch(url, { cache: 'no-store' });
        const payload = (await response.json()) as { status?: string; products?: CartProduct[] };
        if (response.ok && payload.status === 'success' && Array.isArray(payload.products)) {
          setCartProducts(payload.products);
          return;
        }
      } catch {
        // keep silent in header
      }
      setCartProducts([]);
    };

    void loadProducts();
  }, [cartEntries]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch('/api/customer/me', { cache: 'no-store' });
        const payload = (await response.json()) as CustomerSession;
        setUser(payload.user ?? null);
      } catch {
        setUser(null);
      }
    };
    void loadSession();
  }, []);

  return (
    <>
      <header className="ltn__header-area ltn__header-5 ltn__header-transparent--">
        <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white ltn__logo-right-menu-option">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="site-logo-wrap">
                  <div className="site-logo">
                    <Link href="/">
                      <img style={{ maxWidth: '170px' }} src="/content/logo.png" alt="Logo" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col header-menu-column">
                <div className="header-menu d-none d-xl-block">
                  <nav>
                    <div className="ltn__main-menu">
                      <ul>
                        <li>
                          <Link href="/">Pocetna</Link>
                        </li>
                        <li>
                          <Link href="/about">O nama</Link>
                        </li>
                        <li>
                          <Link href="/services">Usluge</Link>
                        </li>
                        <li>
                          <Link href="/order-tracking">Pracenje</Link>
                        </li>
                        <li>
                          <Link href="/contact">Kontakt</Link>
                        </li>
                        <li className="special-link">
                          <Link href="/shop">
                            Prodavnica <i className="fa fa-shopping-bag" />
                          </Link>
                        </li>
                        {user ? (
                          <li>
                            <Link href="/account/orders">
                              <i className="icon-user" /> {user.firstname}
                            </Link>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </nav>
                </div>
              </div>
              <div className="ltn__header-options ltn__header-options-2 mb-sm-20">
                {!user ? (
                  <div className="ltn__drop-menu user-menu">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="icon-user" />
                        </a>
                        <ul>
                          <li>
                            <Link href="/login">Prijava</Link>
                          </li>
                          <li>
                            <Link href="/register">Registracija</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : null}

                <div className="mini-cart-icon">
                  <a
                    href="#ltn__utilize-cart-menu"
                    className="ltn__utilize-toggle"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <i className="icon-shopping-cart" />
                    <sup id="mini-cart-count">{cartCount}</sup>
                  </a>
                </div>
                <div className="mini-cart-icon">
                  <Link href="/wishlist">
                    <i className="fa fa-heart" />
                  </Link>
                </div>
                <div className="mobile-menu-toggle d-xl-none">
                  <a href="#ltn__utilize-mobile-menu" className="ltn__utilize-toggle">
                    <svg viewBox="0 0 800 600">
                      <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top" />
                      <path d="M300,320 L540,320" id="middle" />
                      <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) " />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="ltn__utilize-cart-menu" className="ltn__utilize ltn__utilize-cart-menu">
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <span className="ltn__utilize-menu-title">Korpa</span>
            <button className="ltn__utilize-close">x</button>
          </div>
          <div className="mini-cart-product-area ltn__scrollbar" id="mini-cart-body">
            {cartEntries.length === 0 ? (
              <p>Korpa je prazna.</p>
            ) : (
              cartEntries.map((entry) => {
                const product = cartProducts.find((p) => p.id === entry.product_id);
                if (!product) return null;
                return (
                  <div className="mini-cart-item clearfix" key={entry.product_id}>
                    <div className="mini-cart-img">
                      <Link href={`/product/${entry.product_id}`}>
                        <img src={product.main_image} alt={product.name} />
                      </Link>
                    </div>
                    <div className="mini-cart-info">
                      <h6>
                        <Link href={`/product/${entry.product_id}`}>{product.name}</Link>
                      </h6>
                      <span className="mini-cart-quantity">
                        {entry.quantity} x {Number(product.price_per_piece).toFixed(2)} RSD
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mini-cart-footer">
            <div className="mini-cart-sub-total">
              <h5>
                Ukupno: <span id="mini-cart-subtotal">{subtotal.toFixed(2)} RSD</span>
              </h5>
            </div>
            <div className="btn-wrapper">
              <Link href="/cart" className="theme-btn-1 btn btn-effect-1">
                Korpa
              </Link>
              <Link href="/checkout" className="theme-btn-2 btn btn-effect-2">
                Placanje
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div id="ltn__utilize-mobile-menu" className="ltn__utilize ltn__utilize-mobile-menu">
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <div className="site-logo">
              <Link href="/">
                <img src="/content/logo.png" alt="Logo" />
              </Link>
            </div>
            <button className="ltn__utilize-close">x</button>
          </div>
          <div className="ltn__utilize-menu">
            <ul>
              <li>
                <Link href="/">Pocetna</Link>
              </li>
              <li>
                <Link href="/about">O nama</Link>
              </li>
              <li>
                <Link href="/services">Usluge</Link>
              </li>
              <li>
                <Link href="/contact">Kontakt</Link>
              </li>
              <li>
                <Link href="/order-tracking">Pracenje</Link>
              </li>
              <li className="special-link" style={{ margin: 'unset', marginTop: '20px' }}>
                <Link href="/shop">
                  Prodavnica <i className="fa fa-shopping-bag" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
            <ul>
              {user ? (
                <li>
                  <Link href="/account/orders">
                    <i className="icon-user" /> {user.firstname}
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login">
                      <i className="fa fa-key" /> Prijava
                    </Link>
                  </li>
                  <li>
                    <Link href="/register">
                      <i className="icon-user" /> Registracija
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="ltn__social-media-2">
            <ul>
              <li>
                <a href="#" title="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href="#" title="Instagram">
                  <i className="fab fa-instagram" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ltn__utilize-overlay" />
    </>
  );
}
