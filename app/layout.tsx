import type { Metadata } from 'next';
import './globals.css';
import LayoutChrome from '@/components/LayoutChrome';
import PwaRegister from '@/components/PwaRegister';
import HeroProvider from '@/components/HeroProvider';
import LegacyScripts from '@/components/LegacyScripts';

export const metadata: Metadata = {
  title: 'Jajce.rs - Sveža jaja, direktno sa farme na vaš sto!',
  description: 'Kupujte jaja koja su istog dana proizvedena i isporučena – bez posrednika, bez dugog stajanja u skladištima!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <head>
        <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon" />
        <link rel="stylesheet" href="/css/font-icons.css" />
        <link rel="stylesheet" href="/css/plugins.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>
      <body>
        {/* Preloader - adapted from LoadScripts */}
        <div className="preloader d-none" id="preloader">
            <div className="preloader-inner">
                <div className="spinner">
                    <div className="dot1"></div>
                    <div className="dot2"></div>
                </div>
            </div>
        </div>

        <HeroProvider>
          <LayoutChrome>{children}</LayoutChrome>
          <PwaRegister />
          <LegacyScripts />
        </HeroProvider>
      </body>
    </html>
  );
}
