import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export function EditorialShowcase() {
  return (
    <section className="py-24 overflow-hidden">
      <Container>
        <div className="bg-muted rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[500px] lg:h-auto order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200"
              alt="Premium Workspace Setup"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="p-12 md:p-16 lg:p-24 flex flex-col justify-center order-1 lg:order-2">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
              The Signature Collection
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Designed for Everyday
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Experience the perfect blend of form and function. Our signature collection features minimalist designs crafted from premium materials that elevate your daily routine.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Sustainably sourced premium materials",
                "Ergonomic and minimalist design",
                "Built to last a lifetime",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div>
              <Button size="lg" className="w-full sm:w-auto">
                Explore The Collection
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
