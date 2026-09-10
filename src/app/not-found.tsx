import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] bg-background pt-28 md:pt-36 pb-20 md:pb-28">
      <Container className="flex flex-col items-center text-center max-w-xl">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-muted text-muted-foreground mb-6">
          404 Error
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Homepage
            </Button>
          </Link>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <ShoppingBag className="w-4 h-4" />
              Browse Shop
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
