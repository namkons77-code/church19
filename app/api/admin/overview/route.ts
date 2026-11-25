import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { SessionUser } from "@/app/lib/auth";
import { listCommunityPosts } from "@/app/lib/communityStore";
import { getCurrentSessionUser, getEffectiveRole } from "@/app/lib/currentUser";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";
import { listAllLocalUsers } from "@/app/lib/userStore";

interface ApplicationSummary {
  id: string;
  service_id: string;
  service_title: string;
  applicant_name: string;
  contact: string;
  note: string;
  status: string;
  created_at: string;
}

export async function GET() {
  const currentUser = await getCurrentSessionUser();
  const role = getEffectiveRole(currentUser);

  if (role === "guest" || !currentUser) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (role !== "admin") {
    return NextResponse.json(
      { error: "관리자만 접근할 수 있습니다." },
      { status: 403 }
    );
  }

  const { posts, storage: communityStorage } = await listCommunityPosts();

  let users: SessionUser[] = [];
  let applications: ApplicationSummary[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: profileRows, error: profErr } = await supabase
      .from("profiles")
      .select("id, email, name, parish, provider, role, avatar_url, profile_completed")
      .order("created_at", { ascending: false });

    if (!profErr && profileRows) {
      users = profileRows.map((p) => ({
        id: p.id as string,
        email: (p.email as string) || "",
        name: (p.name as string) || "성도",
        provider: (p.provider as SessionUser["provider"]) || "email",
        role: p.role === "admin" ? "admin" : "member",
        parish: (p.parish as string) || "새가족",
        avatarUrl: (p.avatar_url as string | null) || undefined,
        profileCompleted: Boolean(p.profile_completed),
      }));
    } else {
      users = [currentUser];
    }

    const { data: appRows } = await supabase
      .from("online_applications")
      .select("id, service_id, service_title, applicant_name, contact, note, status, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (appRows) {
      applications = appRows as ApplicationSummary[];
    }
  } else {
    users = await listAllLocalUsers();
    try {
      const raw = await fs.readFile(
        path.join(process.cwd(), ".data", "applications.json"),
        "utf8"
      );
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) applications = parsed;
    } catch {
      applications = [];
    }
  }

  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  return NextResponse.json(
    {
      stats: {
        totalPosts: posts.length,
        totalComments,
        totalUsers: users.length,
        totalAdmins: users.filter((u) => u.role === "admin").length,
        totalApplications: applications.length,
      },
      users,
      posts,
      applications,
      storage: communityStorage,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
