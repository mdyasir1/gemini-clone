'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const pathname = usePathname();
  
  const showNavbar = isLoggedIn && pathname.startsWith('/dashboard');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
      {showNavbar && <Navbar />}
      {children}
    </ThemeProvider>
  );
}
