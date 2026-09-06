"use server";

import { revalidatePath } from "next/cache";

const API_URL = "http://localhost:3005";
const ADMIN_SECRET = "admin_secret_12345";

export async function getProductRequests() {
  const response = await fetch(`${API_URL}/product-requests`, {
    headers: {
      "x-admin-secret": ADMIN_SECRET,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product requests");
  }

  return response.json();
}
