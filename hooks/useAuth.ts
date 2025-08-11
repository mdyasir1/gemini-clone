import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn && pathname.startsWith('/dashboard')) {
      router.push('/auth/signup');
    }
    if (isLoggedIn && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, pathname, router]);

  return { isLoggedIn };
};