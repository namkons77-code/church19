import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import {
  AuthenticatedRole,
  AuthProviderType,
  hashPassword,
  isAdminEmail,
  SessionUser,
} from "./auth";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  provider: AuthProviderType;
  role: AuthenticatedRole;
  providerId?: string;
  passwordHash?: string;
  parish?: string;
  avatarUrl?: string;
  school?: string;
  department?: string;
  gender?: string;
  hobby?: string;
  specialty?: string;
  profileCompleted?: boolean;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function createSeedUsers(): StoredUser[] {
  return [
    {
      id: "usr_demo_admin",
      name: "최관리자 목사",
      email: "admin@church19.org",
      provider: "email",
      role: "admin",
      passwordHash: hashPassword("admin19!1234"),
      parish: "교회사무실",
      profileCompleted: true,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: "usr_demo_member",
      name: "김은혜 성도",
      email: "member@church19.org",
      provider: "email",
      role: "member",
      passwordHash: hashPassword("church19!1234"),
      parish: "1교구",
      profileCompleted: false,
      createdAt: "2026-01-01T00:00:00.000Z",
    },
  ];
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return createSeedUsers();
    const list = parsed as StoredUser[];
    // Ensure demo admin exists if users.json was created earlier
    if (!list.some((u) => u.email.toLowerCase() === "admin@church19.org")) {
      list.unshift(createSeedUsers()[0]);
      await writeUsers(list);
    }
    return list;
  } catch {
    const seed = createSeedUsers();
    await writeUsers(seed);
    return seed;
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function resolveRole(user: Partial<StoredUser>): AuthenticatedRole {
  if (user.role === "admin" || isAdminEmail(user.email)) {
    return "admin";
  }
  return "member";
}

export function toSessionUser(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    provider: user.provider,
    role: resolveRole(user),
    parish: user.parish,
    avatarUrl: user.avatarUrl,
    school: user.school,
    department: user.department,
    gender: user.gender,
    hobby: user.hobby,
    specialty: user.specialty,
    profileCompleted: Boolean(user.profileCompleted),
  };
}

export async function listAllLocalUsers(): Promise<SessionUser[]> {
  const users = await readUsers();
  return users.map(toSessionUser);
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await readUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function findEmailUser(email: string): Promise<StoredUser | null> {
  const users = await readUsers();
  const normalized = email.trim().toLowerCase();
  return (
    users.find(
      (u) => u.provider === "email" && u.email.toLowerCase() === normalized
    ) ?? null
  );
}

export async function createEmailUser(input: {
  name: string;
  email: string;
  password: string;
  parish?: string;
}): Promise<StoredUser> {
  const users = await readUsers();
  const normalized = input.email.trim().toLowerCase();

  const existing = users.find(
    (u) => u.provider === "email" && u.email.toLowerCase() === normalized
  );
  if (existing) {
    throw new Error("EMAIL_EXISTS");
  }

  const newUser: StoredUser = {
    id: `usr_${crypto.randomUUID()}`,
    name: input.name.trim(),
    email: normalized,
    provider: "email",
    role: isAdminEmail(normalized) ? "admin" : "member",
    passwordHash: hashPassword(input.password),
    parish: input.parish?.trim() || "새가족",
    profileCompleted: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function upsertOAuthUser(input: {
  provider: "kakao" | "google";
  providerId: string;
  name: string;
  email: string;
  avatarUrl?: string;
}): Promise<StoredUser> {
  const users = await readUsers();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existingIdx = users.findIndex(
    (u) =>
      u.provider === input.provider &&
      (u.providerId === input.providerId || u.email.toLowerCase() === normalizedEmail)
  );

  if (existingIdx >= 0) {
    const existing = users[existingIdx];
    const updated: StoredUser = {
      ...existing,
      role: resolveRole(existing),
      name: existing.profileCompleted ? existing.name : input.name || existing.name,
      email: normalizedEmail || existing.email,
      providerId: input.providerId,
      avatarUrl: existing.avatarUrl || input.avatarUrl,
    };
    users[existingIdx] = updated;
    await writeUsers(users);
    return updated;
  }

  const newUser: StoredUser = {
    id: `usr_${crypto.randomUUID()}`,
    name: input.name.trim() || `${input.provider} 성도`,
    email: normalizedEmail,
    provider: input.provider,
    role: isAdminEmail(normalizedEmail) ? "admin" : "member",
    providerId: input.providerId,
    avatarUrl: input.avatarUrl,
    parish: "새가족",
    profileCompleted: false,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    name?: string;
    parish?: string;
    avatarUrl?: string | null;
    school?: string;
    department?: string;
    gender?: string;
    hobby?: string;
    specialty?: string;
    profileCompleted?: boolean;
  }
): Promise<StoredUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;

  const current = users[idx];
  const updated: StoredUser = {
    ...current,
    role: resolveRole(current),
    name: updates.name !== undefined ? updates.name.trim() || current.name : current.name,
    parish: updates.parish !== undefined ? updates.parish.trim() : current.parish,
    avatarUrl:
      updates.avatarUrl === null
        ? undefined
        : updates.avatarUrl !== undefined
          ? updates.avatarUrl
          : current.avatarUrl,
    school: updates.school !== undefined ? updates.school.trim() : current.school,
    department:
      updates.department !== undefined ? updates.department.trim() : current.department,
    gender: updates.gender !== undefined ? updates.gender.trim() : current.gender,
    hobby: updates.hobby !== undefined ? updates.hobby.trim() : current.hobby,
    specialty:
      updates.specialty !== undefined ? updates.specialty.trim() : current.specialty,
    profileCompleted:
      updates.profileCompleted !== undefined
        ? updates.profileCompleted
        : current.profileCompleted,
  };

  users[idx] = updated;
  await writeUsers(users);
  return updated;
}

export async function updateLocalUserRole(
  userId: string,
  role: AuthenticatedRole
): Promise<StoredUser | null> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx] = { ...users[idx], role };
  await writeUsers(users);
  return users[idx];
}
