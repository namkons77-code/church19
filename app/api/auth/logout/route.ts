import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/app/lib/auth";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";

export async function POST() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
