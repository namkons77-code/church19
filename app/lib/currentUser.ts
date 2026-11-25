import { getSessionUser, type SessionUser, type UserRole } from "./auth";
import { isSupabaseConfigured, mapSupabaseUser } from "./supabase/config";
import { createServerSupabaseClient } from "./supabase/server";
import { findUserById, toSessionUser } from "./userStore";

export const PROFILE_SELECT =
  "name, parish, provider, role, avatar_url, school, department, gender, hobby, specialty, profile_completed";

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", user.id)
      .maybeSingle();

    return mapSupabaseUser(user, profile);
  }

  const cookieUser = await getSessionUser();
  if (!cookieUser) return null;

  const stored = await findUserById(cookieUser.id);
  return stored ? toSessionUser(stored) : cookieUser;
}

export function getEffectiveRole(user: SessionUser | null): UserRole {
  if (!user) return "guest";
  return user.role === "admin" ? "admin" : "member";
}
