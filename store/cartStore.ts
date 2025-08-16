import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image: string;
  size?: string;
  color?: string;
}

export interface CartState {
  items: CartItem[];
  open: boolean;
  checkoutOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  beginCheckout: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      checkoutOpen: false,
      addItem: (item) => {
        set((state) => {
          const key = (i: CartItem) =>
            `${i.size}|${i.color}`;
          const existing = state.items.find((i) => key(i) === key(item));
          
          if (existing) {
            return {
              items: state.items.map((i) =>
                key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i
              ),
              open: true
            };
          }
          return { items: [item, ...state.items], open: true };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),
      clear: () => set({ items: [] }),
      setOpen: (open) => set({ open }),
      setCheckoutOpen: (checkoutOpen) => set({ checkoutOpen }),
      beginCheckout: () => set({ checkoutOpen: true, open: true }),
    }),
    {
      name: "inkspire_cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export types for context
export type CartContextType = Pick<
  CartState,
  | 'items'
  | 'addItem'
  | 'removeItem'
  | 'updateQty'
  | 'clear'
  | 'open'
  | 'setOpen'
  | 'beginCheckout'
> & {
  count: number;
  total: number;
};