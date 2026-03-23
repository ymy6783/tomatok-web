import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isExpired } from "@/lib/membership/authSession";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "세션 id가 필요합니다." }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: session, error } = await supabase
      .from("membership_auth_sessions")
      .select("id, status, expires_at, used_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!session) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
    }

    let status = session.status;
    if (status === "issued" && isExpired(session.expires_at)) {
      const { error: updateError } = await supabase
        .from("membership_auth_sessions")
        .update({ status: "expired" })
        .eq("id", id)
        .eq("status", "issued");
      if (!updateError) status = "expired";
    }

    return NextResponse.json({
      status,
      expiresAt: session.expires_at,
      usedAt: session.used_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
