"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ["newArrivals"],
    queryFn: () => getProducts({ filter: 'new', limit: 8 }),
  });
  const products = data?.products;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };
  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }
  return (
    <section className="py-24 overflow-hidden">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              New Arrivals
            </h2>
            <Link
              href="/shop?sort=newest"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
            >
              See All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className="rounded-full" aria-label="Scroll left">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className="rounded-full" aria-label="Scroll right">
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
