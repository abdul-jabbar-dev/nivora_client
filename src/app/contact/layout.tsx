import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | NIVORA",
  description:
    "Get in touch with NIVORA customer support. Reach out for order inquiries, assistance, and questions across Bangladesh.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
