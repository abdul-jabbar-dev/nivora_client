"use client";

import React, { useEffect, useState } from "react";
import { getAllCustomers } from "../actions";
import { Loader2, User, ShieldCheck, Search, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type RoleFilter = "USER" | "ADMIN" | "ALL";

export default function AdminCustomersPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("USER");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async (selectedRole: RoleFilter) => {
    try {
      setIsLoading(true);
      const res = await getAllCustomers(1, 100, selectedRole);
      setData(res);
    } catch (err) {
      console.error("Failed to fetch customers", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(roleFilter);
  }, [roleFilter]);

  const rawUsers = data?.users || [];
  const totalCount = data?.total ?? 0;
  const usersCount = data?.totalUsersCount ?? 0;
  const adminsCount = data?.totalAdminsCount ?? 0;

  const filteredUsers = rawUsers.filter((user: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();
    const phone = (user.phoneNumber || "").toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Users & Customers</h1>
          <p className="text-muted-foreground text-sm">
            Manage your store customers, order histories, and separate administrative staff.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-border gap-4">
          <div className="flex flex-wrap gap-1 bg-muted/50 p-1 rounded-lg">
            <button
              onClick={() => setRoleFilter("USER")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                roleFilter === "USER"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Customers</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  roleFilter === "USER"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {usersCount}
              </span>
            </button>

            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                roleFilter === "ADMIN"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Users</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  roleFilter === "ADMIN"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {adminsCount}
              </span>
            </button>

            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
                roleFilter === "ALL"
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span>All Users</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  roleFilter === "ALL"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {usersCount + adminsCount || totalCount}
              </span>
            </button>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm">Loading users...</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">User / Customer</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Joined Date</th>
                  <th className="px-6 py-4 font-semibold">Total Orders</th>
                  <th className="px-6 py-4 font-semibold">Total Spent</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        {roleFilter === "ADMIN" ? (
                          <ShieldCheck className="w-6 h-6 text-purple-600" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        No {roleFilter === "ADMIN" ? "admin users" : roleFilter === "USER" ? "customers" : "users"} found
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {searchQuery ? "Try refining your search query." : "No accounts match this filter."}
                      </p>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
                        </Button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/30 transition-colors border-b border-border"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {user.firstName ? (
                              user.firstName[0].toUpperCase()
                            ) : user.role === "ADMIN" ? (
                              <ShieldCheck className="w-5 h-5" />
                            ) : (
                              <User className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/dashboard/customers/${user.id}`}
                              className="font-medium text-foreground hover:underline flex items-center gap-1.5"
                            >
                              <span>
                                {user.firstName || "Unknown"} {user.lastName || ""}
                              </span>
                              {user.role === "ADMIN" && (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-semibold">
                                  Staff
                                </span>
                              )}
                            </Link>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800"
                              : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {user.orderCount || 0}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ৳{(user.totalSpent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/dashboard/customers/${user.id}`}
                          className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity inline-block"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
