import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-4 w-64" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Images */}
          <div className="space-y-4 sticky top-24">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-muted">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title & Brand */}
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="h-px bg-border my-8" />

            {/* Variants Skeleton */}
            <div className="space-y-6 mb-8">
              <div>
                <Skeleton className="h-5 w-20 mb-3" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-16 rounded-md" />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Skeleton className="h-14 w-32 rounded-xl" />
              </div>
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            </div>

            {/* Features Skeleton */}
            <div className="space-y-4 bg-muted/50 p-6 rounded-2xl">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs Skeleton */}
        <div className="mt-24">
          <div className="flex border-b border-border overflow-x-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-32 mr-8 mb-[-1px] rounded-t-lg rounded-b-none" />
            ))}
          </div>
          <div className="py-8">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
