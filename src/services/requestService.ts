import { ENV } from "@/lib/env";
const API_URL = ENV.NEXT_PUBLIC_API_URL;

export const requestService = {
  getUserRequests: async () => {
    // We need to fetch with credentials to pass the JWT cookie
    const response = await fetch(`${API_URL}/product-requests/my-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important to send cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product requests');
    }

    return response.json();
  },
};
