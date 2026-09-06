"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";

interface PurchaseActionsProps {
  product: Product;
}

export function PurchaseActions({ product }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const inventory = product.stock ?? 0;

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
        <Button disabled size="lg" className="w-full sm:w-auto text-base h-14">
          Out of Stock
        </Button>
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

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border border-border rounded-lg h-14 w-full sm:w-32 bg-background shrink-0">
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

        {/* Action Buttons */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
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
          
          <Button
            variant="outline"
            size="lg"
            disabled={isUpcoming}
            className="flex-1 sm:flex-none sm:w-32 h-14 text-base"
          >
            {isUpcoming ? "Soon" : "Buy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
