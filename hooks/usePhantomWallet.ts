"use client";

import { useSyncExternalStore } from "react";
import {
  clearPhantomWalletError,
  connectPhantomWallet,
  getPhantomWalletServerSnapshot,
  getPhantomWalletSnapshot,
  subscribePhantomWallet,
} from "@/lib/phantom-wallet-store";

export function usePhantomWallet() {
  const state = useSyncExternalStore(
    subscribePhantomWallet,
    getPhantomWalletSnapshot,
    getPhantomWalletServerSnapshot
  );

  return {
    ...state,
    clearError: clearPhantomWalletError,
    connect: connectPhantomWallet,
  };
}
