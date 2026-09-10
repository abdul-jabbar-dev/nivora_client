import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Product | NIVORA",
  description:
    "Looking for a specific product not yet in our store? Submit a request to NIVORA and we will source it for you.",
  alternates: {
    canonical: "/request-product",
  },
};

export default function RequestProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
