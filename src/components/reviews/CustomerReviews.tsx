import { Container } from "@/components/ui/Container";
import { Star } from "lucide-react";
import Image from "next/image";

const REVIEWS = [
  {
    id: 1,
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "The quality of these products is simply outstanding. The minimalist watch has become my everyday essential.",
    verified: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    text: "Fast shipping and incredible customer service. The packaging alone feels like a premium experience.",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
    rating: 4,
    text: "Beautiful designs that actually last. I've recommended this store to all my friends.",
    verified: true,
  },
];

export function CustomerReviews() {
  return (
    <section className="py-24 bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Loved by Thousands
          </h2>
          <p className="text-muted-foreground">
            Don't just take our word for it. Here's what our customers have to say.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 no-scrollbar">
          {REVIEWS.map((review) => (
            <div key={review.id} className="w-full flex-none sm:w-[350px] md:w-auto snap-center shrink-0 bg-background p-8 rounded-2xl shadow-sm border border-border flex flex-col">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{review.name}</h4>
                  {review.verified && (
                    <span className="text-xs text-green-600 font-medium">Verified Buyer</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
