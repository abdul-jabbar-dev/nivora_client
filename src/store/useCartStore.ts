import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "@/types/product";
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
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.message || JSON.stringify(err));
    }
    return r.json();
  });
};

export interface CartItem {
  id: string; // unique combination of product ID and variant ID
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  syncWithBackend: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: async (product, variant, quantity = 1) => {
        const id = variant ? `${product.id}-${variant.type}` : product.id;
        
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { id, product, variant, quantity }],
          };
        });
        
        if (useAuthStore.getState().user) {
          try {
            await fetchWithAuth('/cart/items', { 
              method: 'POST', 
              body: JSON.stringify({ productId: product.id, variant: variant?.type || null, quantity }) 
            });
          } catch (err) { console.error('Failed to add to DB cart', err); }
        }

        // Open the cart when an item is added
        get().openCart();
      },
      
      removeItem: async (id) => {
        const itemToRemove = get().items.find(i => i.id === id);
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
        if (useAuthStore.getState().user && itemToRemove) {
          try {
            const variantPath = itemToRemove.variant ? `/${itemToRemove.variant.type}` : '';
            await fetchWithAuth(`/cart/items/${itemToRemove.product.id}${variantPath}`, { method: 'DELETE' });
          } catch (err) { console.error('Failed to remove from DB cart', err); }
        }
      },
        
      updateQuantity: async (id, quantity) => {
        const itemToUpdate = get().items.find(i => i.id === id);
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
        if (useAuthStore.getState().user && itemToUpdate) {
          try {
            await fetchWithAuth('/cart/items', { 
              method: 'PUT', 
              body: JSON.stringify({ productId: itemToUpdate.product.id, variant: itemToUpdate.variant?.type || null, quantity }) 
            });
          } catch (err) { console.error('Failed to update DB cart quantity', err); }
        }
      },
        
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.offerPrice ?? item.product.price) * item.quantity, 0);
      },
      
      getCartCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      syncWithBackend: async () => {
        if (!useAuthStore.getState().user) return;
        try {
          // Push local items to backend to merge
          const localItems = get().items;
          const syncData = localItems
            .filter(item => item && item.product && item.product.id)
            .map(item => ({
              productId: item.product.id,
              variant: item.variant?.type || null,
              quantity: item.quantity || 1
            }));
          
          const dbCart = await fetchWithAuth('/cart/sync', { 
            method: 'POST', 
            body: JSON.stringify({ items: syncData }) 
          });
          
          if (dbCart && dbCart.items) {
            const mergedItems = dbCart.items
              .filter((item: any) => item && item.product)
              .map((item: any) => ({
                id: item.variant ? `${item.productId}-${item.variant}` : item.productId,
                product: item.product,
                variant: item.variant ? { type: item.variant, label: item.variant } : undefined, // simplified variant mapping
                quantity: item.quantity
              }));
            set({ items: mergedItems });
          }
        } catch (err) {
          console.error("Failed to sync cart", err);
        }
      }

    }),
    {
      name: "premium-cart-storage",
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state (isOpen)
    }
  )
);
