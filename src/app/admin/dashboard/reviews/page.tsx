"use client";

import { useEffect, useState } from "react";
import { getAllAdminReviews, addAdminReply, deleteReview } from "@/services/reviewService";
import { Star, Reply, CheckCircle2, MessageSquareReply, ExternalLink, Trash2, Loader2, StarHalf } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageOverall, setAverageOverall] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews(selectedRating);
  }, [selectedRating]);

  const fetchReviews = async (ratingFilter: number | null = null) => {
    try {
      setIsLoading(true);
      const data = await getAllAdminReviews(1, 50, ratingFilter || undefined);
      setReviews(data.reviews || []);
      setTotalReviews(data.totalOverall ?? data.total ?? 0);
      setAverageOverall(data.averageOverall ?? 0);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    try {
      await addAdminReply(reviewId, replyText);
      setReplyingTo(null);
      setReplyText("");
      fetchReviews(selectedRating);
    } catch (err: any) {
      alert(err.message || "Failed to submit reply");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review? Product rating will be automatically recalculated.")) {
      return;
    }

    try {
      setDeletingId(reviewId);
      await deleteReview(reviewId);
      fetchReviews(selectedRating);
    } catch (err: any) {
      alert(err.message || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Review Management</h1>
          <p className="text-muted-foreground">Monitor, verify, reply to, and moderate customer reviews.</p>
        </div>

        {/* Top Summary Stat Cards */}
        <div className="flex items-center gap-4">
          <div className="bg-background border border-border px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Total Reviews</div>
              <div className="text-xl font-bold">{totalReviews}</div>
            </div>
          </div>
          <div className="bg-background border border-border px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div>
              <div className="text-xs text-muted-foreground font-medium">Average Rating</div>
              <div className="text-xl font-bold flex items-center gap-1">
                <span>{averageOverall > 0 ? averageOverall.toFixed(1) : "0.0"}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setSelectedRating(null)}
          className={`text-xs px-3.5 py-2 rounded-full font-medium transition-all ${
            selectedRating === null
              ? "bg-foreground text-background"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
          }`}
        >
          All Reviews
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedRating(selectedRating === star ? null : star)}
            className={`text-xs px-3.5 py-2 rounded-full font-medium flex items-center gap-1 transition-all ${
              selectedRating === star
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <span>{star} Stars</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          Loading reviews...
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.length === 0 ? (
            <div className="bg-background rounded-xl border border-border p-12 text-center text-muted-foreground">
              No reviews found matching the selected criteria.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-background rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg border border-border overflow-hidden relative shrink-0 bg-muted">
                        {review.product?.imageUrl && (
                          <Image 
                            src={review.product.imageUrl} 
                            alt={review.product.name} 
                            fill 
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base">{review.product?.name}</h3>
                          <Link 
                            href={`/products/${review.product?.slug || review.product?.id}`}
                            target="_blank"
                            className="text-muted-foreground hover:text-foreground"
                            title="View product"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="font-medium text-foreground">
                            {review.user?.firstName} {review.user?.lastName}
                          </span>
                          {review.user?.email && <span>({review.user.email})</span>}
                          <span>•</span>
                          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                        <StarRating rating={review.rating} size="sm" showNumber />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        title="Delete review"
                      >
                        {deletingId === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {review.message && (
                    <p className="text-foreground/90 text-sm leading-relaxed mb-4 bg-muted/20 p-3 rounded-lg border border-border/40">
                      "{review.message}"
                    </p>
                  )}

                  {review.media && review.media.length > 0 && (
                    <div className="flex gap-2.5 mb-4 overflow-x-auto pb-1">
                      {review.media.map((img: string, i: number) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                          <Image src={img} alt="Customer Review Photo" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {review.adminReply ? (
                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 mt-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                          <MessageSquareReply className="w-3.5 h-3.5" />
                          Reply from NIVORA Support
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setReplyingTo(review.id);
                            setReplyText(review.adminReply);
                          }}
                        >
                          Edit Reply
                        </Button>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{review.adminReply}</p>
                    </div>
                  ) : null}

                  {replyingTo === review.id && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your official response to the customer..."
                        className="w-full h-24 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => { setReplyingTo(null); setReplyText(""); }}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleReplySubmit(review.id)}>
                          Save Reply
                        </Button>
                      </div>
                    </div>
                  )}

                  {!review.adminReply && replyingTo !== review.id && (
                    <div className="mt-4 pt-3 border-t border-border flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => { setReplyingTo(review.id); setReplyText(""); }}>
                        <Reply className="w-3.5 h-3.5 mr-1.5" />
                        Reply to Review
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
