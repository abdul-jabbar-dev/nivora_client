import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | NIVORA",
  description:
    "Read the Privacy Policy for NIVORA to understand how we collect, use, and safeguard your personal information.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          

            <h2 className="text-2xl font-semibold text-foreground mt-8">Introduction</h2>
            <p>
              Welcome to Nivora. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make purchases, or use our services. Please read this Privacy Policy carefully. By using our website, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Information We Collect</h2>
            <p>
              We collect various types of information to provide and improve our services to you.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">Account Information</h3>
            <p>
              When you register for an account, we may collect your name, email address, and password. This information is used to manage your account, secure your access, and provide personalized services.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">Personal Information</h3>
            <p>
              When you make a purchase or attempt to make a purchase, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">Information Collected Through Social Login</h3>
            <p>
              We offer the ability to register and log in using third-party social media accounts.
            </p>

            <h4 className="text-lg font-medium text-foreground mt-4">Facebook Login / Meta OAuth</h4>
            <p>
              Users may sign in using their Facebook account. When you authorize Facebook Login, Nivora may receive information permitted by the Facebook authorization flow, such as your name, email address, profile information, and Facebook account identifier where available. 
            </p>
            <p>
              This information is used exclusively for authentication, account creation, account management, and providing the website's services. <strong>Nivora does not sell Facebook user data.</strong> You can revoke Nivora's access at any time through your Facebook account settings.
            </p>

            <h4 className="text-lg font-medium text-foreground mt-4">Google Login</h4>
            <p>
              Similarly, users may sign in using their Google account. We receive basic profile information (such as your name and email address) permitted by Google to facilitate authentication and account creation.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide, operate, and maintain our website and services</li>
              <li>Process and fulfill your orders, including sending order confirmations and shipping updates</li>
              <li>Manage your account and authentication</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Communicate with you regarding updates, promotions, and related information</li>
              <li>Detect and prevent fraud and unauthorized access</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mt-8">How We Store and Protect Information</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6">Authentication and Account Security</h3>
            <p>
              We implement reasonable security measures to protect your account information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">Supabase Authentication and Database</h3>
            <p>
              We use Supabase for authentication and database management. Your data is stored securely in our Supabase database instances. We rely on Supabase's robust security infrastructure to protect your personal and authentication data.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6">Data Storage</h3>
            <p>
              Your personal information, including order records, is stored securely. We take steps to ensure that your data is treated securely and in accordance with this Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Orders and Payments</h2>
            
            <h3 className="text-xl font-medium text-foreground mt-6">Product and Order Information</h3>
            <p>
              Information related to your products and orders is maintained to fulfill current orders and maintain a history of your purchases for your reference and our accounting purposes. Payment processing is handled by secure third-party payment gateways; we do not directly store complete credit card numbers.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent, but if you do not accept cookies, some parts of our website may not function properly.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Third-Party Services</h2>
            <p>
              We may employ third-party companies and services to facilitate our website, provide the website on our behalf, perform website-related services, or assist us in analyzing how our website is used.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mt-6">Social Media / OAuth Providers</h3>
            <p>
              If you choose to authenticate via Facebook or Google, those third-party providers operate under their own privacy policies. We only interact with them for the purposes of secure authentication.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our business partners, trusted affiliates, and advertisers. We may also disclose your information if required to do so by law.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">User Rights</h2>
            <p>
              Depending on your location, you may have rights regarding your personal information, including the right to access, update, or delete the information we have on you.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Account Deletion / Data Deletion</h2>
            <p>
              You have the right to request the deletion of your personal data and account information. 
            </p>
            <p>
              <strong>How to request deletion:</strong> You can request deletion of your data by contacting us directly at our support email provided below. Please include the email address associated with your account in your request.
            </p>
            <p>
              Upon receiving your request, we will delete your account and personal information from our active databases. Please note that we may need to retain certain information when legally required, such as transaction and order records for accounting, tax, or fraud prevention purposes.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Children's Privacy</h2>
            <p>
              Our services do not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-8">Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to request data deletion, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> abdul.jabbar.dev@gamil.com
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
