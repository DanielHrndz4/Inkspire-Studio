// store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  tel: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (userData: User, authToken: string) => {
        set({
          user: userData,
          token: authToken,
          isAuthenticated: true,
          isLoading: false
        });
        try {
          localStorage.setItem('user_id', userData.id)
        } catch {}
      },
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        try {
          localStorage.removeItem('user_id')
          localStorage.removeItem('auth-storage')
          localStorage.removeItem('inkspire_wishlist')
        } catch {}
        location.reload()
      },
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)
          return value ? atob(value) : null
        },
        setItem: (name, value) => {
          localStorage.setItem(name, btoa(value))
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      serialize: (state) => JSON.stringify(state),
      deserialize: (str) => JSON.parse(str),
    }
  )
);