import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/app/lib/auth";
import { getDataFilePath } from "@/app/lib/dataDir";
import { isSupabaseConfigured } from "@/app/lib/supabase/config";
import { createServerSupabaseClient } from "@/app/lib/supabase/server";

interface ApplicationRecord {
  id: string;
  user_id: string | null;
  service_id: string;
  service_title: string;
  applicant_name: string;
  contact: string;
  note: string;
  status: string;
  created_at: string;
}

const LOCAL_FILE = getDataFilePath("applications.json");

async function readLocalApplications(): Promise<ApplicationRecord[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ applications: [] });
    }
    const { data, error } = await supabase
      .from("online_applications")
      .select("id, service_id, service_title, applicant_name, contact, note, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ applications: [], error: error.message }, { status: 500 });
    }
    return NextResponse.json({ applications: data ?? [] });
  }

  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return NextResponse.json({ applications: [] });
  }
  const all = await readLocalApplications();
  return NextResponse.json({
    applications: all.filter((a) => a.user_id === sessionUser.id).slice(0, 10),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      serviceId?: string;
      serviceTitle?: string;
      applicantName?: string;
      contact?: string;
      note?: string;
    };

    const serviceId = (body.serviceId ?? "").trim();
    const serviceTitle = (body.serviceTitle ?? "").trim();
    const applicantName = (body.applicantName ?? "").trim();
    const contact = (body.contact ?? "").trim();
    const note = (body.note ?? "").trim();

    if (!serviceId || !serviceTitle || !applicantName || !contact || !note) {
      return NextResponse.json(
        { error: "모든 필수 항목을 입력해 주세요." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("online_applications")
        .insert({
          user_id: user?.id ?? null,
          service_id: serviceId,
          service_title: serviceTitle,
          applicant_name: applicantName,
          contact,
          note,
        })
        .select("id, service_id, service_title, applicant_name, contact, note, status, created_at")
        .single();

      if (error) {
        return NextResponse.json(
          { error: "신청 저장 중 오류가 발생했습니다: " + error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ application: data }, { status: 201 });
    }

    const sessionUser = await getSessionUser();
    const record: ApplicationRecord = {
      id: `app_${crypto.randomUUID()}`,
      user_id: sessionUser?.id ?? null,
      service_id: serviceId,
      service_title: serviceTitle,
      applicant_name: applicantName,
      contact,
      note,
      status: "접수완료",
      created_at: new Date().toISOString(),
    };

    const existing = await readLocalApplications();
    existing.unshift(record);
    await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
    await fs.writeFile(LOCAL_FILE, JSON.stringify(existing, null, 2), "utf8");

    return NextResponse.json({ application: record }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "온라인 신청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
