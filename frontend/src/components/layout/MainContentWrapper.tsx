'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export function MainContentWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <main className={`flex-1 w-full ${isHome ? 'pt-0' : 'pt-20 sm:pt-24'}`}>
      {children}
    </main>
  );
}
