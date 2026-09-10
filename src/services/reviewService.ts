import { useAuthStore } from '../store/useAuthStore';
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = (useAuthStore.getState().session as any)?.access_token;
  if (!token) throw new Error('You must be logged in to perform this action.');
  
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  message?: string;
  media: string[];
  adminReply?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email?: string;
  };
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
  };
}

export interface RatingDistributionItem {
  stars: number;
  count: number;
  percentage: number;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  total: number;
  totalPages: number;
  totalReviews: number;
  averageRating: number;
  distribution: RatingDistributionItem[];
}

export interface ReviewEligibilityResponse {
  canReview: boolean;
  hasPurchased: boolean;
  isAdmin: boolean;
  existingReview?: Review | null;
  message: string;
}

export async function getProductReviews(
  productId: string,
  page = 1,
  limit = 10,
  rating?: number
): Promise<ProductReviewsResponse> {
  const ratingQuery = rating ? `&rating=${rating}` : '';
  const response = await fetch(
    `${API_URL}/reviews/product/${productId}?page=${page}&limit=${limit}${ratingQuery}`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    // Fallback if network or server error
    return {
      reviews: [],
      total: 0,
      totalPages: 0,
      totalReviews: 0,
      averageRating: 0,
      distribution: [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ],
    };
  }
  return response.json();
}

export async function checkReviewEligibility(productId: string): Promise<ReviewEligibilityResponse> {
  const response = await fetchWithAuth(`/reviews/product/${productId}/eligibility`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to check review eligibility');
  }
  return response.json();
}

export async function createReview(data: {
  productId: string;
  rating: number;
  message?: string;
  media?: string[];
}): Promise<Review> {
  const response = await fetchWithAuth('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to submit review');
  }
  
  return response.json();
}

export async function deleteReview(reviewId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetchWithAuth(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete review');
  }

  return response.json();
}

export async function addAdminReply(reviewId: string, reply: string): Promise<Review> {
  const response = await fetchWithAuth(`/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to add admin reply');
  }
  
  return response.json();
}

export async function getAllAdminReviews(
  page = 1,
  limit = 20,
  rating?: number
): Promise<{
  reviews: any[];
  total: number;
  totalPages: number;
  totalOverall: number;
  averageOverall: number;
}> {
  const ratingQuery = rating ? `&rating=${rating}` : '';
  const response = await fetchWithAuth(`/reviews/admin/all?page=${page}&limit=${limit}${ratingQuery}`);
  if (!response.ok) throw new Error('Failed to fetch admin reviews');
  return response.json();
}
