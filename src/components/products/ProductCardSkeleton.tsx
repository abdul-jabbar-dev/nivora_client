import { Skeleton } from "@/components/ui/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-sm border border-border/50">
      {/* Image Skeleton */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            {/* Title Skeleton */}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Price and Rating Skeleton */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="space-y-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
