import { Container } from "@/components/ui/Container";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-background pt-24 pb-12 lg:pt-32 lg:pb-24">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8 w-full max-w-2xl">
              <Skeleton className="h-6 w-32 rounded-full" />
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-5/6" />
              </div>
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-40 rounded-full" />
                <Skeleton className="h-14 w-40 rounded-full" />
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-muted relative">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Skeleton */}
      <section className="py-16 md:py-24 bg-muted/30">
        <Container>
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
