'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState('/account/orders');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidate = params.get('next');
    if (candidate && candidate.startsWith('/')) {
      setNextPath(candidate);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) {
        setMessage(payload.message || 'Prijava nije uspela.');
        setLoading(false);
        return;
      }

      router.replace(nextPath.startsWith('/') ? nextPath : '/account/orders');
      router.refresh();
    } catch {
      setMessage('Doslo je do greske pri prijavi.');
      setLoading(false);
    }
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
                <button className="theme-btn-1 btn btn-block" type="submit" disabled={loading}>
                  {loading ? 'Prijava...' : 'Prijavi se'}
                </button>
                {message ? <p className="mt-15">{message}</p> : null}
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
