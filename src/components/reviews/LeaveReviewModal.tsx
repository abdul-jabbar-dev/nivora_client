'use client';

import { useState } from 'react';
import { X, Star, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { createReview } from '../../services/reviewService';
import Image from 'next/image';

interface LeaveReviewModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function LeaveReviewModal({ productId, productName, onClose, onSuccess }: LeaveReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Note: For a full implementation, you would use your existing upload service here.
  // We'll leave the media array empty or allow simple URLs for now.
  const [media, setMedia] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create review
      await createReview({
        productId,
        rating,
        message: message.trim() || undefined,
        media
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-background rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-1">Leave a Review</h2>
        <p className="text-muted-foreground mb-6 text-sm">Share your thoughts on {productName}</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-muted text-muted'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {rating === 0 ? 'Tap a star to rate' : 
               rating === 1 ? 'Poor' : 
               rating === 2 ? 'Fair' : 
               rating === 3 ? 'Good' : 
               rating === 4 ? 'Very Good' : 'Excellent'}
            </span>
          </div>

          {/* Review Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tell us more about your experience</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What did you like or dislike? What should other buyers know?"
              className="flex w-full rounded-xl border border-border bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[120px] resize-y"
            />
          </div>

          {/* Media Upload Placeholder */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add Photos (Optional)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                </div>
                {/* Note: Input would go here, omitting for simplicity in this demo */}
                <input type="file" className="hidden" accept="image/*" disabled />
              </label>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting</>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
