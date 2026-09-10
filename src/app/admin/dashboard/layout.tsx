"use client";

import { Container } from "@/components/ui/Container";
import { LogOut, LayoutDashboard, Users, ShoppingCart, Settings, Package, Tag, FileText, Presentation } from "lucide-react";
import { logoutAdmin } from "../actions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NAV_LINKS = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Billboards", href: "/admin/dashboard/billboards", icon: Presentation },
    { name: "Categories", href: "/admin/dashboard/categories", icon: Tag },
    { name: "Products", href: "/admin/dashboard/products", icon: Package },
    { name: "Orders", href: "/admin/dashboard/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/dashboard/customers", icon: Users },
    { name: "Requests", href: "/admin/dashboard/requests", icon: FileText },
    { name: "Site Settings", href: "/admin/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-24 sm:pt-32 pb-16 sm:pb-20">
      <Container>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Sidebar / Mobile Nav Bar */}
          <div className="w-full md:w-64 flex-shrink-0 bg-background rounded-2xl shadow-sm border border-border p-3 sm:p-4">
            <div className="flex items-center justify-between md:block mb-3 md:mb-8 px-2 md:px-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight">Master Admin</h2>
                <p className="text-xs text-muted-foreground mt-0.5 md:mt-1">admin@gmail.com</p>
              </div>
              <form action={logoutAdmin} className="md:hidden">
                <button type="submit" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900 transition-colors">
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </form>
            </div>
            
            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-1 px-1">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 md:gap-3 px-3.5 md:px-4 py-2 md:py-3 rounded-xl text-left text-xs md:text-sm font-medium transition-colors whitespace-nowrap shrink-0",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm md:shadow-md"
                        : "text-foreground hover:bg-muted bg-muted/40 md:bg-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              
              <div className="hidden md:block h-px bg-border my-2 mx-4" />
              
              <form action={logoutAdmin} className="hidden md:block">
                <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </form>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full min-w-0">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
