import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGallery } from "@/components/products/pdp/ProductGallery";
import { ProductInfo } from "@/components/products/pdp/ProductInfo";
import { VariantSelector } from "@/components/products/pdp/VariantSelector";
import { PurchaseActions } from "@/components/products/pdp/PurchaseActions";
import { TrustFeatures } from "@/components/products/pdp/TrustFeatures";
import { ProductDetails } from "@/components/products/pdp/ProductDetails";
import { CustomerReviews } from "@/components/products/pdp/CustomerReviews";
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

  const relatedProducts = await getRelatedProducts(product.category, 4);

  const breadcrumbItems = [
    { label: product.category, href: `/categories/${product.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}` },
    { label: product.name },
  ];

  // Mock Reviews
  const mockReviews = [
    {
      id: "r1",
      authorName: "Sarah M.",
      rating: 5,
      content: "Absolutely love this! The quality is exceptional and it exceeded my expectations. Fast shipping too.",
      date: "2 days ago",
      verifiedPurchase: true,
    },
    {
      id: "r2",
      authorName: "James T.",
      rating: 4,
      content: "Great product overall. Exactly as described. I knocked off one star because the packaging could be slightly better.",
      date: "1 week ago",
      verifiedPurchase: true,
    },
  ];

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
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Gallery */}
          <div className="lg:sticky lg:top-24 self-start">
            <ProductGallery images={product.images || [product.imageUrl]} alt={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col">
            <ProductInfo
              title={product.name}
              brand={product.brand}
              price={product.price}
              originalPrice={product.originalPrice}
              rating={product.rating}
              reviewCount={product.reviewCount}
              isNew={product.isNew}
            />

            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <VariantSelector variants={product.variants} />
              </div>
            )}

            <PurchaseActions product={product} />
            <TrustFeatures />
            <ProductDetails
              description={product.description}
              features={product.features}
              specifications={product.specifications}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <CustomerReviews
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviews={mockReviews}
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
