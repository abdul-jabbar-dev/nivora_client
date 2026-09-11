"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, ShoppingBag, Heart, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWatchlistStore } from "@/store/useWatchlistStore";
import { cn } from "@/lib/utils";

interface PurchaseActionsProps {
  product: Product;
}

export function PurchaseActions({ product }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addWatchlist, removeItem: removeWatchlist, isInWatchlist } = useWatchlistStore();
  const inventory = product.stock ?? 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inWatchlist = isMounted ? isInWatchlist(product.id) : false;

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeWatchlist(product.id);
    } else {
      addWatchlist(product);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on NIVORA`,
          url: url,
        });
        return;
      } catch (e) {
        // Fallback to clipboard if share dialog was cancelled or unsupported
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(inventory, q + 1));

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Call our cart store
    addItem(product, product.variants?.[0] || undefined, quantity);
    
    await new Promise((r) => setTimeout(r, 400));
    setIsAdding(false);
    setIsAdded(true);
    
    // Reset after 2 seconds
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (inventory === 0 && product.status !== "upcoming") {
    return (
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center gap-2 text-red-600 font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Out of Stock
        </div>
        <div className="flex items-center gap-3">
          <Button disabled size="lg" className="flex-1 text-base h-14">
            Out of Stock
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleWatchlistToggle}
            className={cn(
              "h-14 w-14 p-0 rounded-xl border-border shrink-0 transition-all",
              inWatchlist && "border-red-200 bg-red-50 dark:bg-red-950/30 text-red-500"
            )}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label="Watchlist"
          >
            <Heart className={cn("w-5 h-5 transition-transform active:scale-125", inWatchlist ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground")} />
          </Button>
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleShare}
            className={cn(
              "h-14 w-14 p-0 rounded-xl border-border shrink-0 transition-all",
              isCopied && "border-green-200 bg-green-50 dark:bg-green-950/30 text-green-600"
            )}
            title={isCopied ? "Link Copied!" : "Share Product"}
            aria-label="Share"
          >
            {isCopied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  const isUpcoming = product.status === "upcoming";

  return (
    <div className="flex flex-col gap-6 mt-6 border-b border-border pb-8">
      {/* Stock Status */}
      {!isUpcoming && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium text-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          {inventory < 10 ? `Only ${inventory} left in stock` : "In Stock"}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border rounded-xl h-14 w-full sm:w-32 bg-background shrink-0">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1 || isUpcoming}
            className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 flex items-center justify-center font-medium">
            {quantity}
          </div>
          <button
            onClick={handleIncrease}
            disabled={quantity >= inventory || isUpcoming}
            className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Add to Cart + Watchlist + Share */}
        <div className="flex-1 flex items-center gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded || isUpcoming}
            size="lg"
            className={`flex-1 h-14 text-base transition-all duration-300 ${
              isAdded && !isUpcoming ? "bg-green-600 hover:bg-green-700 text-white" : ""
            }`}
          >
            {isUpcoming ? (
              <span className="flex items-center gap-2">
                Coming Soon
              </span>
            ) : isAdding ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Adding...
              </span>
            ) : isAdded ? (
              <span className="flex items-center gap-2">
                ✓ Added to Cart
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </span>
            )}
          </Button>

          {/* Watchlist Button */}
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleWatchlistToggle}
            className={cn(
              "h-14 w-14 p-0 rounded-xl border-border shrink-0 transition-all",
              inWatchlist && "border-red-200 bg-red-50 dark:bg-red-950/30 text-red-500"
            )}
            title={inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            aria-label="Watchlist"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-all duration-200 active:scale-125",
                inWatchlist ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-foreground"
              )}
            />
          </Button>

          {/* Share Button */}
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleShare}
            className={cn(
              "h-14 w-14 p-0 rounded-xl border-border shrink-0 transition-all relative",
              isCopied && "border-green-200 bg-green-50 dark:bg-green-950/30 text-green-600"
            )}
            title={isCopied ? "Link Copied!" : "Share Product"}
            aria-label="Share"
          >
            {isCopied ? (
              <Check className="w-5 h-5 text-green-600 animate-in zoom-in" />
            ) : (
              <Share2 className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
