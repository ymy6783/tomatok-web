"use client";

import { useEffect } from "react";
import {
  disposePhantomWalletStore,
  initializePhantomWalletStore,
} from "@/lib/phantom-wallet-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializePhantomWalletStore();
    return () => {
      disposePhantomWalletStore();
    };
  }, []);

  return <>{children}</>;
}
