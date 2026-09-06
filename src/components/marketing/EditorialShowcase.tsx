import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { getProducts } from "@/services/productService";
import Link from "next/link";

export async function EditorialShowcase() {
  const { products } = await getProducts({ limit: 1 });
  const product = products?.[0];

  if (!product) return null;

  return (
    <section className="py-24 overflow-hidden">
      <Container>
        <div className="bg-muted rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-[500px] lg:h-auto order-2 lg:order-1">
            <Image
              src={product.imageUrl || "https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=1200"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="p-12 md:p-16 lg:p-24 flex flex-col justify-center order-1 lg:order-2">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase mb-4">
              Featured Product
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 line-clamp-2">
              {product.name}
            </h2>
            <div 
              className="text-lg text-muted-foreground mb-8 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            
            <ul className="space-y-4 mb-10">
              {[
                "Premium quality",
                "Built to last",
                "Best in class design",
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
              <Link href={`/products/${product.slug}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  View Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
