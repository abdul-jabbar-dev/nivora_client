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

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
  }>;
}

function getCategorySeo(slug: string, name: string) {
  const lower = slug.toLowerCase();
  if (lower === "electronics") {
    return {
      title: "Electronics Online in Bangladesh | NIVORA",
      description:
        "Shop electronics online in Bangladesh at NIVORA. Discover useful and affordable electronics with fast nationwide delivery and trusted service.",
    };
  }
  if (lower === "gadgets") {
    return {
      title: "Gadgets Online in Bangladesh | NIVORA",
      description:
        "Discover unique and useful gadgets online in Bangladesh at NIVORA. Shop affordable gadgets with fast nationwide delivery and trusted service.",
    };
  }
  if (lower === "accessories") {
    return {
      title: "Accessories Online in Bangladesh | NIVORA",
      description:
        "Shop accessories online in Bangladesh at NIVORA. Find useful, affordable and unique accessories with fast nationwide delivery.",
    };
  }
  return {
    title: `${name} Online in Bangladesh | NIVORA`,
    description: `Shop ${name} online in Bangladesh at NIVORA. Discover affordable products with fast nationwide delivery and trusted service.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (err) {
    console.error("Failed to fetch categories for metadata", err);
  }

  const category = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  const categoryName = category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1);
  const seo = getCategorySeo(slug, categoryName);
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/category/${slug}`;
  const images = category?.imageUrl ? [{ url: category.imageUrl, alt: categoryName }] : [];

  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: [
      `${categoryName.toLowerCase()} online Bangladesh`,
      `buy ${categoryName.toLowerCase()} Bangladesh`,
      `${categoryName.toLowerCase()} shop BD`,
      "online shopping in Bangladesh",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: seo.title,
      description: seo.description,
      siteName: "NIVORA",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: category?.imageUrl ? [category.imageUrl] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort, page: pageStr, q, minPrice, maxPrice, minRating } = await searchParams;

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const limit = 8;

  const [{ products, total, totalPages }, categories] = await Promise.all([
    getProducts({
      category: slug,
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

  const currentCategory = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  const categoryTitle = currentCategory ? currentCategory.name : slug.charAt(0).toUpperCase() + slug.slice(1);
  const seo = getCategorySeo(slug, categoryTitle);
  const siteUrl = getSiteUrl();

  const breadcrumbItems = [
    { label: "Shop", href: "/shop" },
    { label: categoryTitle },
  ];

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/category/${slug}#collection`,
        url: `${siteUrl}/category/${slug}`,
        name: seo.title,
        description: seo.description,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/category/${slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shop",
            item: `${siteUrl}/shop`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryTitle,
            item: `${siteUrl}/category/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <div className="bg-muted/30 border-b border-border">
        <Container className="pt-32 pb-12 md:pt-40 md:pb-16">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-4xl md:text-5xl font-bold mt-6 tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg">
            {seo.description}
          </p>
        </Container>
      </div>

      <Container className="py-12 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <ProductFilters
          categories={categories}
          initialCategory={slug}
          initialQ={q}
          initialMinPrice={minPrice}
          initialMaxPrice={maxPrice}
          initialMinRating={minRating}
        />

        {/* Product Grid Area */}
        <div className="flex-1 flex flex-col">
          {/* Active Search Filter Indicator */}
          {q && (
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <span>Search: &ldquo;{q}&rdquo; in {categoryTitle}</span>
                <Link
                  href={`/category/${slug}`}
                  className="hover:opacity-75"
                  title="Remove search query"
                >
                  <X className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Link
                href={`/category/${slug}`}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Clear search
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
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
                  ? `We couldn't find any products in ${categoryTitle} matching "${q}". Try checking for typos or searching all categories.`
                  : `There are currently no products in ${categoryTitle}. Try adjusting your filters or browsing all products.`}
              </p>
              {q ? (
                <div className="flex gap-3">
                  <Link href={`/category/${slug}`}>
                    <Button variant="outline" size="sm">
                      Clear Search in {categoryTitle}
                    </Button>
                  </Link>
                  <Link href={`/shop?q=${encodeURIComponent(q)}`}>
                    <Button size="sm">
                      Search in All Categories
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/shop">
                  <Button variant="outline" size="sm">
                    Browse All Products
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
