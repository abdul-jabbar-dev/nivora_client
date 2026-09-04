"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  description: string;
  features?: string[];
  specifications?: Record<string, string>;
}

export function ProductDetails({ description, features, specifications }: ProductDetailsProps) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl pt-8">
      <Section title="Product Details" defaultOpen>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </Section>

      {features && features.length > 0 && (
        <Section title="Why you'll love it" defaultOpen>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 bg-primary/10 rounded-full p-1 text-primary">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {specifications && Object.keys(specifications).length > 0 && (
        <Section title="Specifications">
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-border">
                {Object.entries(specifications).map(([key, value]) => (
                  <tr key={key} className="even:bg-muted/50 flex flex-col sm:table-row">
                    <td className="px-6 py-4 font-medium text-foreground sm:w-1/3 border-b sm:border-b-0 border-border sm:border-r">
                      {key}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border py-6 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none group"
      >
        <h3 className="text-xl font-semibold">{title}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:text-foreground",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
