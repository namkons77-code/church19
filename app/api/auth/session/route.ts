import { NextResponse } from "next/server";
import { getCurrentSessionUser } from "@/app/lib/currentUser";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";

export async function GET() {
  const user = await getCurrentSessionUser();
  return NextResponse.json(
    {
      user,
      mode: isSupabaseConfigured() ? "supabase" : "local",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
