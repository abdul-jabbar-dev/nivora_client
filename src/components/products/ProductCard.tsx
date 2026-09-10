"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, ShoppingBag } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
  hideDiscountInfo?: boolean;
}

export function ProductCard({ product, className, hideDiscountInfo = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWatchlist, removeItem: removeWatchlist, isInWatchlist } = useWatchlistStore();
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inWatchlist = isMounted ? isInWatchlist(product.id) : false;

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWatchlist) {
      removeWatchlist(product.id);
    } else {
      addWatchlist(product);
    }
  };

  const currentPrice = (hideDiscountInfo ? product.price : product.offerPrice) ?? product.price;
  const oldPrice = (!hideDiscountInfo && product.offerPrice) ? product.price : product.originalPrice;

  const discount = oldPrice && currentPrice < oldPrice && !hideDiscountInfo
    ? Math.round((1 - currentPrice / oldPrice) * 100)
    : 0;

 
  return (
    <div className={cn("group flex flex-col gap-2.5 items-start w-full", className)}>
      <div className="relative overflow-hidden rounded-xl bg-muted w-full aspect-[4/5]">
        <Link href={`/products/${product.slug || product.id}`} className="block relative w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
            {product.status === "upcoming" && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-xs">
                Coming Soon
              </span>
            )}
            {product.isNew && product.status !== "upcoming" && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary-foreground shadow-xs">
                New
              </span>
            )}
            {discount > 0 && !hideDiscountInfo && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white shadow-xs">
                -{discount}%
              </span>
            )}
          </div>
        </Link>

        {/* Quick Wishlist Action (Always easily accessible on touch and click) */}
        <button
          type="button"
          onClick={handleWatchlistClick}
          className="absolute right-2.5 top-2.5 z-10 p-2 rounded-full bg-background/80 backdrop-blur hover:bg-background transition-colors text-foreground shadow-sm"
          aria-label={inWatchlist ? "Remove from Wishlist" : "Add to Wishlist"}
          title={inWatchlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Bookmark className={cn("h-4 w-4", inWatchlist && "fill-primary text-primary transition-colors")} />
        </button>

        {/* Desktop Hover Actions */}
        <div className="hidden sm:flex absolute bottom-3 left-0 right-0 justify-center gap-2 opacity-0 transition-all duration-300 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 px-3 z-10">
          {product.status === "upcoming" ? (
            <Button 
              className="w-full h-9 bg-muted/90 text-muted-foreground backdrop-blur rounded-full cursor-not-allowed text-xs"
            >
              Coming Soon
            </Button>
          ) : (
            <Button 
              onClick={() => addItem(product, product.variants?.[0] || undefined)}
              className="w-full h-9 bg-background/95 text-foreground backdrop-blur hover:bg-foreground hover:text-background rounded-full transition-colors text-xs font-medium shadow-md"
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[90px] sm:max-w-[120px]">
            {typeof product.category === 'object' ? (product.category as any)?.name : product.category}
          </span>
          <StarRating rating={product.rating} size="xs" showNumber count={product.reviewCount} />
        </div>
        <Link href={`/products/${product.slug || product.id}`} className="font-medium text-sm hover:underline underline-offset-4 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </Link>
        <div className="flex items-center justify-between w-full mt-0.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-sm sm:text-base text-foreground font-mono">
              ৳{currentPrice.toFixed(2)}
            </span>
            {oldPrice && oldPrice > currentPrice && (
              <span className="text-xs text-muted-foreground line-through font-mono">
                ৳{oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.status !== "upcoming" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => addItem(product, product.variants?.[0] || undefined)}
              className="sm:hidden h-7 px-2 rounded-full text-xs gap-1 border-border shadow-xs"
              title="Add to cart"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
