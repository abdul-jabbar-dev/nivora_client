"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";

export function ShopByCategory() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Shop by Category
          </h2>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative flex h-[250px] md:h-[400px] w-full flex-col overflow-hidden rounded-2xl bg-muted"
                >
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm mb-4">
                      {category.productCount} Products
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          >
            All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
