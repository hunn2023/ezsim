import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartState } from "@/types/cart";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            // Không vượt quá stock
            const newQty = Math.min(existing.quantity + item.quantity, existing.stock);
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
              ),
            };
          }

          // Sản phẩm mới: clamp quantity theo stock
          const clampedQty = Math.min(item.quantity, item.stock);
          return { items: [...state.items, { ...item, quantity: clampedQty }] };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      increaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId
              ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
              : i
          ),
        }));
      },

      decreaseQuantity: (productId: string) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId
              ? { ...i, quantity: Math.max(i.quantity - 1, 1) }
              : i
          ),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === productId
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Computed: dùng get() để đọc state hiện tại, tránh stale closure
      getTotalQuantity: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },
    }),
    {
      name: "ezsim-cart",
    }
  )
);
