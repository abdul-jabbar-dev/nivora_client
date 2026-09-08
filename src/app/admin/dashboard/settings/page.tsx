"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ENV } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

interface SiteSettings {
  facebookUrl: string;
  instagramUrl: string;
  freeShippingThreshold: number;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    facebookUrl: "",
    instagramUrl: "",
    freeShippingThreshold: 0,
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/site-settings`);
      const data = await res.json();
      if (data) {
        setSettings({
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          freeShippingThreshold: data.freeShippingThreshold || 0,
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          whatsapp: data.whatsapp || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
      toast.error("Failed to load settings");
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/site-settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", errorText);
        throw new Error(errorText || "Failed to update");
      }

      toast.success("Settings updated successfully");
    } catch (error: any) {
      console.error("Failed to update settings", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background rounded-2xl shadow-sm border border-border p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage global configuration and information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Facebook URL</label>
              <input
                name="facebookUrl"
                value={settings.facebookUrl}
                onChange={handleChange}
                type="url"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Instagram URL</label>
              <input
                name="instagramUrl"
                value={settings.instagramUrl}
                onChange={handleChange}
                type="url"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Contact Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <input
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                type="email"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Phone</label>
              <input
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                type="text"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="+880..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp (Orders & Contact)</label>
              <input
                name="whatsapp"
                value={settings.whatsapp}
                onChange={handleChange}
                type="text"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="+880..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[100px]"
                placeholder="Your store address"
              />
            </div>
          </div>
        </div>

        {/* Store Configurations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium border-b pb-2">Store Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Free Shipping Threshold (Amount)</label>
              <input
                name="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={handleChange}
                type="number"
                min="0"
                className="flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto h-11 px-8">
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
