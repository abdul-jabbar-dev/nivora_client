"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    ENV.SUPABASE_URL,
    ENV.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();
  return {
    "Authorization": `Bearer ${session?.access_token}`,
  };
}

const fetchWithAdminKey = async (url: string, options: RequestInit = {}) => {
  const headers = await getAuthHeaders();
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
      'Content-Type': 'application/json'
    }
  });
};

export async function getAllAdminOrders(page = 1, limit = 20, status?: string) {
  let url = `/orders/admin/all?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }
  const response = await fetchWithAdminKey(url);
  if (!response.ok) throw new Error('Failed to fetch admin orders');
  return response.json();
}

export async function getAdminOrderById(orderId: string) {
  const response = await fetchWithAdminKey(`/orders/admin/${orderId}`);
  if (!response.ok) throw new Error('Failed to fetch admin order details');
  return response.json();
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  const response = await fetchWithAdminKey(`/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return response.json();
}
