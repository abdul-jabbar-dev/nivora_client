import { Product, Category } from "../types/product";

const API_URL = 'http://localhost:3005';

export async function getTrendingProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/trending`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error('Failed to fetch trending products');
  return response.json();
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/products/categories`, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch product');
  }
  return response.json();
}

export async function getRelatedProducts(categoryId: string, limit = 4): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/related/${categoryId}?limit=${limit}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error('Failed to fetch related products');
  return response.json();
}

export interface GetProductsParams {
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  filter?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

export async function getProducts(params: GetProductsParams): Promise<{ products: Product[], total: number, totalPages: number }> {
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.append('category', params.category);
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.filter) searchParams.append('filter', params.filter);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.q) searchParams.append('q', params.q);
  if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
  if (params.minRating !== undefined) searchParams.append('minRating', params.minRating.toString());

  const response = await fetch(`${API_URL}/products?${searchParams.toString()}`, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}
