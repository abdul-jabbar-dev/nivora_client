"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/product";
import { ProductSort } from "./ProductSort";

interface ProductFiltersProps {
  categories: Category[];
  initialCategory?: string;
  initialQ?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialMinRating?: string;
}

interface FilterBodyProps {
  q: string;
  setQ: (val: string) => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  initialMinRating?: string;
  handleSearch: (e?: React.FormEvent) => void;
  handleClearSearch: () => void;
  applyPriceFilter: () => void;
  handleFilterChange: (name: string, value: string) => void;
}

// Extracted outside to guarantee stable React component identity across renders
// This prevents input destruction and focus loss on keystrokes
function FilterBody({
  q,
  setQ,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  initialMinRating,
  handleSearch,
  handleClearSearch,
  applyPriceFilter,
  handleFilterChange,
}: FilterBodyProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Search Input with Clear Action */}
      <div>
        <h3 className="font-semibold mb-3 text-xs tracking-wider uppercase text-muted-foreground">
          Search Products
        </h3>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-10 pl-3.5 pr-16 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground transition-all"
          />
          <div className="absolute right-1.5 flex items-center gap-1">
            {q && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-xs tracking-wider uppercase text-muted-foreground">
          Price Range (৳)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
          <span className="text-muted-foreground font-medium">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
          />
        </div>
        <Button onClick={applyPriceFilter} variant="outline" size="sm" className="w-full mt-3 h-8 shadow-xs">
          Apply Price
        </Button>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3 text-xs tracking-wider uppercase text-muted-foreground">
          Customer Rating
        </h3>
        <div className="flex flex-col gap-2.5">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() =>
                handleFilterChange(
                  "minRating",
                  initialMinRating === rating.toString() ? "" : rating.toString()
                )
              }
              className={cn(
                "flex items-center justify-between py-1 px-2 rounded-md text-sm transition-colors hover:bg-muted/60",
                initialMinRating === rating.toString()
                  ? "bg-muted font-semibold text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3.5 h-3.5",
                        i < rating ? "fill-current" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span>&amp; Up</span>
              </div>
              {initialMinRating === rating.toString() && (
                <span className="text-xs text-primary font-bold">✓</span>
              )}
            </button>
          ))}
          {initialMinRating && (
            <button
              type="button"
              onClick={() => handleFilterChange("minRating", "")}
              className="text-left text-xs text-muted-foreground hover:text-foreground mt-1 underline underline-offset-2"
            >
              Reset Rating Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductFilters({
  categories,
  initialCategory = "all",
  initialQ = "",
  initialMinPrice = "",
  initialMaxPrice = "",
  initialMinRating = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState(initialQ);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQ(initialQ || "");
    setMinPrice(initialMinPrice || "");
    setMaxPrice(initialMaxPrice || "");
  }, [initialQ, initialMinPrice, initialMaxPrice]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    handleFilterChange("q", q.trim());
  };

  const handleClearSearch = () => {
    setQ("");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    handleFilterChange("q", "");
  };

  // Debounced auto-search as user types (450ms)
  useEffect(() => {
    // Only auto-search if value differs from URL parameter
    if (q !== initialQ) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        handleFilterChange("q", q.trim());
      }, 450);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [q, initialQ]);

  const filterBodyProps: FilterBodyProps = {
    q,
    setQ,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    initialMinRating,
    handleSearch,
    handleClearSearch,
    applyPriceFilter,
    handleFilterChange,
  };

  return (
    <>
      {/* Mobile Filter & Sort Bar */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="gap-2 bg-background font-medium shadow-xs">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
        <ProductSort />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 pr-8 border-r border-border min-h-[50vh]">
        <FilterBody {...filterBodyProps} />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-background p-6 shadow-xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1">
              <FilterBody {...filterBodyProps} />
            </div>
            <div className="mt-8 pt-4 border-t border-border sticky bottom-0 bg-background pb-safe">
              <Button onClick={() => setIsOpen(false)} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
