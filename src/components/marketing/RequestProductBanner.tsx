import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search } from "lucide-react";

export function RequestProductBanner() {
  return (
    <section className="bg-foreground text-background py-24 my-12 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[140%] rounded-full bg-background/5 blur-3xl transform rotate-12" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[100%] rounded-full bg-background/5 blur-3xl transform -rotate-12" />
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/10 text-xs font-semibold uppercase tracking-wider text-muted mb-4 border border-background/20">
          <Search className="w-3.5 h-3.5" />
          Can't Find It?
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Request Any Product
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          Looking for something specific that's not in our catalog? Let us know what you need, and our team will source the premium quality product just for you.
        </p>
        
        <div className="pt-4">
          <Link href="/request-product">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90 text-base h-10 px-6 rounded-full font-medium shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-1">
              Submit a Request
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
