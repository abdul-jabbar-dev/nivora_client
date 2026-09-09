"use server";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { ENV } from "@/lib/env";

const API_URL = ENV.NEXT_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get("admin_session");
  if (adminSession?.value === "true") {
    const adminSecret = process.env.ADMIN_SECRET || "admin_secret_12345";
    return {
      "x-admin-secret": adminSecret,
      "Authorization": `Bearer ${adminSecret}`,
    };
  }

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
    "Authorization": `Bearer ${session?.access_token || ""}`,
  };
}

export async function getProductRequests() {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/product-requests`, {
    headers: {
      ...headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product requests");
  }

  return response.json();
}

export async function getProductRequestById(id: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/product-requests/${id}`, {
    headers: { ...headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch product request");
  return response.json();
}

export async function updateProductRequestStatus(id: string, status: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/product-requests/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  revalidatePath("/admin/dashboard/requests");
  revalidatePath(`/admin/dashboard/requests/${id}`);
  return response.json();
}
