'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutChromeProps {
  children: ReactNode;
}

export default function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="body-wrapper">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
