import { ENV } from "./env";

/**
 * Returns the canonical base URL for NIVORA.
 * Production domain: https://nivora.abduljabbartech.me
 * Guarantees no localhost or development URLs appear in production SEO metadata,
 * canonical links, sitemaps, or structured data.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (process.env.NODE_ENV === "production") {
    if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
      return ENV.SITE_URL;
    }
    return envUrl.replace(/\/+$/, "");
  }

  return (envUrl || ENV.SITE_URL).replace(/\/+$/, "");
}
