import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Camera, Share2, MessageCircle } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Shop",
    links: [
      { name: "Shop", href: "/shop" },
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Contact", href: "/contact" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-8 md:pt-16 pb-6 md:pb-8">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-12 mb-8 md:mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="text-2xl font-bold tracking-tight mb-2 md:mb-4 inline-block">
              NIVORA
            </Link>
            <p className="text-muted-foreground mb-4 md:mb-6 max-w-sm hidden sm:block">
              Better Things, Better Everyday.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Camera className="w-5 h-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
          
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{section.title}</h3>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} NIVORA. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
