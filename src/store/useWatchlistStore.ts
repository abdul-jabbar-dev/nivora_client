import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

interface WatchlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (!exists) {
            return { items: [...state.items, product] };
          }
          return state;
        });
      },
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
        
      isInWatchlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: "nivora-watchlist-storage",
    }
  )
);
