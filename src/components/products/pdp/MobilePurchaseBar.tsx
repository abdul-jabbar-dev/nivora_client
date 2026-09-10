"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";

interface MobilePurchaseBarProps {
  product: Product;
}

export function MobilePurchaseBar({ product }: MobilePurchaseBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past the main purchase actions
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 p-3.5 bg-background/95 backdrop-blur-md border-t border-border z-40 md:hidden animate-in slide-in-from-bottom-2 duration-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total</span>
          <span className="text-xl font-bold">৳{(product.offerPrice ?? product.price).toFixed(2)}</span>
        </div>
        <Button 
          onClick={() => addItem(product, product.variants?.[0] || undefined)}
          size="lg" 
          className="flex-1 h-12 shadow-md"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
