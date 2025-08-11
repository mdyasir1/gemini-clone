import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { User } from '@/utils/types';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoggedIn: false,
        login: (user) => set({ user, isLoggedIn: true }),
        logout: () => set({ user: null, isLoggedIn: false }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);