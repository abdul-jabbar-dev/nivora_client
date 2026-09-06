"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Tag } from "lucide-react";

export function SpecialOffers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["specialOffers"],
    queryFn: () => getProducts({ filter: 'discount', limit: 8 }),
  });
  const products = data?.products;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // If there are no discounted products, hide this section
  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  if (isLoading && products?.length === 0) return null;
  if (!isLoading && products && products?.length > 0) return (
    <section className="py-24 bg-red-50/50 overflow-hidden">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <Tag className="w-5 h-5" />
              <span className="font-bold text-sm tracking-widest uppercase">Limited Time</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Special Offers
            </h2>
          </div>

          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full bg-background">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full bg-background">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-x-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 animate-pulse">
                <div className="aspect-[4/5] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-5 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 -mb-8 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products?.map((product) => (
              <div key={product.id} className="min-w-[280px] md:min-w-[320px] flex-shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
