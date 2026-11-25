import crypto from "node:crypto";
import { cookies } from "next/headers";

export type AuthProviderType = "email" | "kakao" | "google";
export type AuthenticatedRole = "member" | "admin";
export type UserRole = "guest" | AuthenticatedRole;

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  role: AuthenticatedRole;
  parish?: string;
  avatarUrl?: string;
  school?: string;
  department?: string;
  gender?: string;
  hobby?: string;
  specialty?: string;
  profileCompleted?: boolean;
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

interface SessionPayload {
  user: SessionUser;
  exp: number;
}

export const SESSION_COOKIE_NAME = "church19_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.AUTH_SECRET || "church19-dev-session-secret-key-2026";
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(":");
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(keyHex, "hex");
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

/**
 * Keep the signed cookie compact (exclude potentially large base64 avatar data URLs).
 */
export function toCookieUser(user: SessionUser): SessionUser {
  const compactAvatar =
    user.avatarUrl && !user.avatarUrl.startsWith("data:") ? user.avatarUrl : undefined;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    role: user.role,
    parish: user.parish,
    avatarUrl: compactAvatar,
    profileCompleted: user.profileCompleted,
  };
}

export function signSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    user: toCookieUser(user),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  const sigBuf = Buffer.from(sig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload.user ?? null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getSessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
