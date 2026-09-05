import { Container } from "@/components/ui/Container";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Container>
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="lg:hidden flex items-center gap-2" disabled>
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters Skeleton (Hidden on Mobile) */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 bg-background p-6 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            
            <div className="space-y-6">
              {/* Category Filter Skeleton */}
              <div>
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-md shrink-0" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-px bg-border w-full my-6" />

              {/* Price Filter Skeleton */}
              <div>
                <Skeleton className="h-5 w-24 mb-4" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <span className="text-muted-foreground">-</span>
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="h-px bg-border w-full my-6" />

              {/* Status Filter Skeleton */}
              <div>
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 rounded-md" />
                <div className="flex gap-1 hidden sm:flex">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
