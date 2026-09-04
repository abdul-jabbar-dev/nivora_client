import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function DealsBanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay" />
      </div>
      
      <Container className="relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
          Limited Time Offer
        </span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Upgrade Your Everyday
        </h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Save up to 40% on selected premium products. Don't miss out on these exclusive deals to enhance your lifestyle.
        </p>
        <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
          Explore Deals
        </Button>
      </Container>
    </section>
  );
}
