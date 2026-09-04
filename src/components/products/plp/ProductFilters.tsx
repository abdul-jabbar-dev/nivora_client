"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/product";

interface ProductFiltersProps {
  categories: Category[];
  initialCategory?: string;
}

export function ProductFilters({ categories, initialCategory = "all" }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.delete("page"); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (slug: string) => {
    router.push(pathname + "?" + createQueryString("category", slug));
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-muted-foreground">Category</h3>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "text-left transition-colors hover:text-foreground",
              initialCategory === "all" ? "font-semibold text-foreground" : "text-muted-foreground"
            )}
          >
            Shop
          </button>
          {categories.map((c) => {
            const isSelected = initialCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => handleCategoryChange(c.slug)}
                className={cn(
                  "text-left transition-colors hover:text-foreground flex items-center justify-between",
                  isSelected ? "font-semibold text-foreground" : "text-muted-foreground"
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{c.productCount}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shop</h1>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-border min-h-[50vh]">
        <FilterContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-background p-6 shadow-xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
}
