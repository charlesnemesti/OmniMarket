"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { robinhoodChain } from "@/lib/chain";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "00000000000000000000000000000000";

const config = createConfig({
  chains: [robinhoodChain],
  connectors: [
    metaMask({ dappMetadata: { name: "OmniMarket" } }),
    walletConnect({
      projectId,
      metadata: {
        name: "OmniMarket",
        description: "OmniMarket on Robinhood Chain",
        url: "https://omnimarket-indol.vercel.app",
        icons: ["https://omnimarket-indol.vercel.app/icon.png"],
      },
      showQrModal: true,
    }),
    injected({
      shimDisconnect: true,
      unstable_shimAsyncInject: 2_000,
    }),
  ],
  transports: {
    [robinhoodChain.id]: http("https://rpc.mainnet.chain.robinhood.com"),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
