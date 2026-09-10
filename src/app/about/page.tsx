import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About Us | NIVORA",
  description:
    "Learn more about NIVORA, our mission to deliver better everyday essentials across Bangladesh, and our commitment to trusted quality.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">About NIVORA</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg text-foreground">
              Welcome to NIVORA, where we believe in "Better Things, Better Everyday."
            </p>
            
            <p>
              Founded with the vision of simplifying and elevating your daily life, NIVORA curates high-quality, 
              thoughtfully designed products across electronics, fashion, and home goods. We meticulously select 
              every item in our store to ensure it meets our strict standards for durability, aesthetic appeal, 
              and practical value.
            </p>
            
            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Our Mission</h2>
            <p>
              Our mission is simple: to connect you with products that make your life easier, more enjoyable, 
              and more beautiful. We believe that the objects you surround yourself with should serve a purpose 
              and bring joy to your everyday routines.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Quality Commitment</h2>
            <p>
              We partner directly with trusted manufacturers and artisans to cut out the middleman, allowing us 
              to offer premium goods at accessible prices. Every product comes with our quality guarantee, 
              ensuring that your investment in NIVORA is one you can trust.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
