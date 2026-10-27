import { ProductType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const COMPARE_LIMIT = 4;

/** Müqayisə panelində göstərmək üçün məhsulun qısa surəti */
export type CompareItem = {
  _id: string;
  title: string;
  section: string;
  image?: string;
};

interface CompareState {
  items: CompareItem[];
  has: (id: string) => boolean;
  /** Əlavə edir və ya çıxarır; limit dolubsa false qaytarır */
  toggle: (product: ProductType) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}

const safeStorage = () =>
  typeof window !== "undefined"
    ? localStorage
    : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((item) => item._id === id),
      toggle: (product) => {
        if (get().has(product._id)) {
          get().remove(product._id);
          return true;
        }
        if (get().items.length >= COMPARE_LIMIT) return false;
        set((state) => ({
          items: [
            ...state.items,
            {
              _id: product._id,
              title: product.title,
              section: product.section,
              image: product.image?.src,
            },
          ],
        }));
        return true;
      },
      remove: (id) =>
        set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "compare",
      storage: createJSONStorage(safeStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/** Müqayisə səhifəsinin ünvanı (dil prefiksi olmadan) */
export const compareHref = (ids: string[]) => `/compare?ids=${ids.join(",")}`;
