import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  loadFromStorage: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const exists = state.cart.find((i) => i.id === item.id);
          if (exists) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.max(1, i.quantity + delta) }
              : i
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        })),
      clearCart: () => set({ cart: [] }),
      loadFromStorage: () => {
        try {
          const stored = localStorage.getItem("cart-storage");
          if (stored) {
            const parsed = JSON.parse(stored).state.cart;
            set({ cart: parsed });
          }
        } catch {}
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
