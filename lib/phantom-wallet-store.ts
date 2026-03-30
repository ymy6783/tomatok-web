"use client";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: { toString: () => string } | null;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: { toString: () => string };
  }>;
  on?: (event: "connect" | "disconnect" | "accountChanged", handler: () => void) => void;
  off?: (event: "connect" | "disconnect" | "accountChanged", handler: () => void) => void;
};

type PhantomProviderErrorLike = {
  code?: number;
  message?: string;
};

export type PhantomWalletState = {
  mounted: boolean;
  isPhantomInstalled: boolean;
  walletAddress: string;
  connecting: boolean;
  error: string;
};

const INITIAL_STATE: PhantomWalletState = {
  mounted: false,
  isPhantomInstalled: false,
  walletAddress: "",
  connecting: false,
  error: "",
};

let state = INITIAL_STATE;
const listeners = new Set<() => void>();
let initialized = false;
let cleanupProviderListeners: (() => void) | null = null;

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: Partial<PhantomWalletState>) {
  state = { ...state, ...nextState };
  emitChange();
}

function getProvider(): PhantomProvider | undefined {
  if (typeof window === "undefined") return undefined;
  return window.solana;
}

function getAddressFromProvider(provider?: PhantomProvider): string {
  return provider?.publicKey?.toString?.() ?? "";
}

function getNormalizedPhantomErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error.trim().toLowerCase();
  }
  if (!error || typeof error !== "object") return "";

  const { message } = error as PhantomProviderErrorLike;
  return typeof message === "string" ? message.trim().toLowerCase() : "";
}

function isUserRejectedPhantomRequest(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const { code } = error as PhantomProviderErrorLike;
  const normalizedMessage = getNormalizedPhantomErrorMessage(error);

  return (
    code === 4001 ||
    normalizedMessage.includes("user rejected") ||
    normalizedMessage.includes("rejected the request") ||
    normalizedMessage.includes("user cancelled") ||
    normalizedMessage.includes("cancelled") ||
    normalizedMessage.includes("declined")
  );
}

function getReadablePhantomErrorMessage(error: unknown): string {
  const normalizedMessage = getNormalizedPhantomErrorMessage(error);

  if (
    normalizedMessage.includes("unexpected error") ||
    normalizedMessage.includes("not connected") ||
    normalizedMessage.includes("not logged in") ||
    normalizedMessage.includes("disconnected") ||
    normalizedMessage.includes("locked") ||
    normalizedMessage.includes("unauthorized")
  ) {
    return "Phantom에서 지갑 로그인을 완료한 뒤 다시 시도해 주세요.";
  }

  return "지갑 연결에 실패했습니다. Phantom 상태를 확인한 뒤 다시 시도해 주세요.";
}

function refreshWalletState() {
  const provider = getProvider();
  setState({
    mounted: true,
    isPhantomInstalled: !!provider?.isPhantom,
    walletAddress: getAddressFromProvider(provider),
  });
}

async function restoreTrustedConnection(provider: PhantomProvider) {
  try {
    await provider.connect({ onlyIfTrusted: true });
  } catch {
    // already disconnected or not yet trusted
  } finally {
    refreshWalletState();
  }
}

export function initializePhantomWalletStore() {
  if (typeof window === "undefined" || initialized) return;

  initialized = true;
  refreshWalletState();

  const provider = getProvider();
  if (!provider) return;

  void restoreTrustedConnection(provider);

  const syncFromProvider = () => {
    refreshWalletState();
  };

  provider.on?.("connect", syncFromProvider);
  provider.on?.("disconnect", syncFromProvider);
  provider.on?.("accountChanged", syncFromProvider);

  cleanupProviderListeners = () => {
    provider.off?.("connect", syncFromProvider);
    provider.off?.("disconnect", syncFromProvider);
    provider.off?.("accountChanged", syncFromProvider);
  };
}

export function subscribePhantomWallet(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPhantomWalletSnapshot() {
  return state;
}

export function getPhantomWalletServerSnapshot() {
  return INITIAL_STATE;
}

export function clearPhantomWalletError() {
  if (!state.error) return;
  setState({ error: "" });
}

export async function connectPhantomWallet(): Promise<boolean> {
  setState({ error: "" });

  const provider = getProvider();
  if (!provider?.isPhantom) {
    setState({
      mounted: true,
      isPhantomInstalled: false,
      error: "Phantom 지갑이 설치되어 있지 않습니다. Phantom 확장 프로그램을 설치해 주세요.",
    });
    return false;
  }

  try {
    setState({ connecting: true });
    const response = await provider.connect();
    const walletAddress = response?.publicKey?.toString?.() ?? "";

    if (!walletAddress) {
      setState({
        isPhantomInstalled: true,
        walletAddress: "",
        error: "지갑 주소를 가져오지 못했습니다.",
      });
      return false;
    }

    setState({
      mounted: true,
      isPhantomInstalled: true,
      walletAddress,
      error: "",
    });
    return true;
  } catch (error) {
    if (isUserRejectedPhantomRequest(error)) {
      return false;
    }

    setState({
      mounted: true,
      isPhantomInstalled: true,
      error: getReadablePhantomErrorMessage(error),
    });
    return false;
  } finally {
    setState({ connecting: false });
    refreshWalletState();
  }
}

export function disposePhantomWalletStore() {
  cleanupProviderListeners?.();
  cleanupProviderListeners = null;
  initialized = false;
}
