import { getDashboardStats } from "./actions";
import { DollarSign, ShoppingBag, Users, Clock, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount);
};

export default async function AdminDashboardPage() {
  let stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    recentOrders: []
  };
  let error = null;

  try {
    stats = await getDashboardStats();
  } catch (err: any) {
    error = err.message;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PROCESSING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
          Error loading dashboard stats: {error}
        </div>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
        
        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Pending Orders</h3>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="bg-background rounded-2xl p-6 shadow-sm border border-border flex items-start gap-4 transition-all hover:shadow-md">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Customers</h3>
            <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Shortcut */}
      <div className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Recent Orders</h3>
            <p className="text-sm text-muted-foreground">Latest transactions needing your attention.</p>
          </div>
          <Link href="/admin/dashboard/orders" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No orders found.
                  </td>
                </tr>
              ) : (
                stats.recentOrders?.map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      #{order.id.slice(0, 8).toUpperCase()}
                      <div className="text-xs text-muted-foreground font-normal mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{order.user.firstName} {order.user.lastName}</div>
                      <div className="text-xs text-muted-foreground">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/dashboard/orders/${order.id}`}
                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:opacity-90 transition-opacity"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
