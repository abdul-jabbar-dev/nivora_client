"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const { setSession, setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (session?.user) {
        useCartStore.getState().syncWithBackend();
        useWatchlistStore.getState().syncWithBackend();
      }
    });

    // Listen for changes on auth state (log in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (_event === 'SIGNED_IN' || session?.user) {
        useCartStore.getState().syncWithBackend();
        useWatchlistStore.getState().syncWithBackend();
      } else if (_event === 'SIGNED_OUT') {
        useCartStore.getState().clearCart();
        useWatchlistStore.getState().clearWatchlist();
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setIsLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
