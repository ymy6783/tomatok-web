import { NextResponse } from "next/server";
import { createTomatokHmacHeaders } from "@/lib/tomatok-hmac";

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

type LookupApiResponse = {
  code?: string | number;
  data?: unknown;
  msg?: string;
  wallet_address?: string;
  nft_mints?: unknown;
};

const DEFAULT_SAVE_API_URL = "https://ec2.tomatok.net/api/io/nft/save";

function getTomatokSecret() {
  return process.env.TOMATOK_IO_HMAC_SECRET?.trim() || process.env.TOMATOK_IO_HMAC_SECRET_BASE64?.trim();
}

function errorResponse(code: string, msg: string, status: number) {
  return NextResponse.json({ code, data: null, msg }, { status });
}

function normalizeRegisteredNfts(payload: unknown) {
  const source = payload && typeof payload === "object" ? (payload as LookupApiResponse) : {};
  const data = source.data && typeof source.data === "object" ? (source.data as LookupApiResponse) : source;
  const walletAddress = typeof data.wallet_address === "string" ? data.wallet_address : "";
  const nftMints = Array.isArray(data.nft_mints)
    ? data.nft_mints.map((value) => (typeof value === "string" ? value.trim() : "")).filter(Boolean)
    : [];

  return {
    walletAddress,
    nftMints,
    msg: typeof source.msg === "string" ? source.msg : "",
    code: source.code,
  };
}

export async function GET(req: Request) {
  try {
    const requestUrl = new URL(req.url);
    const walletAddress = requestUrl.searchParams.get("wallet_address")?.trim() ?? "";

    if (!walletAddress) {
      return errorResponse("INVALID_WALLET_ADDRESS", "wallet_address가 필요합니다.", 400);
    }

    const saveApiUrl = process.env.MEMBERSHIP_SAVE_API_URL ?? DEFAULT_SAVE_API_URL;
    const secret = getTomatokSecret();

    if (!secret) {
      return errorResponse("MISSING_HMAC_SECRET", "TOMATOK_IO_HMAC_SECRET가 설정되어 있지 않습니다.", 500);
    }

    const upstreamUrl = new URL(saveApiUrl);
    upstreamUrl.searchParams.set("wallet_address", walletAddress);

    const hmacHeaders = createTomatokHmacHeaders({
      method: "GET",
      path: upstreamUrl.pathname,
      body: "",
      secret,
    });

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        ...hmacHeaders,
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return errorResponse(
        "UPSTREAM_ERROR",
        text || "등록 NFT 조회에 실패했습니다.",
        response.status
      );
    }

    const data = (await response.json()) as LookupApiResponse;
    const normalized = normalizeRegisteredNfts(data);

    if (!response.ok) {
      return NextResponse.json(
        {
          code: normalized.code ?? "UPSTREAM_ERROR",
          data: null,
          msg: normalized.msg || "등록 NFT 조회에 실패했습니다.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        walletAddress: normalized.walletAddress,
        nftMints: normalized.nftMints,
      },
      { status: response.status }
    );
  } catch (error) {
    return errorResponse(
      "LOOKUP_REQUEST_FAILED",
      error instanceof Error ? error.message : "등록 NFT 조회 중 오류가 발생했습니다.",
      500
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const nftMint = body.nft_mint?.trim() || body.nftMint?.trim();
    const walletAddress = body.wallet_address?.trim() || body.walletAddress?.trim();

    if (!nftMint) {
      return errorResponse("INVALID_NFT_MINT", "nftMint가 필요합니다.", 400);
    }

    if (!walletAddress) {
      return errorResponse("INVALID_WALLET_ADDRESS", "walletAddress가 필요합니다.", 400);
    }

    const saveApiUrl = process.env.MEMBERSHIP_SAVE_API_URL ?? DEFAULT_SAVE_API_URL;
    const secret = getTomatokSecret();

    if (!secret) {
      return errorResponse("MISSING_HMAC_SECRET", "TOMATOK_IO_HMAC_SECRET가 설정되어 있지 않습니다.", 500);
    }

    const payload = JSON.stringify({
      nft_mint: nftMint,
      wallet_address: walletAddress,
    });
    const path = new URL(saveApiUrl).pathname;
    const hmacHeaders = createTomatokHmacHeaders({
      method: "POST",
      path,
      body: payload,
      secret,
    });

    const response = await fetch(saveApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...hmacHeaders,
      },
      body: payload,
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
