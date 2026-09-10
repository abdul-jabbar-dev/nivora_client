import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests | NIVORA",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
