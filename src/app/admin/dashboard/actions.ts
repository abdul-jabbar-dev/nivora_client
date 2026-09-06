"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

export async function getProductWithAnalytics(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products/${id}/analytics`, {
    headers: { ...headers },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to fetch product analytics");
  }

  return response.json();
}

export async function createCategory(data: { name: string; slug: string; imageUrl?: string|null; parentId?: string|null }) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create category");
  }

  revalidatePath("/admin/dashboard/categories");
  return response.json();
}

export async function createProduct(data: any) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create product");
  }

  revalidatePath("/admin/dashboard/products");
  return response.json();
}

export async function updateProduct(id: string, data: any) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update product");
  }

  revalidatePath("/admin/dashboard/products");
  return response.json();
}

export async function deleteProduct(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      ...headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }

  revalidatePath("/admin/dashboard/products");
  return response.json();
}

export async function createBillboard(data: any) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/billboards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create billboard");
  }

  revalidatePath("/admin/dashboard/billboards");
  return response.json();
}

export async function deleteBillboard(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/billboards/${id}`, {
    method: "DELETE",
    headers: {
      ...headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete billboard");
  }

  revalidatePath("/admin/dashboard/billboards");
  return response.json();
}

export async function getBillboards() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/billboards/admin`, {
    headers: { ...headers },
    cache: "no-store",
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch billboards: ${response.status} ${response.statusText} - ${text}`);
  }
  
  return response.json();
}

export async function toggleBillboardActive(id: string, currentVal: boolean) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/billboards/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ isActive: !currentVal }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to toggle billboard");
  }
  
  revalidatePath("/admin/dashboard/billboards");
  return response.json();
}

export async function updateCategoryNav(id: string, showNav: boolean) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/products/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ showNav }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to update category");
  }
  
  revalidatePath("/admin/dashboard/categories");
  return response.json();
}

export async function getAllCustomers(page = 1, limit = 20) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/users/admin/all?page=${page}&limit=${limit}`, {
    headers: { ...headers },
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  
  return response.json();
}

export async function getCustomerById(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/users/admin/${id}`, {
    headers: { ...headers },
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch customer details");
  }
  
  return response.json();
}

export async function getDashboardStats() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/orders/admin/dashboard-stats`, {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  
  return response.json();
}
