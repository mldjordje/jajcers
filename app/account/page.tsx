import Link from 'next/link';

export default function AccountPage() {
  return (
    <div className="ltn__account-area pb-110 pt-80">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-title-area text-center">
              <h1 className="section-title">Moj nalog</h1>
              <p>Korisnicki nalog je prebacen na Next.js. Login/session integracija je sledeci korak.</p>
            </div>
            <div className="text-center mt-30">
              <Link href="/login" className="theme-btn-1 btn btn-effect-1">
                Prijava
              </Link>
              <Link href="/register" className="theme-btn-2 btn btn-effect-2 ml-10">
                Registracija
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
