"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
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
    <div className={cn("group flex flex-row sm:flex-col gap-4 items-center sm:items-start", className)}>
      <div className="relative overflow-hidden rounded-lg bg-muted shrink-0 w-28 h-28 sm:w-full sm:h-auto">
        <Link href={`/products/${product.slug || product.id}`} className="block relative w-full h-full sm:aspect-[4/5]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.status === "upcoming" && (
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                Coming Soon
              </span>
            )}
            {product.isNew && product.status !== "upcoming" && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                New
              </span>
            )}
            {discount > 0 && !hideDiscountInfo && (
              <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                -{discount}%
              </span>
            )}
            {product.discountExpiryDate && !hideDiscountInfo && (
              <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                Ends {new Date(product.discountExpiryDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </Link>

        {/* Hover Actions */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 transition-all duration-300 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 px-4">
          <Button 
            size="icon" 
            variant="outline" 
            className="h-10 w-10 bg-background/90 backdrop-blur shrink-0 rounded-full"
            onClick={handleWatchlistClick}
          >
            <Heart className={cn("h-5 w-5", inWatchlist && "fill-red-500 text-red-500 transition-colors")} />
            <span className="sr-only">{inWatchlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
          </Button>
          {product.status === "upcoming" ? (
            <Button 
              className="w-full h-10 bg-muted/90 text-muted-foreground backdrop-blur rounded-full cursor-not-allowed"
            >
              Coming Soon
            </Button>
          ) : (
            <Button 
              onClick={() => addItem(product, product.variants?.[0] || undefined)}
              className="w-full h-10 bg-background/90 text-foreground backdrop-blur hover:bg-foreground hover:text-background rounded-full transition-colors"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1 min-w-0 py-2 sm:py-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {typeof product.category === 'object' ? (product.category as any)?.name : product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-foreground text-foreground" />
            <span>{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>
        <Link href={`/products/${product.slug || product.id}`} className="font-medium hover:underline underline-offset-4">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-semibold">৳{currentPrice.toFixed(2)}</span>
          {oldPrice && oldPrice > currentPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ৳{oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
