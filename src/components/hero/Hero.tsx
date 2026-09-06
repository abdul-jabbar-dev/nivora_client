import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { HeroCarousel } from "./HeroCarousel";
import { ENV } from "@/lib/env";

export async function Hero() {
  let billboards = [];
  try {
    const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/billboards`, { next: { revalidate: 60 } });
    if (res.ok) {
      billboards = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch billboards for hero", err);
  }

  return (
    <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden">
      <Container>
        <div className={billboards.length > 0 ? "grid grid-cols-1 xl:grid-cols-12 gap-12 items-center" : "flex flex-col items-center justify-center text-center"}>
          <div className={`flex flex-col z-10 ${billboards.length > 0 ? "items-start xl:col-span-5" : "items-center max-w-2xl mx-auto"}`}>
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
            <div className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto ${billboards.length === 0 ? "justify-center" : ""}`}>
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
          {billboards.length > 0 && (
            <div className="relative mt-12 w-full xl:mt-0 xl:col-span-7 xl:block">
              {/* Background decorative element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/5 to-transparent blur-3xl rounded-full -z-10" />
              <HeroCarousel billboards={billboards} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
