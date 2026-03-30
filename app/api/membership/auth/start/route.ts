import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  AUTH_SESSION_MINUTES,
  DEFAULT_USAGE_LIMIT,
  addMinutes,
  createAuthCode,
  toIso,
} from "@/lib/membership/authSession";

type StartBody = {
  walletAddress?: string;
  nftMint?: string;
  membershipLevel?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StartBody;
    const walletAddress = body.walletAddress?.trim();
    const nftMint = body.nftMint?.trim();
    const membershipLevel = body.membershipLevel?.trim() ?? null;

    if (!walletAddress || !nftMint) {
      return NextResponse.json({ error: "walletAddress와 nftMint가 필요합니다." }, { status: 400 });
    }

    const supabase = createServiceRoleClient();
    const now = new Date();

    // 카드 조회 (없으면 기본값으로 등록)
    const { data: initialCard, error: cardError } = await supabase
      .from("membership_cards")
      .select("id, wallet_address, nft_mint, membership_level, usage_count, usage_limit, status")
      .eq("wallet_address", walletAddress)
      .eq("nft_mint", nftMint)
      .maybeSingle();

    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }

    let card = initialCard;

    if (!card) {
      const { data: created, error: createError } = await supabase
        .from("membership_cards")
        .insert({
          wallet_address: walletAddress,
          nft_mint: nftMint,
          membership_level: membershipLevel,
          usage_count: 0,
          usage_limit: DEFAULT_USAGE_LIMIT,
          status: "active",
        })
        .select("id, wallet_address, nft_mint, membership_level, usage_count, usage_limit, status")
        .single();

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      card = created;
    }

    if ((card.usage_count ?? 0) >= (card.usage_limit ?? DEFAULT_USAGE_LIMIT)) {
      return NextResponse.json({ error: "사용 가능한 횟수를 모두 소진했습니다." }, { status: 400 });
    }

    // 만료된 issued 세션 정리
    await supabase
      .from("membership_auth_sessions")
      .update({ status: "expired" })
      .eq("card_id", card.id)
      .eq("status", "issued")
      .lt("expires_at", toIso(now));

    // 기존 issued 세션 재사용
    const { data: existing, error: existingError } = await supabase
      .from("membership_auth_sessions")
      .select("id, auth_code, expires_at, status")
      .eq("card_id", card.id)
      .eq("status", "issued")
      .gt("expires_at", toIso(now))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({
        sessionId: existing.id,
        authCode: existing.auth_code,
        expiresAt: existing.expires_at,
      });
    }

    const expiresAt = addMinutes(now, AUTH_SESSION_MINUTES);
    let inserted:
      | { id: string; auth_code: string; expires_at: string }
      | null = null;

    // unique auth_code 충돌 대비 재시도
    for (let i = 0; i < 3; i += 1) {
      const authCode = createAuthCode();
      const { data, error } = await supabase
        .from("membership_auth_sessions")
        .insert({
          card_id: card.id,
          wallet_address: walletAddress,
          auth_code: authCode,
          status: "issued",
          expires_at: toIso(expiresAt),
        })
        .select("id, auth_code, expires_at")
        .single();

      if (!error && data) {
        inserted = data;
        break;
      }

      if (error && i === 2) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    if (!inserted) {
      return NextResponse.json({ error: "인증 세션 생성에 실패했습니다." }, { status: 500 });
    }

    return NextResponse.json({
      sessionId: inserted.id,
      authCode: inserted.auth_code,
      expiresAt: inserted.expires_at,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
