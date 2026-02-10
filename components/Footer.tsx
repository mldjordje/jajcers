'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate API call or connect to real backend
    try {
      // In a real migration, you'd create an API route /api/newsletter
      console.log('Newsletter subscription for:', email);
      setStatus('success');
      setMessage('Uspešno ste se prijavili!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage('Došlo je do greške.');
    }
  };

  return (
    <>
      {/* MODAL AREA START (Add To Cart Modal) */}
      <div className="ltn__modal-area ltn__add-to-cart-modal-area">
          <div className="modal fade" id="add_to_cart_modal" tabIndex={-1}>
              <div className="modal-dialog modal-md" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <div className="ltn__quick-view-modal-inner">
                              <div className="modal-product-item">
                                  <div className="row">
                                      <div className="col-12">
                                          <div className="modal-product-img">
                                              <img src="/img/product/1.png" alt="#" />
                                          </div>
                                          <div className="modal-product-info">
                                              <h5><a href="#">Vegetables Juices</a></h5>
                                              <p className="added-cart"><i className="fa fa-check-circle"></i> Uspešno dodato u korpu</p>
                                              <div className="btn-wrapper">
                                                  <Link href="/cart" className="theme-btn-1 btn btn-effect-1">Korpa</Link>
                                                  <Link href="/checkout" className="theme-btn-2 btn btn-effect-2">Plaćanje</Link>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* MODAL AREA END */}

      {/* FOOTER AREA START */}
      <footer className="ltn__footer-area">
          <div className="footer-top-area section-bg-2 plr--5">
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-xl-4 col-md-6 col-sm-6 col-12">
                          <div className="footer-widget footer-about-widget">
                              <div className="footer-logo">
                                  <div className="site-logo">
                                      <img src="/content/logo-white.png" style={{ maxWidth: "220px" }} alt="Logo" />
                                  </div>
                              </div>
                              <p>Poručite najkvalitetnija domaća jaja sa naše farme. Svežina garantovana!</p>
                              <div className="footer-address">
                                  <ul>
                                      <li>
                                          <div className="footer-address-icon">
                                              <i className="icon-placeholder"></i>
                                          </div>
                                          <div className="footer-address-info">
                                              <p>Ozrenska 22, Vrtište</p>
                                          </div>
                                      </li>
                                      <li>
                                          <div className="footer-address-icon">
                                              <i className="icon-call"></i>
                                          </div>
                                          <div className="footer-address-info">
                                              <p><a href="tel:+381628008177">+381 62 8008177</a></p>
                                          </div>
                                      </li>
                                      <li>
                                          <div className="footer-address-icon">
                                              <i className="icon-mail"></i>
                                          </div>
                                          <div className="footer-address-info">
                                              <p><a href="mailto:info@jajce.rs">info@jajce.rs</a></p>
                                          </div>
                                      </li>
                                  </ul>
                              </div>
                              <div className="ltn__social-media mt-20">
                                  <ul>
                                      <li><a href="#" title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
                                      <li><a href="#" title="Instagram"><i className="fab fa-instagram"></i></a></li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      <div className="col-xl-4 col-md-6 col-sm-6 col-12">
                          <div className="footer-widget footer-menu-widget clearfix">
                              <h4 className="footer-title">Prečice</h4>
                              <div className="footer-menu">
                                  <ul>
                                      <li><Link href="/">Početna</Link></li>
                                      <li><Link href="/about">O nama</Link></li>
                                      <li><Link href="/services">Usluge</Link></li>
                                      <li><Link href="/order-tracking">Praćenje pošiljke</Link></li>
                                      <li><Link href="/contact">Kontakt</Link></li>
                                      <li><Link href="/shop">Prodavnica</Link></li>
                                  </ul>
                              </div>
                          </div>
                      </div>
                      <div className="col-xl-4 col-md-6 col-sm-12 col-12">
                          <div className="footer-widget footer-newsletter-widget">
                              <h4 className="footer-title">Promocije</h4>
                              <p>Pretplatite se na naš nedeljni bilten i budite u toku sa najnovijim ponudama svežih domaćih jaja!</p>
                              <div className="footer-newsletter">
                                  <form onSubmit={handleNewsletterSubmit}>
                                      <div className="mc-field-group">
                                          <input 
                                            type="email" 
                                            name="email" 
                                            className="required email" 
                                            placeholder="Email Adresa*" 
                                            required 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                          />
                                      </div>
                                      <div className="clear">
                                          <div className="btn-wrapper">
                                              <button className="theme-btn-1 btn" type="submit">
                                                  <i className="fas fa-location-arrow"></i>
                                              </button>
                                          </div>
                                      </div>
                                  </form>
                                  {message && (
                                    <p style={{ marginTop: "10px", color: status === 'success' ? "green" : "red" }}>
                                      {message}
                                    </p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="ltn__copyright-area ltn__copyright-2 section-bg-2 ltn__border-top-2 plr--5">
              <div className="container-fluid">
                  <div className="row">
                      <div className="col-md-6 col-12">
                          <div className="ltn__copyright-design clearfix">
                              <p>Sva prava zadržana @ Jajce.rs <span className="current-year">{new Date().getFullYear()}</span></p>
                          </div>
                      </div>
                      <div className="col-md-6 col-12 align-self-center">
                          <div className="ltn__copyright-menu text-right text-end">
                              <ul>
                                  <li><Link href="/terms-conditions">Uslovi korišćenja</Link></li>
                                  <li><Link href="/privacy-policy">Politika privatnosti</Link></li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </footer>
      {/* FOOTER AREA END */}
    </>
  );
}
