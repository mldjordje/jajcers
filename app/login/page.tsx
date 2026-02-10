'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Prijava korisnika bice vezana na API u narednom koraku migracije.');
  };

  return (
    <div className="ltn__login-area pb-110 pt-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="account-login-inner">
              <form className="ltn__form-box contact-form-box" onSubmit={handleSubmit}>
                <h3 className="text-center mb-20">Prijava</h3>
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
                  Prijavi se
                </button>
                {message && <p className="mt-15">{message}</p>}
                <p className="mt-20">
                  Nemate nalog? <Link href="/register">Registrujte se</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
