'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function LegacyScripts() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Script src="/js/plugins.js" strategy="lazyOnload" />
      <Script src="/js/main.js" strategy="lazyOnload" />
    </>
  );
}
