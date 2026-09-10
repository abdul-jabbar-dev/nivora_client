import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service | NIVORA",
  description:
    "Read the Terms of Service for using NIVORA and purchasing from our online store in Bangladesh.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <h2 className="text-2xl font-semibold text-foreground">1. Overview</h2>
            <p>
              This website is operated by NIVORA. Throughout the site, the terms “we”, “us” and “our” refer to NIVORA. 
              NIVORA offers this website, including all information, tools and services available from this site to you, 
              the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">2. Online Store Terms</h2>
            <p>
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your 
              state or province of residence, or that you are the age of majority in your state or province of residence 
              and you have given us your consent to allow any of your minor dependents to use this site.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, 
              violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">3. General Conditions</h2>
            <p>
              We reserve the right to refuse service to anyone for any reason at any time. You understand that your content 
              (not including credit card information), may be transferred unencrypted and involve (a) transmissions over 
              various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">4. Modifications to the Service and Prices</h2>
            <p>
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or 
              discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable 
              to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">5. Contact Information</h2>
            <p>
              Questions about the Terms of Service should be sent to us at support@nivora.com.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
