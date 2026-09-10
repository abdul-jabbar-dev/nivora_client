import { Metadata } from "next";
import { getProducts, getCategories } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/plp/ProductFilters";
import { ProductSort } from "@/components/products/plp/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types/product";
import { Search, X } from "lucide-react";
import Link from "next/link";

import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category } = await searchParams;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/shop`;

  if (category) {
    let categories: Category[] = [];
    try {
      categories = await getCategories();
    } catch {}
    const current = categories.find((c) => c.slug.toLowerCase() === category.toLowerCase());
    const title = current ? current.name : category.charAt(0).toUpperCase() + category.slice(1);
    const seoTitle = `${title} Online in Bangladesh | NIVORA`;
    const seoDescription = `Shop ${title} online in Bangladesh at NIVORA. Discover affordable products with fast nationwide delivery.`;

    return {
      title: { absolute: seoTitle },
      description: seoDescription,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        type: "website",
        url: canonicalUrl,
        title: seoTitle,
        description: seoDescription,
        siteName: "NIVORA",
      },
      twitter: {
        card: "summary_large_image",
        title: seoTitle,
        description: seoDescription,
      },
    };
  }

  const seoTitle = "Shop Online in Bangladesh | Electronics, Gadgets & More | NIVORA";
  const seoDescription =
    "Browse and shop electronics, gadgets, accessories and everyday essentials online in Bangladesh at NIVORA with fast nationwide delivery.";

  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: "NIVORA",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
  };
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category, sort, page: pageStr, q, minPrice, maxPrice, minRating } = await searchParams;
  
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 8;

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      category,
      sort,
      page,
      limit,
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
    }).catch(() => ({ products: [], total: 0, totalPages: 1 })),
    getCategories().catch(() => []),
  ]);

  const currentCategory = category
    ? categories.find((c) => c.slug.toLowerCase() === category.toLowerCase())
    : null;
  const categoryTitle = q
    ? currentCategory
      ? `"${q}" in ${currentCategory.name}`
      : `Search Results for "${q}"`
    : currentCategory
    ? currentCategory.name
    : category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "All Products";

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    ...(category ? [{ label: currentCategory ? currentCategory.name : category, href: `/shop?category=${category}` }] : []),
    ...(q ? [{ label: `Search: "${q}"` }] : []),
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-muted/30 border-b border-border">
        <Container className="pt-32 pb-12 md:pt-40 md:pb-16">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            {q
              ? `Found ${total} ${total === 1 ? "product" : "products"} matching your search.`
              : category
              ? `Explore our curated collection of ${categoryTitle.toLowerCase()} essentials designed for modern living.`
              : "Explore our curated collection of premium essentials designed for modern living."}
          </p>
        </Container>
      </div>

      <Container className="py-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <ProductFilters 
          categories={categories} 
          initialCategory={category} 
          initialQ={q}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          initialMinRating={minRating}
        />

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col">
          {/* Active Search / Filter Indicator */}
          {q && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <span>Search: &ldquo;{q}&rdquo;</span>
                <Link
                  href={category ? `/shop?category=${category}` : "/shop"}
                  className="hover:opacity-75"
                  title="Remove search query"
                >
                  <X className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Link
                href="/shop"
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Reset all filters
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between mb-8 hidden lg:flex">
            <span className="text-muted-foreground font-medium">
              Showing {products.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, total)} of {total} products
            </span>
            <ProductSort />
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-border p-8">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md text-sm">
                {q
                  ? `We couldn't find any products matching "${q}". Try checking for typos or searching for more general terms.`
                  : "Try adjusting your filters or category selection."}
              </p>
              {q && (
                <Link href="/shop">
                  <Button variant="outline" size="sm">
                    Clear Search & View All Products
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
