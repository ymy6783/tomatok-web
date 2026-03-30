import { NextResponse } from "next/server";

type Body = {
  nft_mint?: string;
  wallet_address?: string;
  nftMint?: string;
  walletAddress?: string;
};

type SaveApiResponse = {
  code?: string;
  data?: unknown;
  msg?: string;
};

const DEFAULT_SAVE_API_URL = "https://ec2.tomatok.net/api/io/nft/save";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const nftMint = body.nft_mint?.trim() || body.nftMint?.trim();
    const walletAddress = body.wallet_address?.trim() || body.walletAddress?.trim();

    if (!nftMint) {
      return NextResponse.json({ code: "INVALID_NFT_MINT", data: null, msg: "nftMint가 필요합니다." }, { status: 400 });
    }

    if (!walletAddress) {
      return NextResponse.json(
        { code: "INVALID_WALLET_ADDRESS", data: null, msg: "walletAddress가 필요합니다." },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.MEMBERSHIP_SAVE_API_URL ?? DEFAULT_SAVE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nft_mint: nftMint,
        wallet_address: walletAddress,
      }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = (await response.json()) as SaveApiResponse;
      return NextResponse.json(
        {
          code: data.code ?? (response.ok ? "SUCCESS" : "UPSTREAM_ERROR"),
          data: data.data ?? null,
          msg: data.msg ?? (response.ok ? "NFT 보관 요청이 완료되었습니다." : "NFT 보관 요청에 실패했습니다."),
        },
        { status: response.status }
      );
    }

    const text = await response.text();
    return NextResponse.json(
      {
        code: response.ok ? "SUCCESS" : "UPSTREAM_ERROR",
        data: null,
        msg: text || (response.ok ? "NFT 보관 요청이 완료되었습니다." : "NFT 보관 요청에 실패했습니다."),
      },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      {
        code: "SAVE_REQUEST_FAILED",
        data: null,
        msg: error instanceof Error ? error.message : "NFT 보관 요청 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
