import { useAuthStore } from '../store/useAuthStore';

const API_URL = 'http://localhost:3005';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = (useAuthStore.getState().session as any)?.access_token;
  if (!token) throw new Error('No token');
  
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
  };
}

export async function getProductReviews(productId: string, page = 1, limit = 5): Promise<{ reviews: Review[], total: number, totalPages: number }> {
  const response = await fetch(`${API_URL}/reviews/product/${productId}?page=${page}&limit=${limit}`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

export async function createReview(data: { productId: string; rating: number; message?: string; media?: string[] }): Promise<Review> {
  const response = await fetchWithAuth('/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create review');
  }
  
  return response.json();
}

export async function addAdminReply(reviewId: string, reply: string): Promise<Review> {
  const response = await fetchWithAuth(`/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to add admin reply');
  }
  
  return response.json();
}

export async function getAllAdminReviews(page = 1, limit = 20): Promise<{ reviews: any[], total: number, totalPages: number }> {
  const response = await fetchWithAuth(`/reviews/admin/all?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch admin reviews');
  return response.json();
}
