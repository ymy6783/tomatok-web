import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Body = {
  walletAddress?: string;
  mints?: string[];
};

type UsageRow = {
  nft_mint: string;
  usage_count: number | null;
  usage_limit: number | null;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const walletAddress = body.walletAddress?.trim();
    const mints = (body.mints ?? []).map((v) => v.trim()).filter(Boolean);

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress가 필요합니다." }, { status: 400 });
    }
    if (mints.length === 0) {
      return NextResponse.json({ usages: {} });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("membership_cards")
      .select("nft_mint, usage_count, usage_limit")
      .eq("wallet_address", walletAddress)
      .in("nft_mint", mints);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const usages: Record<string, { usedCount: number; maxUsage: number }> = {};
    for (const row of (data ?? []) as UsageRow[]) {
      usages[row.nft_mint] = {
        usedCount: typeof row.usage_count === "number" ? row.usage_count : 0,
        maxUsage: typeof row.usage_limit === "number" ? row.usage_limit : 10,
      };
    }

    return NextResponse.json({ usages });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "요청 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
