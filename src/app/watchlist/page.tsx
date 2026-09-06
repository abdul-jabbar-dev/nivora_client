"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Bookmark, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useCartStore } from "@/store/useCartStore";

export default function WatchlistPage() {
  const { items, clearWatchlist } = useWatchlistStore();
  const { addItem, openCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddAllToCart = () => {
    items.forEach(item => {
      addItem(item, item.variants?.[0]);
    });
    openCart();
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">My Watchlist</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          {items.length > 0 && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearWatchlist}>
                Clear All
              </Button>
              <Button onClick={handleAddAllToCart}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-2xl border border-border">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Bookmark className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't saved any items yet. Start exploring our collection and tap the heart icon to save your favorites.
            </p>
            <Link href="/shop">
              <Button size="lg">Discover Products</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
