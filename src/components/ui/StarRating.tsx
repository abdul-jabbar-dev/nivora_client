import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showNumber?: boolean;
  count?: number;
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function StarRating({
  rating,
  maxStars = 5,
  size = "sm",
  className,
  showNumber = false,
  count,
}: StarRatingProps) {
  const normalizedRating = Math.max(0, Math.min(maxStars, rating || 0));
  const iconSize = sizeClasses[size];

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(maxStars)].map((_, i) => {
          const starNumber = i + 1;
          // Percentage of this specific star that should be filled (0 to 100%)
          const fillPercentage = Math.max(
            0,
            Math.min(100, (normalizedRating - i) * 100)
          );

          return (
            <div key={i} className={cn("relative shrink-0", iconSize)}>
              {/* Background Empty Star */}
              <Star
                className={cn(
                  iconSize,
                  "text-muted-foreground/30 fill-muted-foreground/20"
                )}
                aria-hidden="true"
              />

              {/* Foreground Filled Star with width-based clipping */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillPercentage}%` }}
                  aria-hidden="true"
                >
                  <Star
                    className={cn(iconSize, "fill-amber-400 text-amber-400")}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className="font-semibold text-foreground text-sm ml-1">
          {normalizedRating > 0 ? normalizedRating.toFixed(1) : "0.0"}
        </span>
      )}

      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
