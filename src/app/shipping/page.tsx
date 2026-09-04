import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Shipping Information | NIVORA",
  description: "Learn about our shipping methods, delivery times, and rates.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Shipping Information</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">Delivery Times & Rates</h2>
            <p>
              We strive to deliver your orders as quickly and efficiently as possible. All orders are processed 
              within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
            
            <ul className="list-disc pl-6 space-y-2 mt-4 text-foreground">
              <li><strong>Inside Dhaka:</strong> 2-3 Business Days (৳60)</li>
              <li><strong>Outside Dhaka:</strong> 3-5 Business Days (৳120)</li>
              <li><strong>Express Delivery (Dhaka Only):</strong> Next Business Day (৳150)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Free Shipping</h2>
            <p>
              We offer free standard shipping on all orders over ৳5000. Free shipping will be automatically 
              applied at checkout for qualifying orders.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Order Tracking</h2>
            <p>
              Once your order has shipped, you will receive a shipment confirmation email containing your 
              tracking number(s). The tracking number will be active within 24 hours.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Damages</h2>
            <p>
              NIVORA is not liable for any products damaged or lost during shipping. If you received your order damaged, 
              please contact the shipment carrier or our support team directly to file a claim. Please save all packaging 
              material and damaged goods before filing a claim.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
