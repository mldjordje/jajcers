'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { CartEntry, getCartCount, getCartEntries, removeCartItem } from '@/lib/cart-client';
import { fetchProductsByIds } from '@/lib/products-client';
import { resolveProductImage } from '@/lib/product-image';

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

export default function Header() {
  const [cartEntries, setCartEntries] = useState<CartEntry[]>([]);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [user, setUser] = useState<CustomerSession['user']>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subtotal = useMemo(() => {
    return cartEntries.reduce((sum, entry) => {
      const product = cartProducts.find((p) => p.id === entry.product_id);
      return sum + (product ? product.price_per_piece * entry.quantity : 0);
    }, 0);
  }, [cartEntries, cartProducts]);

  const cartCount = useMemo(() => getCartCount(cartEntries), [cartEntries]);
  const isAnyUtilOpen = isCartOpen || isMobileMenuOpen;

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

  const handleRemoveFromMiniCart = (productId: number) => {
    removeCartItem(productId);
    setCartEntries(getCartEntries());
  };

  useEffect(() => {
    const ids = cartEntries.map((item) => item.product_id);
    if (ids.length === 0) {
      setCartProducts([]);
      return;
    }

    const loadProducts = async () => {
      try {
        const products = await fetchProductsByIds(ids);
        setCartProducts(products);
        return;
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

  useEffect(() => {
    if (isAnyUtilOpen) {
      document.body.classList.add('ltn__utilize-open');
    } else {
      document.body.classList.remove('ltn__utilize-open');
    }

    return () => {
      document.body.classList.remove('ltn__utilize-open');
    };
  }, [isAnyUtilOpen]);

  const closeAllMenus = () => {
    setIsCartOpen(false);
    setIsMobileMenuOpen(false);
  };

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
                  <button
                    type="button"
                    onClick={() => setIsCartOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', background: 'transparent', border: 0 }}
                    aria-label="Otvori korpu"
                  >
                    <i className="icon-shopping-cart" />
                    <sup id="mini-cart-count">{cartCount}</sup>
                  </button>
                </div>
                <div className="mini-cart-icon">
                  <Link href="/wishlist">
                    <i className="fa fa-heart" />
                  </Link>
                </div>
                <div className="mobile-menu-toggle d-xl-none">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{ background: 'transparent', border: 0 }}
                    aria-label="Otvori meni"
                  >
                    <svg viewBox="0 0 800 600">
                      <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top" />
                      <path d="M300,320 L540,320" id="middle" />
                      <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) " />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div id="ltn__utilize-cart-menu" className={`ltn__utilize ltn__utilize-cart-menu${isCartOpen ? ' ltn__utilize-open' : ''}`}>
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <span className="ltn__utilize-menu-title">Korpa</span>
            <button className="ltn__utilize-close" onClick={closeAllMenus} type="button">
              x
            </button>
          </div>
          <div className="mini-cart-product-area ltn__scrollbar" id="mini-cart-body">
            {cartEntries.length === 0 ? (
              <p>Korpa je prazna.</p>
            ) : (
              cartEntries.map((entry) => {
                const product = cartProducts.find((p) => p.id === entry.product_id);
                if (!product) return null;
                return (
                  <Card key={entry.product_id} className="mini-cart-item-card mb-10">
                    <CardBody className="d-flex flex-row align-items-center justify-content-between gap-2 p-10">
                      <div className="d-flex align-items-center gap-2">
                        <div className="mini-cart-img">
                          <Link href={`/product/${entry.product_id}`}>
                            <img
                              src={resolveProductImage(product.name, product.main_image)}
                              alt={product.name}
                              loading="lazy"
                              decoding="async"
                            />
                          </Link>
                        </div>
                        <div className="mini-cart-info">
                          <h6 className="mb-1">
                            <Link href={`/product/${entry.product_id}`}>{product.name}</Link>
                          </h6>
                          <Chip size="sm" variant="flat" color="primary">
                            {entry.quantity} x {Number(product.price_per_piece).toFixed(2)} RSD
                          </Chip>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => handleRemoveFromMiniCart(entry.product_id)}
                      >
                        Ukloni
                      </Button>
                    </CardBody>
                  </Card>
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
              <Button as={Link} href="/cart" color="primary" className="ui-cta" onPress={closeAllMenus}>
                Korpa
              </Button>
              <Button as={Link} href="/checkout" variant="bordered" className="ui-ghost" onPress={closeAllMenus}>
                Placanje
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div id="ltn__utilize-mobile-menu" className={`ltn__utilize ltn__utilize-mobile-menu${isMobileMenuOpen ? ' ltn__utilize-open' : ''}`}>
        <div className="ltn__utilize-menu-inner ltn__scrollbar">
          <div className="ltn__utilize-menu-head">
            <div className="site-logo">
              <Link href="/">
                <img src="/content/logo.png" alt="Logo" />
              </Link>
            </div>
            <button className="ltn__utilize-close" onClick={closeAllMenus} type="button">
              x
            </button>
          </div>
          <div className="ltn__utilize-menu">
            <ul>
              <li>
                <Link href="/" onClick={closeAllMenus}>Pocetna</Link>
              </li>
              <li>
                <Link href="/about" onClick={closeAllMenus}>O nama</Link>
              </li>
              <li>
                <Link href="/services" onClick={closeAllMenus}>Usluge</Link>
              </li>
              <li>
                <Link href="/contact" onClick={closeAllMenus}>Kontakt</Link>
              </li>
              <li>
                <Link href="/order-tracking" onClick={closeAllMenus}>Pracenje</Link>
              </li>
              <li className="special-link" style={{ margin: 'unset', marginTop: '20px' }}>
                <Link href="/shop" onClick={closeAllMenus}>
                  Prodavnica <i className="fa fa-shopping-bag" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
            <ul>
              {user ? (
                <li>
                  <Link href="/account/orders" onClick={closeAllMenus}>
                    <i className="icon-user" /> {user.firstname}
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href="/login" onClick={closeAllMenus}>
                      <i className="fa fa-key" /> Prijava
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" onClick={closeAllMenus}>
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

      <div
        className="ltn__utilize-overlay"
        onClick={closeAllMenus}
        style={{ display: isAnyUtilOpen ? 'block' : 'none' }}
      />
    </>
  );
}
