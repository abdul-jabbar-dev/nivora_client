"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
  description: string;
  features?: string[];
  specifications?: any; // Array<{key, value}> or Record<string, string> or JSON string
}

export function ProductDetails({ description, features, specifications }: ProductDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Normalize specifications from Array, Object, or JSON string
  let normalizedSpecs: { key: string; value: string }[] = [];
  if (specifications) {
    let raw = specifications;
    if (typeof raw === "string") {
      try {
        raw = JSON.parse(raw);
      } catch {
        // Ignored if invalid JSON string
      }
    }

    if (Array.isArray(raw)) {
      normalizedSpecs = raw
        .map((item: any) => {
          if (!item) return null;
          const key = item.key || item.name || item.title || item.label || Object.keys(item)[0] || "";
          const value = item.value ?? (typeof item === "object" && item[key] !== undefined ? item[key] : "") ?? "";
          return { key: String(key).trim(), value: String(value).trim() };
        })
        .filter((item): item is { key: string; value: string } => Boolean(item && item.key && item.value));
    } else if (typeof raw === "object" && raw !== null) {
      normalizedSpecs = Object.entries(raw)
        .map(([k, v]) => ({ key: String(k).trim(), value: String(v).trim() }))
        .filter((item) => item.key && item.value);
    }
  }

  // Detect whether description content actually exceeds 200px
  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 200);
    }
  }, [description]);

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Product Details / Description Section */}
      {description && (
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Product Details</h3>
          
          <div className="relative">
            <div
              ref={contentRef}
              className={cn(
                "text-muted-foreground leading-relaxed prose prose-base max-w-none dark:prose-invert transition-all duration-300 overflow-hidden",
                !isExpanded && isOverflowing ? "max-h-[200px]" : "max-h-none"
              )}
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* Bottom Gradient Fade when collapsed */}
            {!isExpanded && isOverflowing && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
            )}
          </div>

          {/* See More / See Less Toggle Button */}
          {isOverflowing && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-all py-2 px-6 rounded-full border border-border bg-card hover:bg-muted/50 shadow-sm"
              >
                <span>{isExpanded ? "See Less" : "See More"}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform duration-300",
                    isExpanded && "rotate-180"
                  )}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Specifications Section - Prominently Displayed */}
      {normalizedSpecs.length > 0 && (
        <div className="flex flex-col pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Specifications</h3>
          <div className="rounded-xl border border-border overflow-hidden bg-card shadow-xs">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-border">
                {normalizedSpecs.map((spec, idx) => (
                  <tr key={idx} className="even:bg-muted/30 transition-colors flex flex-col sm:table-row">
                    <td className="px-6 py-4 font-medium text-foreground sm:w-1/3 md:w-1/4 border-b sm:border-b-0 border-border sm:border-r bg-muted/20">
                      {spec.key}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground sm:w-2/3 md:w-3/4">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <div className="flex flex-col pt-8 border-t border-border">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Why you&apos;ll love it</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-muted/20">
                <div className="mt-0.5 shrink-0 bg-primary/10 rounded-full p-1 text-primary">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-muted-foreground text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
