'use client';

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquareReply, ChevronLeft, ChevronRight, PenSquare, X } from "lucide-react";
import type { Review, RatingDistributionItem } from "@/services/reviewService";
import { getProductReviews, checkReviewEligibility } from "@/services/reviewService";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { LeaveReviewModal } from "@/components/reviews/LeaveReviewModal";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";

interface CustomerReviewsProps {
  productId: string;
  productName: string;
  rating?: number;
  reviewCount?: number;
  initialReviews?: Review[];
  initialDistribution?: RatingDistributionItem[];
  initialTotalPages?: number;
}

export function CustomerReviews({
  productId,
  productName,
  rating = 0,
  reviewCount = 0,
  initialReviews = [],
  initialDistribution,
  initialTotalPages = 1,
}: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [averageRating, setAverageRating] = useState<number>(rating);
  const [totalReviews, setTotalReviews] = useState<number>(reviewCount);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Review eligibility states
  const { user } = useAuthStore();
  const [canReview, setCanReview] = useState<boolean>(false);
  const [hasExistingReview, setHasExistingReview] = useState<boolean>(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState<boolean>(true);

  const verifyEligibility = async () => {
    if (!user) {
      setCanReview(false);
      setHasExistingReview(false);
      setIsCheckingEligibility(false);
      return;
    }

    try {
      const res = await checkReviewEligibility(productId);
      setCanReview(Boolean(res.canReview));
      setHasExistingReview(Boolean(res.existingReview));
    } catch {
      setCanReview(false);
      setHasExistingReview(false);
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  useEffect(() => {
    verifyEligibility();
  }, [user, productId]);

  // Default distribution if none provided
  const defaultDistribution: RatingDistributionItem[] = [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const [distribution, setDistribution] = useState<RatingDistributionItem[]>(
    initialDistribution && initialDistribution.length > 0
      ? initialDistribution
      : defaultDistribution
  );

  const fetchReviews = async (page: number, ratingFilter: number | null) => {
    setIsLoading(true);
    try {
      const data = await getProductReviews(
        productId,
        page,
        10,
        ratingFilter || undefined
      );

      setReviews(data.reviews || []);
      setTotalPages(data.totalPages || 1);
      if (data.distribution && data.distribution.length > 0) {
        setDistribution(data.distribution);
      }
      if (data.totalReviews !== undefined) {
        setTotalReviews(data.totalReviews);
      }
      if (data.averageRating !== undefined) {
        setAverageRating(data.averageRating);
      }
    } catch (err) {
      console.error("Failed to load customer reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingFilter = (stars: number | null) => {
    setSelectedRating(stars);
    setCurrentPage(1);
    fetchReviews(1, stars);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchReviews(newPage, selectedRating);
  };

  const handleReviewSubmitted = () => {
    setIsModalOpen(false);
    // Refresh with fresh reviews and updated rating stats
    fetchReviews(1, null);
    setSelectedRating(null);
    setCurrentPage(1);
    verifyEligibility();
  };

  // Helper to find count for each star rating in distribution
  const getStarCount = (stars: number) => {
    const item = distribution.find((d) => d.stars === stars);
    return item ? item.count : 0;
  };

  return (
    <div id="reviews" className="py-12 border-t border-border mt-12 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Verified ratings and feedback from verified purchasers.
          </p>
        </div>
        {canReview && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full shadow-sm hover:shadow transition-all self-start sm:self-auto"
          >
            <PenSquare className="w-4 h-4 mr-2" />
            {hasExistingReview ? "Edit Your Review" : "Write a Review"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Col: Accurate Rating Breakdown */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-muted/30 p-6 rounded-2xl border border-border flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold tracking-tight">
                {totalReviews > 0 ? averageRating.toFixed(1) : "0.0"}
              </span>
              <span className="text-muted-foreground text-sm font-medium">
                out of 5.0
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size="md" />
              <span className="text-xs text-muted-foreground font-medium">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {totalReviews > 0
                ? `Based on ${totalReviews} verified ratings`
                : "No customer reviews yet. Be the first to share your experience!"}
            </p>
          </div>

          {/* Star Rating Distribution */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rating Breakdown
            </h3>
            {distribution.map((dist) => {
              const isSelected = selectedRating === dist.stars;
              return (
                <button
                  key={dist.stars}
                  onClick={() => handleRatingFilter(isSelected ? null : dist.stars)}
                  className={`flex items-center gap-3 text-sm py-1 px-2 rounded-lg transition-colors group text-left ${
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="w-4 font-semibold text-xs">{dist.stars}★</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? "bg-primary" : "bg-amber-400 group-hover:bg-amber-500"
                      }`}
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-xs text-muted-foreground font-mono">
                    {dist.count} ({dist.percentage}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Filters & Reviews List */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-border/60">
            <button
              onClick={() => handleRatingFilter(null)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                selectedRating === null
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              }`}
            >
              All ({totalReviews})
            </button>
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = getStarCount(stars);
              return (
                <button
                  key={stars}
                  onClick={() => handleRatingFilter(selectedRating === stars ? null : stars)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1 transition-all ${
                    selectedRating === stars
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-muted-foreground"
                  }`}
                >
                  <span>{stars}★</span>
                  <span className="opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Review List */}
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {reviews.map((review) => (
                <div key={review.id} className="py-6 first:pt-0 last:pb-0 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase">
                        {review.user?.firstName ? review.user.firstName.charAt(0) : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {review.user?.firstName || "Verified"} {review.user?.lastName || "Customer"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Purchase
                          </span>
                        </div>
                      </div>
                    </div>

                    <StarRating rating={review.rating} size="sm" />
                  </div>

                  {review.message && (
                    <p className="text-foreground/90 text-sm leading-relaxed mt-1 whitespace-pre-line">
                      {review.message}
                    </p>
                  )}

                  {/* Review Photos */}
                  {review.media && review.media.length > 0 && (
                    <div className="flex gap-2.5 mt-2 overflow-x-auto pb-1">
                      {review.media.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPreviewImage(img)}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <Image src={img} alt="Customer review photo" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Admin Reply */}
                  {review.adminReply && (
                    <div className="mt-3 bg-muted/40 p-4 rounded-xl border border-border/60">
                      <div className="flex items-center gap-2 mb-1.5 text-primary font-semibold text-xs">
                        <MessageSquareReply className="w-3.5 h-3.5" />
                        Reply from NIVORA Support
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                        {review.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-12 text-center bg-muted/20 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-3">
              <Star className="w-8 h-8 text-muted-foreground/40 stroke-1" />
              <p className="text-sm">
                {selectedRating
                  ? `No ${selectedRating}-star reviews found.`
                  : "No reviews yet. Be the first to review this product!"}
              </p>
              {canReview && (
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                  {hasExistingReview ? "Edit Your Review" : "Write the First Review"}
                </Button>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <LeaveReviewModal
          productId={productId}
          productName={productName}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleReviewSubmitted}
        />
      )}

      {/* Photo Fullscreen Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full z-10 transition-colors"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full max-h-[80vh]">
              <Image
                src={previewImage}
                alt="Enlarged review photo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
