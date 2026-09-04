"use client";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">৳1,25,000</p>
        </div>
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Orders</h3>
          <p className="text-3xl font-bold">342</p>
        </div>
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Users</h3>
          <p className="text-3xl font-bold">89</p>
        </div>
      </div>

      <div className="bg-background rounded-2xl p-6 shadow-sm border border-border min-h-[400px]">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
          Dashboard features coming soon...
        </div>
      </div>
    </div>
  );
}
