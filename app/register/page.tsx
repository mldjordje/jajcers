'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Lozinke se ne poklapaju.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: firstName,
          lastname: lastName,
          email,
          password,
          confirmpassword: confirmPassword,
        }),
      });

      const payload = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !payload.success) {
        setMessage(payload.message || 'Registracija nije uspela.');
        setLoading(false);
        return;
      }

      router.replace('/account/orders');
      router.refresh();
    } catch {
      setMessage('Doslo je do greske pri registraciji.');
      setLoading(false);
    }
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
                <input
                  type="password"
                  placeholder="Potvrdite lozinku"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
                <button className="theme-btn-1 btn btn-block" type="submit" disabled={loading}>
                  {loading ? 'Registracija...' : 'Registruj se'}
                </button>
                {message ? <p className="mt-15">{message}</p> : null}
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
