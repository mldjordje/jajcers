'use client';
import { useState } from 'react';

export default function ContactPage() {
    const [msg, setMsg] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setMsg(data.message);
            setStatus(data.status);
            if(data.status === 'success') {
                e.currentTarget.reset();
            }
        } catch (error) {
            setMsg('Došlo je do greške.');
            setStatus('error');
        }
    };

    return (
        <>
            <div className="ltn__breadcrumb-area ltn__breadcrumb-area-2 ltn__breadcrumb-color-white bg-overlay-theme-black-90 bg-image" data-bg="/content/thumbnail.jpg">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ltn__breadcrumb-inner ltn__breadcrumb-inner-2 justify-content-between">
                                <div className="section-title-area ltn__section-title-2">
                                    <h6 className="section-subtitle ltn__secondary-color">// Dobrodošli na našu farmu</h6>
                                    <h1 className="section-title white-color">Kontakt</h1>
                                </div>
                                <div className="ltn__breadcrumb-list">
                                    <ul>
                                        <li><a href="/">Početna</a></li>
                                        <li>Kontakt</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ltn__contact-address-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                                <div className="ltn__contact-address-icon">
                                    <img src="/img/icons/10.png" alt="Icon Image" />
                                </div>
                                <h3>Email Adresa</h3>
                                <p>info@jajce.rs</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                                <div className="ltn__contact-address-icon">
                                    <img src="/img/icons/11.png" alt="Icon Image" />
                                </div>
                                <h3>Kontakt telefon</h3>
                                <p>+381 62 8008177</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="ltn__contact-address-item ltn__contact-address-item-3 box-shadow">
                                <div className="ltn__contact-address-icon">
                                    <img src="/img/icons/12.png" alt="Icon Image" />
                                </div>
                                <h3>Adresa</h3>
                                <p>Ozrenska 22, Vrtište</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ltn__contact-message-area mb-120 mb--100">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="ltn__form-box contact-form-box box-shadow white-bg">
                                <h4 className="title-2">Pošaljite upit</h4>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-item input-item-name ltn__custom-icon">
                                                <input type="text" name="name" placeholder="Unesite vaše ime" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-item input-item-email ltn__custom-icon">
                                                <input type="email" name="email" placeholder="Unesite vašu email adresu" required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-item">
                                                <select className="nice-select" name="service_type">
                                                    <option>Izaberite vrstu usluge</option>
                                                    <option>Dostava jaja</option>
                                                    <option>Veleprodaja</option>
                                                    <option>Maloprodaja</option>
                                                    <option>Saradnja</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-item input-item-phone ltn__custom-icon">
                                                <input type="text" name="phone" placeholder="Unesite broj telefona" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input-item input-item-textarea ltn__custom-icon">
                                        <textarea name="message" placeholder="Unesite vašu poruku" required></textarea>
                                    </div>
                                    <div className="btn-wrapper mt-0">
                                        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit">Pošaljite upit</button>
                                    </div>
                                    {msg && <p className="form-messege mb-0 mt-20" style={{ color: status === 'success' ? 'green' : 'red' }}>{msg}</p>}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="google-map mb-120">
                <iframe src="https://maps.google.com/maps?q=43.372477,21.810378+(Poljoprivredno%20gazdinstvo%20Nešić)&t=h&z=17&ie=UTF8&iwloc=B&output=embed" width="100%" height="100%" frameBorder="0" allowFullScreen aria-hidden="false" tabIndex={0}></iframe>
            </div>
        </>
    );
}
