"use client";

import { useEffect, useState } from "react";
import { getAllAdminReviews, addAdminReply } from "@/services/reviewService";
import { Star, Reply, CheckCircle2, MessageSquareReply, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAdminReviews(1, 50);
      setReviews(data.reviews);
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
      fetchReviews();
    } catch (err) {
      alert("Failed to submit reply");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading reviews...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Review Management</h1>
        <p className="text-muted-foreground">Monitor and respond to customer reviews.</p>
      </div>

      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <div className="bg-background rounded-xl border border-border p-8 text-center text-muted-foreground">
            No reviews found.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg border border-border overflow-hidden relative shrink-0">
                      <Image 
                        src={review.product.imageUrl} 
                        alt={review.product.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{review.product.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{review.user.firstName} {review.user.lastName}</span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-muted px-3 py-1.5 rounded-full">
                    <span className="font-bold mr-1">{review.rating}</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>

                {review.message && (
                  <p className="text-foreground/90 leading-relaxed mb-4">
                    "{review.message}"
                  </p>
                )}

                {review.media && review.media.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review.media.map((img: string, i: number) => (
                      <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                        <Image src={img} alt="Review Media" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {review.adminReply ? (
                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 mt-4">
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                      <MessageSquareReply className="w-4 h-4" />
                      Your Reply
                    </div>
                    <p className="text-sm">{review.adminReply}</p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-border">
                    {replyingTo === review.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply to the customer..."
                          className="w-full h-24 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => handleReplySubmit(review.id)}>Submit Reply</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => setReplyingTo(review.id)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply to Review
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
