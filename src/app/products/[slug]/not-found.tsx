import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function ProductNotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
      <Container className="flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          Product Not Found
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Sorry, we couldn't find the product you're looking for. It might have been removed or the link may be broken.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
