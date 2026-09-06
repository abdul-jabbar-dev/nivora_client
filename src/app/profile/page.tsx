"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { User, Mail, Phone, MapPin, Bell, LogOut, Package, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { ENV } from "@/lib/env";

// Helper for authenticated fetches (same as checkout)
const api = {
  get: async (url: string) => fetch(`${ENV.NEXT_PUBLIC_API_URL}${url}`, { headers: { Authorization: `Bearer ${(useAuthStore.getState().session as any)?.access_token}` } }).then(async r => { if (!r.ok) throw await r.json(); return r.json().then(data => ({ data })); }),
  patch: async (url: string, data: any) => fetch(`${ENV.NEXT_PUBLIC_API_URL}${url}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(useAuthStore.getState().session as any)?.access_token}` }, body: JSON.stringify(data) }).then(async r => { if (!r.ok) throw await r.json(); return r.json().then(data => ({ data })); })
};

const TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<"add" | "edit">("add");
  const { user, session } = useAuthStore();
  const router = useRouter();

  const [addressData, setAddressData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    landmark: '',
    phoneNumber: ''
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return;
      try {
        const response = await api.get('/users/profile');
        const profile = response.data;
        if (profile) {
          setAddressData(prev => ({
            ...prev,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            address: profile.address || '',
            city: profile.city || '',
            zip: profile.zip || '',
            landmark: profile.landmark || '',
            phoneNumber: profile.phoneNumber || ''
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [session]);

  const handleSaveAddress = async () => {
    try {
      await api.patch('/users/profile', addressData);
      setIsAddressModalOpen(false);
    } catch (err) {
      console.error('Failed to save address', err);
      alert('Failed to save address.');
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const userEmail = user?.email || "No email provided";
  const fullName = user?.user_metadata?.full_name || "User";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-muted/30 pt-32 pb-20">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and account settings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <div className="bg-background rounded-2xl shadow-sm border border-border p-4 mb-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                  {initial}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-lg truncate">{fullName}</h3>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
              <Link href="/orders" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted">
                <Package className="w-4 h-4" />
                View My Orders
              </Link>
            </div>

            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
              <div className="h-px bg-border my-2 mx-4" />
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 bg-background rounded-2xl shadow-sm border border-border p-6 sm:p-8">
            
            {activeTab === "personal" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{fullName}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium truncate">{userEmail}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">+880 1712 345678</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-8 mb-6">
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <Button variant="outline" size="sm" onClick={() => { setAddressModalMode("add"); setIsAddressModalOpen(true); }}>Add New</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl border border-primary bg-primary/5 relative">
                    <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">Default</span>
                    <div className="flex items-start gap-3 mt-2">
                      <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div className="w-full">
                        <h4 className="font-semibold mb-1">Home</h4>
                        {isLoadingProfile ? (
                          <div className="space-y-2 max-w-[200px]">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        ) : addressData.address ? (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {addressData.firstName} {addressData.lastName}<br />
                            {addressData.address}<br />
                            {addressData.landmark && <>{addressData.landmark}<br /></>}
                            {addressData.city}{addressData.zip ? `, ${addressData.zip}` : ''}<br />
                            {addressData.phoneNumber}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed">No default address set.</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setAddressModalMode("edit"); setIsAddressModalOpen(true); }}>
                        {addressData.address ? 'Edit' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "notifications" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
                <p className="text-muted-foreground mb-8">Choose what updates you want to receive.</p>

                <div className="space-y-6 max-w-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Order Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about your order status</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Promotions & Deals</h4>
                      <p className="text-sm text-muted-foreground">Hear about our latest offers and sales</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Newsletter</h4>
                      <p className="text-sm text-muted-foreground">Weekly digest of our best products</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </Container>

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background rounded-xl p-6 w-full max-w-md shadow-lg animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{addressModalMode === "add" ? "Add New Address" : "Edit Address"}</h2>
              <button onClick={() => setIsAddressModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Address Title</label>
                <input type="text" placeholder="e.g. Home, Office" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input value={addressData.firstName} onChange={e => setAddressData({...addressData, firstName: e.target.value})} type="text" placeholder="e.g. John" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input value={addressData.lastName} onChange={e => setAddressData({...addressData, lastName: e.target.value})} type="text" placeholder="e.g. Doe" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Receiver Contact Number</label>
                <input value={addressData.phoneNumber} onChange={e => setAddressData({...addressData, phoneNumber: e.target.value})} type="tel" placeholder="e.g. 01XXXXXXXXX" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">House / Street Address</label>
                <input value={addressData.address} onChange={e => setAddressData({...addressData, address: e.target.value})} type="text" placeholder="e.g. House 12, Road 5" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postal Code</label>
                  <input value={addressData.zip} onChange={e => setAddressData({...addressData, zip: e.target.value})} type="text" placeholder="e.g. 1212" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} type="text" placeholder="e.g. Dhaka" className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specific Location / Landmark (Optional)</label>
                <textarea value={addressData.landmark} onChange={e => setAddressData({...addressData, landmark: e.target.value})} placeholder="e.g. Next to the super shop..." className="flex min-h-[60px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
              </div>
              <Button className="w-full mt-2" onClick={handleSaveAddress}>Save Address</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
