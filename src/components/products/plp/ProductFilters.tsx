"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SlidersHorizontal, X, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/product";

interface ProductFiltersProps {
  categories: Category[];
  initialCategory?: string;
  initialQ?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
  initialMinRating?: string;
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
      params.delete("page"); // Reset page when filtering
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (slug: string) => {
    router.push(pathname + "?" + createQueryString("category", slug), { scroll: false });
    setIsOpen(false);
  };

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const applyPriceFilter = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    params.delete("page");
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("q", q);
  };

  const FilterContent = () => (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full h-10 pl-4 pr-10 text-sm bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button type="submit" className="absolute right-2 p-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Search className="h-4 w-4" />
        </button>
      </form>


      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-muted-foreground">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-9 px-3 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button onClick={applyPriceFilter} variant="outline" size="sm" className="w-full mt-3 h-8">
          Apply Price
        </Button>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-4 text-sm tracking-wider uppercase text-muted-foreground">Rating</h3>
        <div className="flex flex-col gap-3">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleFilterChange("minRating", rating.toString())}
              className={cn(
                "flex items-center gap-2 text-sm transition-colors hover:text-foreground",
                initialMinRating === rating.toString() ? "font-semibold text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("w-4 h-4", i < rating ? "fill-current" : "text-muted-foreground/30")} />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
          {initialMinRating && (
            <button 
              onClick={() => handleFilterChange("minRating", "")}
              className="text-left text-xs text-muted-foreground hover:text-foreground mt-2"
            >
              Clear Rating
            </button>
          )}
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
