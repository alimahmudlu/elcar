import { ProductType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = ProductType & { count: number };

interface CartState {
  items: CartItem[];
  addToCart: (product: ProductType) => void;
  removeFromCart: (productId: string) => void;
  getCount: (productId: string) => number;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clearBasket: () => void;
}

// Custom storage adapter for zustand persist to store only {items: [...]} in localStorage
const itemsOnlyStorage = () => {
  const base = typeof window !== "undefined" ? localStorage : {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
  return {
    getItem: (name: string) => {
      const value = base.getItem(name);
      if (!value) return null;
      return JSON.stringify({ state: { items: JSON.parse(value).items } });
    },
    setItem: (name: string, value: string) => {
      const parsed = JSON.parse(value);
      base.setItem(name, JSON.stringify({ items: parsed.state.items }));
    },
    removeItem: (name: string) => base.removeItem(name),
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item._id === product._id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? {
                      ...item,
                      oldPrice: product.price,
                      price: product.discount ? product.discountedPrice : product.price,
                      count: item.count + 1,
                    }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                {
                  ...product,
                  oldPrice: product.price,
                  price: product.discount ? product.discountedPrice : product.price,
                  count: 1,
                },
              ],
            };
          }
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }));
      },
      getCount: (productId) => {
        const item = get().items.find((item) => item._id === productId);
        return item ? item.count : 0;
      },
      increment: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId
              ? { ...item, count: item.count + 1 }
              : item
          ),
        }));
      },
      decrement: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === productId
                ? { ...item, count: item.count - 1 }
                : item
            )
            .filter((item) => item.count > 0),
        }));
      },
      clearBasket: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(itemsOnlyStorage),
    }
  )
);
