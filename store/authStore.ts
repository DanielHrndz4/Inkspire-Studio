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

// Helpers para codificar/decodificar base64
const encode = (value: string) => btoa(unescape(encodeURIComponent(value)));
const decode = (value: string) => decodeURIComponent(escape(atob(value)));

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
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        try {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('inkspire_wishlist');
        } catch {}
        location.reload();
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          if (!raw) return null;
          try {
            return JSON.parse(decode(raw));
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, encode(JSON.stringify(value)));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
