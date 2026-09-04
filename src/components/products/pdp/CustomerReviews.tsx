import { Star, CheckCircle2 } from "lucide-react";
import { Review } from "@/types/product";

interface CustomerReviewsProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export function CustomerReviews({ rating, reviewCount, reviews }: CustomerReviewsProps) {
  // Mock rating distribution based on overall rating
  const distribution = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ];

  return (
    <div id="reviews" className="py-12 border-t border-border mt-12 scroll-mt-24">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Col: Summary */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-bold">{rating.toFixed(1)}</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "fill-foreground text-foreground"
                      : "fill-muted text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">{reviewCount} Reviews</span>
          </div>

          <div className="flex flex-col gap-3">
            {distribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-3 text-sm">
                <span className="w-4 font-medium">{dist.stars}</span>
                <Star className="w-4 h-4 text-foreground fill-foreground" />
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground rounded-full"
                    style={{ width: `${dist.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{dist.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Review List */}
        <div className="md:col-span-8 flex flex-col gap-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex flex-col gap-3 border-b border-border pb-8 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground uppercase">
                      {review.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{review.authorName}</div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="text-muted-foreground">{review.date}</span>
                        {review.verifiedPurchase && (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-500 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "fill-foreground text-foreground"
                            : "fill-muted text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mt-2 leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground py-8 text-center bg-muted/50 rounded-xl">
              No reviews yet. Be the first to review this product!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
