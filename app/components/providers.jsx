"use client";
import React from "react";

import { SessionProvider } from "next-auth/react";
import { AppContextProvider } from "./AppContext";
import SolanaWalletProvider from "./WalletProvider";

function AppProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      <SolanaWalletProvider>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </SolanaWalletProvider>
    </SessionProvider>
  );
}

export default AppProvider;
