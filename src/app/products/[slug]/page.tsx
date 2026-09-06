import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductInteractiveArea } from "@/components/products/pdp/ProductInteractiveArea";
import { CustomerReviews } from "@/components/products/pdp/CustomerReviews";
import { getProductReviews } from "@/services/reviewService";
import { MobilePurchaseBar } from "@/components/products/pdp/MobilePurchaseBar";
import { ProductCard } from "@/components/products/ProductCard";

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
    };
  }

  return {
    title: `${product.name} | NIVORA`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const categoryId = typeof product.category === 'object' ? (product.category as any)?.id : (product as any).categoryId || product.category;
  const relatedProducts = await getRelatedProducts(categoryId, 4);

  const categoryName = typeof product.category === 'object' ? (product.category as any)?.name || 'Category' : product.category || 'Category';

  const breadcrumbItems = [
    { label: categoryName, href: `/categories/${String(categoryName).toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}` },
    { label: product.name },
  ];

  // Fetch real reviews
  let reviewsData = { reviews: [], total: 0, totalPages: 0 };
  try {
    reviewsData = await getProductReviews(product.id, 1, 5);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
  }

  // Generate structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.imageUrl,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand || "NIVORA",
    },
    offers: {
      "@type": "Offer",
      url: `https://example.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.offerPrice ?? product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="bg-background pb-20 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="pt-24 lg:pt-32">
        <Breadcrumb items={breadcrumbItems} />
        
        <ProductInteractiveArea product={product} />

        {/* Reviews Section */}
        <CustomerReviews
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={reviewsData.reviews}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="py-16 border-t border-border">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
