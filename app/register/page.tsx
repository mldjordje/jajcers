'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Registracija korisnika bice povezana sa backend API-jem u narednom koraku.');
  };

  return (
    <div className="ltn__login-area pb-110 pt-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="account-login-inner">
              <form className="ltn__form-box contact-form-box" onSubmit={handleSubmit}>
                <h3 className="text-center mb-20">Registracija</h3>
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Ime"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      placeholder="Prezime"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                      required
                    />
                  </div>
                </div>
                <input
                  type="email"
                  placeholder="Email adresa"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Lozinka"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button className="theme-btn-1 btn btn-block" type="submit">
                  Registruj se
                </button>
                {message && <p className="mt-15">{message}</p>}
                <p className="mt-20">
                  Vec imate nalog? <Link href="/login">Prijavite se</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
