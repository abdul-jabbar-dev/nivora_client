"use client";

import { useActionState } from "react";
import { loginAdmin } from "../actions";
import { Button } from "@/components/ui/Button";
import { ENV } from "@/lib/env";

const initialState = {
  error: null as string | null,
};

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(loginAdmin as any, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="bg-background w-full max-w-md p-8 rounded-2xl shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">Sign in to access the dashboard</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={ENV.ADMIN_EMAIL}
              className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              placeholder={ENV.ADMIN_EMAIL || "admin@example.com"}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              required
              className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              placeholder={"••••••••"}
            />
          </div>

          {state?.error && (
            <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg">
              {state.error}
            </p>
          )}

          <Button type="submit" className="w-full h-11 mt-4">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
