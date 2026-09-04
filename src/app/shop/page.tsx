import { Metadata } from "next";
import { getProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/plp/ProductFilters";
import { ProductSort } from "@/components/products/plp/ProductSort";
import { Pagination } from "@/components/ui/Pagination";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Shop | NIVORA",
  description: "Browse our premium collection of products.",
};

interface PageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category, sort, page: pageStr } = await searchParams;
  
  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 8;

  const { products, total, totalPages } = await getProducts({
    category,
    sort,
    page,
    limit,
  });

  const categories = [
    { id: "c1", name: "Electronics", slug: "electronics", productCount: 4, imageUrl: "" },
    { id: "c2", name: "Fashion", slug: "fashion", productCount: 2, imageUrl: "" },
    { id: "c3", name: "Home & Living", slug: "home-living", productCount: 4, imageUrl: "" },
    { id: "c4", name: "Beauty", slug: "beauty", productCount: 1, imageUrl: "" },
    { id: "c5", name: "Accessories", slug: "accessories", productCount: 1, imageUrl: "" },
  ];

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    ...(category ? [{ label: categories.find(c => c.slug === category)?.name || category }] : []),
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-muted/30 border-b border-border">
        <Container className="pt-32 pb-12 md:pt-40 md:pb-16">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 tracking-tight">
            {category ? categories.find(c => c.slug === category)?.name || 'Shop' : 'All Products'}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            Explore our curated collection of premium essentials designed for modern living.
          </p>
        </Container>
      </div>

      <Container className="py-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <ProductFilters categories={categories} initialCategory={category} />

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8 hidden lg:flex">
            <span className="text-muted-foreground font-medium">
              Showing {products.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, total)} of {total} products
            </span>
            <ProductSort />
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-8">Try adjusting your filters or category selection.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
