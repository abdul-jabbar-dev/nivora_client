import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-muted-foreground whitespace-nowrap overflow-x-auto pb-2 -mb-2">
      <Link href="/" className="hover:text-foreground transition-colors shrink-0">
        Home
      </Link>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center shrink-0">
          <ChevronRight className="w-4 h-4 mx-2 shrink-0 opacity-50" />
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
