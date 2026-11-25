import type { User } from "@supabase/supabase-js";
import {
  isAdminEmail,
  type AuthenticatedRole,
  type AuthProviderType,
  type SessionUser,
} from "../auth";

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    "";
  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

function normalizeProvider(raw: unknown): AuthProviderType {
  if (raw === "kakao" || raw === "google") return raw;
  return "email";
}

function normalizeRole(raw: unknown, email?: string): AuthenticatedRole {
  if (raw === "admin" || isAdminEmail(email)) return "admin";
  return "member";
}

export interface SupabaseProfileRow {
  name?: string | null;
  parish?: string | null;
  provider?: string | null;
  role?: string | null;
  avatar_url?: string | null;
  school?: string | null;
  department?: string | null;
  gender?: string | null;
  hobby?: string | null;
  specialty?: string | null;
  profile_completed?: boolean | null;
}

function extractIdentityAvatar(user: User): string | undefined {
  if (!Array.isArray(user.identities)) return undefined;
  for (const identity of user.identities) {
    const data = identity.identity_data as Record<string, unknown> | undefined;
    if (!data) continue;
    if (typeof data.avatar_url === "string" && data.avatar_url) {
      return data.avatar_url;
    }
    if (typeof data.picture === "string" && data.picture) {
      return data.picture;
    }
  }
  return undefined;
}

export function mapSupabaseUser(
  user: User,
  profile?: SupabaseProfileRow | null
): SessionUser {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;

  const provider = normalizeProvider(profile?.provider ?? appMeta.provider);
  const role = normalizeRole(profile?.role ?? appMeta.role ?? meta.role, user.email);
  const nameFromMeta =
    (typeof meta.name === "string" && meta.name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (typeof meta.nickname === "string" && meta.nickname) ||
    user.email?.split("@")[0] ||
    "성도";

  const avatarFromMeta =
    (typeof meta.avatar_url === "string" && meta.avatar_url) ||
    (typeof meta.picture === "string" && meta.picture) ||
    extractIdentityAvatar(user) ||
    undefined;

  const avatarCleared = meta.avatar_cleared === true;
  const resolvedAvatar =
    profile?.avatar_url ||
    (avatarCleared ? undefined : avatarFromMeta);

  const strMeta = (key: string) =>
    typeof meta[key] === "string" ? (meta[key] as string) : undefined;

  return {
    id: user.id,
    email: user.email || "",
    name: profile?.name || nameFromMeta,
    provider,
    role,
    parish: profile?.parish || strMeta("parish") || "새가족",
    avatarUrl: resolvedAvatar || undefined,
    school: profile?.school ?? strMeta("school"),
    department: profile?.department ?? strMeta("department"),
    gender: profile?.gender ?? strMeta("gender"),
    hobby: profile?.hobby ?? strMeta("hobby"),
    specialty: profile?.specialty ?? strMeta("specialty"),
    profileCompleted: Boolean(
      profile?.profile_completed ?? meta.profile_completed ?? false
    ),
  };
}
