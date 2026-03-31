import { NextResponse } from "next/server";

type RpcErrorResponse = {
  error?: {
    message?: string;
  };
};

const ALCHEMY_SOLANA_RPC_BASE_URL = "https://solana-mainnet.g.alchemy.com/v2";

function getAlchemyRpcUrl() {
  const directUrl = process.env.ALCHEMY_SOLANA_RPC_URL?.trim();
  if (directUrl) return directUrl;

  const apiKey = process.env.ALCHEMY_SOLANA_RPC_API_KEY?.trim();
  if (!apiKey) return "";

  return `${ALCHEMY_SOLANA_RPC_BASE_URL}/${apiKey}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const ownerAddress = requestUrl.searchParams.get("ownerAddress")?.trim() ?? "";

  if (!ownerAddress) {
    return NextResponse.json(
      { error: { message: "ownerAddress가 필요합니다." } },
      { status: 400 }
    );
  }

  const rpcUrl = getAlchemyRpcUrl();
  if (!rpcUrl) {
    return NextResponse.json(
      { error: { message: "ALCHEMY_SOLANA_RPC_API_KEY 또는 ALCHEMY_SOLANA_RPC_URL이 설정되어 있지 않습니다." } },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "membership-nft-check",
        method: "getAssetsByOwner",
        params: {
          ownerAddress,
          page: 1,
          limit: 1000,
          options: {
            showFungible: false,
            showZeroBalance: false,
          },
        },
      }),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        { error: { message: text || `Alchemy RPC 요청 실패 (${response.status})` } },
        { status: response.status }
      );
    }

    const payload = (await response.json()) as RpcErrorResponse;

    if (!response.ok) {
      return NextResponse.json(
        {
          error: {
            message: payload.error?.message || `Alchemy RPC 요청 실패 (${response.status})`,
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "NFT 조회 중 오류가 발생했습니다.",
        },
      },
      { status: 500 }
    );
  }
}
