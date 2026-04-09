import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  coupon: { code: string; percentage: number } | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: number) => void;
  updateQuantity: (id: string, size: number, quantity: number) => void;
  setCoupon: (coupon: { code: string; percentage: number } | null) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  discountedPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      addItem: (newItem) => {
        const existingItem = get().items.find(
          (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
        );
        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === newItem.id && item.selectedSize === newItem.selectedSize
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (id, size) => set({
        items: get().items.filter((i) => !(i.id === id && i.selectedSize === size))
      }),
      updateQuantity: (id, size, quantity) => set({
        items: get().items.map((i) => 
          (i.id === id && i.selectedSize === size) ? { ...i, quantity } : i
        )
      }),
      setCoupon: (coupon) => set({ coupon }),
      clearCart: () => set({ items: [], coupon: null }),
      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      totalPrice: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      discountedPrice: () => {
        const total = get().totalPrice();
        const coupon = get().coupon;
        if (coupon) {
          return total * (1 - coupon.percentage / 100);
        }
        return total;
      },
    }),
    { name: 'cart-storage' }
  )
);
