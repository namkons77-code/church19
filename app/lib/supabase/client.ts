import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

export function createBrowserSupabaseClient() {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return createBrowserClient(url, anonKey);
}
