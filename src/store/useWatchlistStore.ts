import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";
import { useAuthStore } from "./useAuthStore";
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = (useAuthStore.getState().session as any)?.access_token;
  if (!token) throw new Error("No token");
  
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async r => {
    if (!r.ok) throw await r.json();
    return r.json();
  });
};

interface WatchlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  clearWatchlist: () => void;
  syncWithBackend: () => Promise<void>;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: async (product) => {
        const state = get();
        const exists = state.items.some((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...state.items, product] });
          if (useAuthStore.getState().user) {
            try {
              await fetchWithAuth('/watchlist', { method: 'POST', body: JSON.stringify({ productId: product.id }) });
            } catch (err) { console.error('Failed to add to DB watchlist', err); }
          }
        }
      },
      
      removeItem: async (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        if (useAuthStore.getState().user) {
          try {
            await fetchWithAuth(`/watchlist/${id}`, { method: 'DELETE' });
          } catch (err) { console.error('Failed to remove from DB watchlist', err); }
        }
      },
        
      isInWatchlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearWatchlist: () => {
        set({ items: [] });
      },

      syncWithBackend: async () => {
        if (!useAuthStore.getState().user) return;
        try {
          // Push local items to backend first
          const localItems = get().items;
          for (const item of localItems) {
            await fetchWithAuth('/watchlist', { method: 'POST', body: JSON.stringify({ productId: item.id }) }).catch(() => {});
          }
          // Pull merged from backend
          const dbItems = await fetchWithAuth('/watchlist');
          // Assuming backend returns an array of watchlist items which includes the product details
          const mergedProducts = dbItems.map((wi: any) => wi.product);
          set({ items: mergedProducts });
        } catch (err) {
          console.error("Failed to sync watchlist", err);
        }
      },
    }),
    {
      name: "nivora-watchlist-storage",
    }
  )
);
