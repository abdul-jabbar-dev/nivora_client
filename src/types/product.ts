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
  stock: number;
  features?: string[];
  specifications?: Record<string, string>;
  brand?: string;
  shipping?: {
    estimatedDays: string;
    cost: number;
  };
  offerPrice?: number | null;
  discountExpiryDate?: string | null;
  status?: string;
  expectedArrivalDate?: string | null;
  likesCount?: number;
  dislikesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariantOption {
  name: string;
  image?: string | null;
}

export interface ProductVariant {
  type: string;
  options: ProductVariantOption[];
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
  imageUrl?: string | null;
  productCount?: number;
  parentId?: string | null;
  showNav?: boolean;
}
