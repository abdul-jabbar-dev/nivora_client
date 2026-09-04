export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  slug: string;
  images: string[];
  variants?: ProductVariant[];
  inventory: number;
  features?: string[];
  specifications?: Record<string, string>;
  brand?: string;
  shipping?: {
    estimatedDays: string;
    cost: number;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  type: 'color' | 'size' | 'storage';
  value: string;
  priceOffset?: number;
  inventory: number;
}

export interface Review {
  id: string;
  authorName: string;
  avatarUrl?: string;
  rating: number;
  content: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}
