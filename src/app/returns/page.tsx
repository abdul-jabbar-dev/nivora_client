import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Returns & Exchanges | NIVORA",
  description: "Read our returns and exchanges policy.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Returns & Exchanges</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">Our 30-Day Policy</h2>
            <p>
              We want you to be completely satisfied with your purchase. Our return policy lasts 30 days. 
              If 30 days have gone by since your purchase, unfortunately, we can’t offer you a refund or exchange.
            </p>
            
            <p>
              To be eligible for a return, your item must be unused, in the same condition that you received it, 
              and in its original packaging. Several types of goods are exempt from being returned, such as 
              perishable goods, intimates, and gift cards.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Refunds</h2>
            <p>
              Once your return is received and inspected, we will send you an email to notify you that we have 
              received your returned item. We will also notify you of the approval or rejection of your refund.
              If approved, your refund will be processed, and a credit will automatically be applied to your 
              original method of payment within 5-10 business days.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Exchanges</h2>
            <p>
              We only replace items if they are defective or damaged. If you need to exchange it for the same item, 
              send us an email at support@nivora.com and we will provide you with the return address.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Return Shipping</h2>
            <p>
              You will be responsible for paying for your own shipping costs for returning your item unless the item 
              was defective upon arrival. Shipping costs are non-refundable. If you receive a refund, the cost of 
              return shipping will be deducted from your refund.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
