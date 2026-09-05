"use client";

import { useState } from "react";
import { ProductVariant, ProductVariantOption } from "@/types/product";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange?: (type: string, option: ProductVariantOption) => void;
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  // Store selected option name per variant type
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const initialSelections: Record<string, string> = {};
    if (variants && variants.length > 0) {
      variants.forEach(v => {
        if (v.options && v.options.length > 0) {
          initialSelections[v.type] = v.options[0].name;
        }
      });
    }
    return initialSelections;
  });

  if (!variants || variants.length === 0) return null;

  const handleSelect = (type: string, option: ProductVariantOption) => {
    setSelections(prev => ({ ...prev, [type]: option.name }));
    if (onVariantChange) onVariantChange(type, option);
  };

  return (
    <div className="flex flex-col gap-6 py-4 border-y border-border mt-4">
      {variants.map((variantGroup, groupIdx) => {
        const type = variantGroup.type;
        const options = variantGroup.options || [];
        const selectedOption = selections[type];
        const isColor = type.toLowerCase().includes('color');

        return (
          <div key={`${type}-${groupIdx}`} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">
                {type}: <span className="text-muted-foreground ml-1">{selectedOption}</span>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {options.map((opt, optIdx) => {
                const isSelected = selectedOption === opt.name;

                if (isColor) {
                  return (
                    <button
                      key={`${opt.name}-${optIdx}`}
                      onClick={() => handleSelect(type, opt)}
                      className={cn(
                        "relative w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-background",
                        isSelected ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-105"
                      )}
                      aria-label={`Select ${opt.name}`}
                      title={opt.name}
                    >
                      {opt.image ? (
                        <img src={opt.image} alt={opt.name} className="w-full h-full object-cover rounded-full shadow-inner border border-black/10" />
                      ) : (
                        <span
                          className="absolute inset-0 rounded-full shadow-inner border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: opt.name.toLowerCase() }}
                        />
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={`${opt.name}-${optIdx}`}
                    onClick={() => handleSelect(type, opt)}
                    className={cn(
                      "px-5 py-2.5 rounded-lg border font-medium transition-all text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2",
                      isSelected
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background hover:border-foreground/50 text-foreground"
                    )}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
