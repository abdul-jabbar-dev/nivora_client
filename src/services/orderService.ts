import { useAuthStore } from '@/store/useAuthStore';
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = (useAuthStore.getState().session as any)?.access_token;
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'An error occurred during the request');
  }

  return response.json();
};

export const orderService = {
  getUserOrders: async (page = 1, limit = 10, status?: string, search?: string) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search })
    }).toString();
    
    return fetchWithAuth(`/orders?${queryParams}`);
  },
  
  getOrderDetails: async (orderId: string) => {
    return fetchWithAuth(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId: string) => {
    return fetchWithAuth(`/orders/${orderId}/cancel`, {
      method: 'POST'
    });
  }
};
