import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { isExpired, toIso } from "@/lib/membership/authSession";

type Body = {
  sessionId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const sessionId = body.sessionId?.trim();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId가 필요합니다." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const now = new Date();

    const { data: session, error: sessionError } = await supabase
      .from("membership_auth_sessions")
      .select("id, card_id, status, expires_at")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }
    if (!session) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
    }
    if (session.status !== "issued") {
      return NextResponse.json({ error: "사용 가능한 issued 세션이 아닙니다." }, { status: 400 });
    }
    if (isExpired(session.expires_at, now)) {
      await supabase
        .from("membership_auth_sessions")
        .update({ status: "expired" })
        .eq("id", session.id)
        .eq("status", "issued");
      return NextResponse.json({ error: "세션이 만료되었습니다." }, { status: 400 });
    }

    const { data: card, error: cardError } = await supabase
      .from("membership_cards")
      .select("id, usage_count, usage_limit")
      .eq("id", session.card_id)
      .maybeSingle();

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }
    if (!card) {
      return NextResponse.json({ error: "카드를 찾을 수 없습니다." }, { status: 404 });
    }
    if ((card.usage_count ?? 0) >= (card.usage_limit ?? 10)) {
      return NextResponse.json({ error: "사용 횟수 한도를 초과했습니다." }, { status: 400 });
    }

    // 1) 세션을 used로 변경 (issued 상태일 때만)
    const { data: usedSession, error: usedError } = await supabase
      .from("membership_auth_sessions")
      .update({
        status: "used",
        used_at: toIso(now),
      })
      .eq("id", session.id)
      .eq("status", "issued")
      .select("id, card_id")
      .maybeSingle();

    if (usedError) {
      return NextResponse.json({ error: usedError.message }, { status: 500 });
    }
    if (!usedSession) {
      return NextResponse.json({ error: "세션 상태가 이미 변경되었습니다." }, { status: 409 });
    }

    // 2) 카드 사용횟수 갱신 (트랜잭션 대체를 위한 조건부 업데이트)
    const nextUsageCount = (card.usage_count ?? 0) + 1;
    const { data: updatedCard, error: updateCardError } = await supabase
      .from("membership_cards")
      .update({
        usage_count: nextUsageCount,
        last_used_at: toIso(now),
      })
      .eq("id", card.id)
      .eq("usage_count", card.usage_count)
      .select("id, usage_count")
      .maybeSingle();

    if (updateCardError || !updatedCard) {
      // 카드 증가 실패 시 세션 롤백 시도 (유사 트랜잭션 처리)
      await supabase
        .from("membership_auth_sessions")
        .update({ status: "issued", used_at: null })
        .eq("id", session.id)
        .eq("status", "used");
      return NextResponse.json(
        { error: updateCardError?.message ?? "카드 사용횟수 업데이트에 실패했습니다." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      ok: true,
      sessionId: session.id,
      usageCount: updatedCard.usage_count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
