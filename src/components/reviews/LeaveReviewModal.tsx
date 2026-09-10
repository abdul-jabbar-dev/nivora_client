'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, Upload, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { createReview, checkReviewEligibility } from '../../services/reviewService';
import { ENV } from "@/lib/env";
import Image from 'next/image';

interface LeaveReviewModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveReviewModal({
  productId,
  productName,
  onClose,
  onSuccess,
}: LeaveReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true);
  const [canReview, setCanReview] = useState<boolean | null>(null);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check eligibility & load existing review if available
  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      try {
        const res = await checkReviewEligibility(productId);
        if (!mounted) return;
        setCanReview(res.canReview);
        if (!res.canReview) {
          setEligibilityMessage(res.message);
        } else if (res.existingReview) {
          // Pre-populate if user is editing their previous review
          setRating(res.existingReview.rating);
          setMessage(res.existingReview.message || '');
          setMedia(res.existingReview.media || []);
        }
      } catch (err: any) {
        if (!mounted) return;
        // User may not be logged in or other error
        setCanReview(false);
        setEligibilityMessage(err.message || 'Please log in to leave a review.');
      } finally {
        if (mounted) setIsCheckingEligibility(false);
      }
    };

    verify();
    return () => {
      mounted = false;
    };
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Limit to 5 images max
    const combinedFiles = [...selectedFiles, ...files].slice(0, 5);
    setSelectedFiles(combinedFiles);

    // Create preview URLs
    const newPreviews = combinedFiles.map((file) => URL.createObjectURL(file));
    setLocalPreviews(newPreviews);
  };

  const removeLocalFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setLocalPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('files', file));
    formData.append('folder', 'reviews');

    const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload review images');
    }

    const data = await res.json();
    return data.urls || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Upload any newly selected images
      const uploadedUrls = await uploadImages();
      const allMedia = [...media, ...uploadedUrls];

      // 2. Submit review to backend
      await createReview({
        productId,
        rating,
        message: message.trim() || undefined,
        media: allMedia,
      });

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-background rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-border animate-in zoom-in-95 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
          aria-label="Close review modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-1">Write a Review</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Share your authentic experience with <span className="font-medium text-foreground">{productName}</span>
        </p>

        {isCheckingEligibility ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Checking purchase status...</p>
          </div>
        ) : canReview === false ? (
          <div className="py-8 text-center space-y-4">
            <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-4 rounded-xl text-sm border border-amber-500/20">
              {eligibilityMessage || 'Only verified buyers who have received this product can leave a review.'}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm mb-4 border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Selection */}
              <div className="flex flex-col items-center justify-center space-y-2 py-2">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-115 active:scale-95 focus:outline-none p-1"
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'fill-muted text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {rating === 0
                    ? 'Tap a star to rate'
                    : rating === 1
                    ? '1 Star - Poor'
                    : rating === 2
                    ? '2 Stars - Fair'
                    : rating === 3
                    ? '3 Stars - Good'
                    : rating === 4
                    ? '4 Stars - Very Good'
                    : '5 Stars - Excellent'}
                </span>
              </div>

              {/* Review Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Review</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did you like or dislike? How was the quality and delivery?"
                  className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[110px] resize-y"
                  required
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Add Photos (Optional)</span>
                  <span className="text-xs text-muted-foreground">Up to 5 images</span>
                </label>

                {/* Previews of existing and newly selected photos */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {media.map((url, i) => (
                    <div key={`existing-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                      <Image src={url} alt="Review attachment" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingMedia(i)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {localPreviews.map((url, i) => (
                    <div key={`local-${i}`} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                      <Image src={url} alt="Upload preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeLocalFile(i)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {media.length + selectedFiles.length < 5 && (
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm font-medium">Upload photo from device</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting || rating === 0}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
