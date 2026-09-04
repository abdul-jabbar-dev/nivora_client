"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <section className="py-24 bg-muted/50 border-t border-border">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8">
            Get product drops, exclusive offers, and useful updates directly to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={status === "loading" || status === "success"}
            />
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="min-w-[120px]"
            >
              {status === "idle" && "Subscribe"}
              {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === "success" && (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Subscribed
                </>
              )}
            </Button>
          </form>
          {status === "success" && (
            <p className="text-sm text-green-600 mt-4 font-medium">
              Thank you for subscribing! Check your inbox soon.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
