"use client";

import { useQuery } from "@tanstack/react-query";
import { getTrendingProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { motion } from "framer-motion";

export function TrendingProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["trendingProducts"],
    queryFn: getTrendingProducts,
  });

  return (
    <section className="py-24">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Trending Right Now
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover the most loved pieces from our collection, handpicked for you.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-4 animate-pulse">
                <div className="aspect-[4/5] bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-5 bg-muted rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
