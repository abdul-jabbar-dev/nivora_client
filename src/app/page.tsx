import { Hero } from "@/components/hero/Hero";
import { ShopByCategory } from "@/components/categories/ShopByCategory";
import { TrendingProducts } from "@/components/products/TrendingProducts";
import { EditorialShowcase } from "@/components/marketing/EditorialShowcase";
// import { DealsBanner } from "@/components/marketing/DealsBanner";
import { NewArrivals } from "@/components/products/NewArrivals";
import { SpecialOffers } from "@/components/products/SpecialOffers";
import { UpcomingProducts } from "@/components/products/UpcomingProducts";

import { Newsletter } from "@/components/marketing/Newsletter";
import { RequestProductBanner } from "@/components/marketing/RequestProductBanner";
import { getSiteUrl } from "@/lib/siteUrl";

export default function Home() {
  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "NIVORA",
        description: "Better Things, Better Everyday. Online Shopping in Bangladesh.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "NIVORA",
        legalName: "NIVORA",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description:
          "Multi-product online store in Bangladesh offering electronics, gadgets, accessories, and unique everyday essentials.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BD",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@nivora.com",
          areaServed: "BD",
          availableLanguage: ["English", "Bengali"],
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <NewArrivals />
      <UpcomingProducts />

      {/* Value Proposition Strip */}
      <section className="border-y border-border bg-muted/30 py-8">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm font-medium">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🚚</span>
              Free & Fast Delivery
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🔒</span>
              Secure Checkout
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">✅</span>
              Checked & Verified
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">💬</span>
              Dedicated Support
            </div>
          </div>
        </div>
      </section>

      <ShopByCategory />
      <TrendingProducts />
      <SpecialOffers />
      <EditorialShowcase />
      {/* <DealsBanner /> */}
      <RequestProductBanner />

      <Newsletter />
    </div>
  );
}
