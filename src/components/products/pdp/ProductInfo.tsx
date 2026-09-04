import { Star } from "lucide-react";

interface ProductInfoProps {
  title: string;
  brand?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
}

export function ProductInfo({
  title,
  brand,
  price,
  originalPrice,
  rating,
  reviewCount,
  isNew,
}: ProductInfoProps) {
  const discountAmount = originalPrice ? originalPrice - price : 0;
  
  return (
    <div className="flex flex-col gap-4">
      {/* Brand & Badges */}
      <div className="flex items-center gap-3">
        {brand && <span className="text-sm font-medium text-muted-foreground">{brand}</span>}
        {isNew && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground tracking-wide">
            NEW
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>

      {/* Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? "fill-foreground text-foreground"
                  : "fill-muted text-muted-foreground"
              }`}
            />
          ))}
          <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors">
          {reviewCount} Verified Reviews
        </a>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">৳{price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-lg text-muted-foreground line-through">
              ৳{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {discountAmount > 0 && (
          <span className="text-sm font-medium text-green-600 dark:text-green-500">
            You save ৳{discountAmount.toFixed(2)} ({Math.round((discountAmount / originalPrice!) * 100)}%)
          </span>
        )}
      </div>
    </div>
  );
}
