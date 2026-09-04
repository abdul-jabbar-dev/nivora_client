"use client";

import { useState } from "react";
import { ProductVariant } from "@/types/product";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange?: (variant: ProductVariant) => void;
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants[0] || null
  );

  if (!variants || variants.length === 0) return null;

  const handleSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    if (onVariantChange) onVariantChange(v);
  };

  const isColor = variants[0]?.type === 'color';

  return (
    <div className="flex flex-col gap-3 py-4 border-y border-border mt-4">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">
          {isColor ? 'Color' : 'Option'}: <span className="text-muted-foreground ml-1">{selectedVariant?.name}</span>
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {variants.map((v) => {
          const isSelected = selectedVariant?.id === v.id;
          const isOutOfStock = v.inventory === 0;

          if (isColor) {
            return (
              <button
                key={v.id}
                disabled={isOutOfStock}
                onClick={() => handleSelect(v)}
                className={cn(
                  "relative w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background",
                  isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-105",
                  isOutOfStock && "opacity-50 cursor-not-allowed"
                )}
                aria-label={`Select ${v.name}`}
                title={isOutOfStock ? "Out of stock" : v.name}
              >
                <span
                  className="absolute inset-0 rounded-full shadow-inner border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: v.value }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-px bg-red-500 transform rotate-45" />
                  </div>
                )}
              </button>
            );
          }

          return (
            <button
              key={v.id}
              disabled={isOutOfStock}
              onClick={() => handleSelect(v)}
              className={cn(
                "px-5 py-2.5 rounded-lg border font-medium transition-all text-sm",
                "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2",
                isSelected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:border-foreground/50 text-foreground",
                isOutOfStock && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground hover:border-border"
              )}
            >
              {v.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
