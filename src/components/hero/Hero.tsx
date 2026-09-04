import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getProductBySlug } from "@/services/productService";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";

export async function Hero() {
  const featuredProduct = await getProductBySlug("premium-wireless-headphones");

  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-muted text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-6">
              Curated for Everyday
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]">
              Better Things, <br />
              <span className="text-muted-foreground">Better Everyday.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              Discover thoughtfully selected products designed to make everyday life better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-base">
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop?category=electronics" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-base">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            {/* Background decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/5 to-transparent blur-3xl rounded-full -z-10" />

            <div className="relative max-w-sm mx-auto shadow-2xl rounded-2xl">
              {featuredProduct && (
                <div className="relative group">
                  <div className="absolute -top-4 -right-4 z-20">
                    <span className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-600/20">
                      Featured Offer
                    </span>
                  </div>
                  <ProductCard product={featuredProduct} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
