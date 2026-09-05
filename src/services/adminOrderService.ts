
const API_URL = 'http://localhost:3005';
const ADMIN_SECRET = 'admin_secret_12345'; // Matching the backend AdminKeyGuard

const fetchWithAdminKey = async (url: string, options: RequestInit = {}) => {
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'x-admin-secret': ADMIN_SECRET,
      'Content-Type': 'application/json'
    }
  });
};

export async function getAllAdminOrders(page = 1, limit = 20) {
  const response = await fetchWithAdminKey(`/orders/admin/all?page=${page}&limit=${limit}`);
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
