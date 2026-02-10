'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ firstname: string } | null>(null);

  // You can fetch session data here via API route later
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    // Handle storage event for cross-tab updates
    window.addEventListener('storage', updateCartCount);
    
    return () => {
        window.removeEventListener('cart-updated', updateCartCount);
        window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <>
      <header className="ltn__header-area ltn__header-5 ltn__header-transparent--">
        {/* ltn__header-top-area start */}
        <div className="ltn__header-top-area">
            <div className="container">
                <div className="row">
                    <div className="col-md-7">
                        <div className="ltn__top-bar-menu">
                            <ul>
                                <li><a><i className="icon-placeholder"></i> Ozrenska 22, Vrtište</a></li>
                                <li><a href="tel:+381607180659"><i className="icon-call"></i> +381 60 718 0659</a></li>
                                <li><a href="tel:+381183100971"><i className="icon-call"></i> +381 18 310 0971</a></li>
                                <li><a href="mailto:info@jajce.rs"><i className="icon-mail"></i> info@jajce.rs</a></li>
                                <li><a><i className="icon-shopping-cart"></i> Besplatna dostava na teritoriji Niša</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="top-bar-right text-right text-end">
                            <div className="ltn__top-bar-menu">
                                <ul>
                                    <li>
                                        <div className="ltn__drop-menu ltn__currency-menu ltn__language-menu">
                                            <ul>
                                                <li><a href="#" className="dropdown-toggle">
                                                        <span className="active-currency">Srpski</span></a>
                                                    <ul>
                                                        <li><a href="#">Srpski</a></li>
                                                        <li><a href="#">English</a></li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="ltn__social-media">
                                            <ul>
                                                <li><a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
                                                <li><a href="#" title="Instagram"><i className="fab fa-instagram"></i></a></li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* ltn__header-top-area end */}

        {/* ltn__header-middle-area start */}
        <div className="ltn__header-middle-area ltn__header-sticky ltn__sticky-bg-white ltn__logo-right-menu-option">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="site-logo-wrap">
                            <div className="site-logo">
                                <Link href="/">
                                  <img style={{ maxWidth: "170px" }} src="/content/logo.png" alt="Logo" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="col header-menu-column">
                        <div className="header-menu d-none d-xl-block">
                            <nav>
                                <div className="ltn__main-menu">
                                    <ul>
                                        <li><Link href="/">Početna</Link></li>
                                        <li><Link href="/about">O nama</Link></li>
                                        <li><Link href="/services">Usluge</Link></li>
                                        <li><Link href="/order-tracking">Praćenje</Link></li>
                                        <li><Link href="/contact">Kontakt</Link></li>
                                        <li className="special-link">
                                            <Link href="/shop">Prodavnica <i className="fa fa-shopping-bag"></i></Link>
                                        </li>
                                        {user && (
                                            <li style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                                                onClick={() => window.location.href='/account'}>
                                                <i className="icon-user"></i>
                                                <strong>{user.firstname}</strong>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <div className="ltn__header-options ltn__header-options-2 mb-sm-20">
                        {!user && (
                            <div className="ltn__drop-menu user-menu">
                                <ul>
                                    <li>
                                        <a href="#"><i className="icon-user"></i></a>
                                        <ul>
                                            <li><Link href="/login">Prijava</Link></li>
                                            <li><Link href="/register">Registracija</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        )}

                        <div className="mini-cart-icon">
                            <a href="#ltn__utilize-cart-menu" className="ltn__utilize-toggle" style={{ display: "flex", alignItems: "center" }}>
                                <i className="icon-shopping-cart"></i>
                                <sup id="mini-cart-count">{cartCount}</sup>
                            </a>
                        </div>
                        <div className="mini-cart-icon">
                            <Link href="/wishlist">
                                <i className="fa fa-heart"></i>
                            </Link>
                        </div>
                        <div className="mobile-menu-toggle d-xl-none">
                            <a href="#ltn__utilize-mobile-menu" className="ltn__utilize-toggle">
                                <svg viewBox="0 0 800 600">
                                    <path d="M300,220 C300,220 520,220 540,220 C740,220 640,540 520,420 C440,340 300,200 300,200" id="top"></path>
                                    <path d="M300,320 L540,320" id="middle"></path>
                                    <path d="M300,210 C300,210 520,210 540,210 C740,210 640,530 520,410 C440,330 300,190 300,190" id="bottom" transform="translate(480, 320) scale(1, -1) translate(-480, -318) "></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* ltn__header-middle-area end */}
      </header>

      {/* Utilize Cart Menu Start */}
      <div id="ltn__utilize-cart-menu" className="ltn__utilize ltn__utilize-cart-menu">
          <div className="ltn__utilize-menu-inner ltn__scrollbar">
              <div className="ltn__utilize-menu-head">
                  <span className="ltn__utilize-menu-title">Korpa</span>
                  <button className="ltn__utilize-close">×</button>
              </div>
              <div className="mini-cart-product-area ltn__scrollbar" id="mini-cart-body">
                  {/* content added by JS */}
              </div>
              <div className="mini-cart-footer">
                  <div className="mini-cart-sub-total">
                      <h5>Ukupno: <span id="mini-cart-subtotal">$0.00</span></h5>
                  </div>
                  <div className="btn-wrapper">
                      <Link href="/cart" className="theme-btn-1 btn btn-effect-1">Korpa</Link>
                      <Link href="/checkout" className="theme-btn-2 btn btn-effect-2">Plaćanje</Link>
                  </div>
              </div>
          </div>
      </div>
      {/* Utilize Cart Menu End */}

      {/* Utilize Mobile Menu Start */}
      <div id="ltn__utilize-mobile-menu" className="ltn__utilize ltn__utilize-mobile-menu">
          <div className="ltn__utilize-menu-inner ltn__scrollbar">
              <div className="ltn__utilize-menu-head">
                  <div className="site-logo">
                      <Link href="/"><img src="/content/logo.png" alt="Logo" /></Link>
                  </div>
                  <button className="ltn__utilize-close">×</button>
              </div>
              <div className="ltn__utilize-menu">
                  <ul>
                      <li><Link href="/">Početna</Link></li>
                      <li><Link href="/about">O nama</Link></li>
                      <li><Link href="/services">Usluge</Link></li>
                      <li><Link href="/contact">Kontakt</Link></li>
                      <li><Link href="/order-tracking">Praćenje</Link></li>
                      <li className="special-link" style={{ margin: "unset", marginTop: "20px" }}>
                          <Link href="/shop">Prodavnica <i className="fa fa-shopping-bag"></i></Link>
                      </li>
                  </ul>
              </div>
              <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
                  <ul>
                      {user ? (
                          <li style={{ whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                              onClick={() => window.location.href='/account'}>
                              <i className="icon-user"></i>
                              <strong>{user.firstname}</strong>
                          </li>
                      ) : (
                          <>
                            <li><Link href="/login"><i className="fa fa-key"></i> Prijava</Link></li>
                            <li><Link href="/register"><i className="icon-user"></i> Registracija</Link></li>
                          </>
                      )}
                  </ul>
              </div>
              <div className="ltn__social-media-2">
                  <ul>
                      <li><a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
                      <li><a href="#" title="Instagram"><i className="fab fa-instagram"></i></a></li>
                  </ul>
              </div>
          </div>
      </div>
      {/* Utilize Mobile Menu End */}
      
      <div className="ltn__utilize-overlay"></div>
    </>
  );
}
