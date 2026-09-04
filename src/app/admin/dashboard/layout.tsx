"use client";

import { Container } from "@/components/ui/Container";
import { LogOut, LayoutDashboard, Users, ShoppingCart, Settings, Package, Tag } from "lucide-react";
import { logoutAdmin } from "../actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NAV_LINKS = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/dashboard/categories", icon: Tag },
    { name: "Products", href: "/admin/dashboard/products", icon: Package },
    { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/dashboard/customers", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Container>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-background rounded-2xl shadow-sm border border-border p-4">
            <div className="mb-8 px-4">
              <h2 className="text-xl font-bold tracking-tight">Master Admin</h2>
              <p className="text-xs text-muted-foreground mt-1">admin@gmail.com</p>
            </div>
            
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="h-px bg-border my-2 mx-4" />
              
              <form action={logoutAdmin}>
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </form>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
