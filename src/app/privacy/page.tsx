import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Privacy Policy | NIVORA",
  description: "Read our privacy policy to understand how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>
              This Privacy Policy describes how your personal information is collected, used, and shared when you visit 
              or make a purchase from NIVORA.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Personal Information We Collect</h2>
            <p>
              When you visit the Site, we automatically collect certain information about your device, including information 
              about your web browser, IP address, time zone, and some of the cookies that are installed on your device. 
              Additionally, as you browse the Site, we collect information about the individual web pages or products that you view.
            </p>
            <p>
              When you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, 
              including your name, billing address, shipping address, payment information, email address, and phone number. 
              We refer to this information as "Order Information".
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">How Do We Use Your Personal Information?</h2>
            <p>
              We use the Order Information that we collect generally to fulfill any orders placed through the Site (including 
              processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
            </p>
            <p>
              Additionally, we use this Order Information to communicate with you, screen our orders for potential risk or fraud, 
              and when in line with the preferences you have shared with us, provide you with information or advertising relating 
              to our products or services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Data Retention</h2>
            <p>
              When you place an order through the Site, we will maintain your Order Information for our records unless and until 
              you ask us to delete this information.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Changes</h2>
            <p>
              We may update this privacy policy from time to time in order to reflect, for example, changes to our practices 
              or for other operational, legal or regulatory reasons.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
