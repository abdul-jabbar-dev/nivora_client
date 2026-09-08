export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005",
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  NODE_ENV: process.env.NODE_ENV,

};