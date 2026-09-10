import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductInteractiveArea } from "@/components/products/pdp/ProductInteractiveArea";
import { CustomerReviews } from "@/components/products/pdp/CustomerReviews";
import { getProductReviews, type ProductReviewsResponse } from "@/services/reviewService";
import { MobilePurchaseBar } from "@/components/products/pdp/MobilePurchaseBar";
import { ProductCard } from "@/components/products/ProductCard";

import { getSiteUrl } from "@/lib/siteUrl";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/products/${product.slug}`;
  const seoTitle = `${product.name} | Buy Online in Bangladesh | NIVORA`;
  const seoDescription = `Buy ${product.name} online in Bangladesh from NIVORA. Check price, features and availability with fast nationwide delivery and trusted service.`;
  const keywords = [
    `${product.name} Bangladesh`,
    `buy ${product.name} Bangladesh`,
    `${product.name} price in Bangladesh`,
    `${product.name} online`,
  ];
  const images = product.imageUrl
    ? [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ]
    : [];

  return {
    title: { absolute: seoTitle },
    description: seoDescription,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: seoTitle,
      description: seoDescription,
      siteName: "NIVORA",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const categoryId = typeof product.category === 'object' ? (product.category as any)?.id : (product as any).categoryId || product.category;
  const relatedProducts = await getRelatedProducts(categoryId, 4);

  const categoryName = typeof product.category === 'object' ? (product.category as any)?.name || 'Category' : product.category || 'Category';
  const categorySlug = typeof product.category === 'object' ? (product.category as any)?.slug : null;

  const breadcrumbItems = [
    { label: categoryName, href: categorySlug ? `/category/${categorySlug}` : `/shop` },
    { label: product.name },
  ];

  // Fetch real reviews
  let reviewsData: ProductReviewsResponse = {
    reviews: [],
    total: 0,
    totalPages: 0,
    totalReviews: 0,
    averageRating: 0,
    distribution: [],
  };
  try {
    reviewsData = await getProductReviews(product.id, 1, 10);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }

  // Generate structured data strictly from actual database info
  const productJsonLd: any = {
    "@type": "Product",
    "@id": `${siteUrl}/products/${product.slug}#product`,
    name: product.name,
    image: product.imageUrl ? [product.imageUrl] : [],
    description: product.description || `Buy ${product.name} online in Bangladesh from NIVORA.`,
    brand: {
      "@type": "Brand",
      name: product.brand || "NIVORA",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "BDT",
      price: product.offerPrice ?? product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  if ((product as any).sku) {
    productJsonLd.sku = (product as any).sku;
  }

  // Only include aggregateRating if real rating/review data exists in database
  if (product.reviewCount && product.reviewCount > 0 && product.rating && product.rating > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  // Include actual verified reviews if present
  if (reviewsData.reviews && reviewsData.reviews.length > 0) {
    productJsonLd.review = reviewsData.reviews.map((r: any) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
      },
      author: {
        "@type": "Person",
        name: r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ""}`.trim() : "Verified Customer",
      },
      reviewBody: r.message || "",
      datePublished: r.createdAt,
    }));
  }

  // Breadcrumb Schema
  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl}/products/${product.slug}#breadcrumb`,
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
        name: categoryName,
        item: categorySlug ? `${siteUrl}/category/${categorySlug}` : `${siteUrl}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  };

  const jsonLdGraph = {
    "@context": "https://schema.org",
    "@graph": [productJsonLd, breadcrumbJsonLd],
  };

  return (
    <div className="bg-background pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <Container className="pt-24 lg:pt-32">
        <Breadcrumb items={breadcrumbItems} />

        <ProductInteractiveArea product={product} />

        {/* Reviews Section */}
        <CustomerReviews
          productId={product.id}
          productName={product.name}
          rating={reviewsData.averageRating ?? product.rating}
          reviewCount={reviewsData.totalReviews ?? product.reviewCount}
          initialReviews={reviewsData.reviews}
          initialDistribution={reviewsData.distribution}
          initialTotalPages={reviewsData.totalPages}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="py-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </Container>

      <MobilePurchaseBar product={product} />
    </div>
  );
}
