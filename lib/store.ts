import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }),
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);