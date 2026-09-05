"use server";

import { revalidatePath } from "next/cache";

const API_URL = "http://localhost:3005";
const ADMIN_SECRET = "admin_secret_12345";

export async function createCategory(data: { name: string; slug: string; imageUrl?: string|null; parentId?: string|null }) {
  const response = await fetch(`${API_URL}/products/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
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
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
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
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": ADMIN_SECRET,
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
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      "x-admin-secret": ADMIN_SECRET,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete product");
  }

  revalidatePath("/admin/dashboard/products");
  return response.json();
}
