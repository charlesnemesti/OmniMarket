"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortAddr } from "@/lib/format";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const injected = connectors.find((c) => c.id === "injected") || connectors[0];

  if (isConnected && address) {
    return (
      <button
        type="button"
        onClick={() => disconnect()}
        className="flex cursor-pointer items-center gap-2 rounded-md border border-hairline bg-panel px-3 py-2 font-mono text-xs text-foam transition-colors hover:border-neon/50"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-neon" />
        {shortAddr(address)}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending || !injected}
      onClick={() => injected && connect({ connector: injected })}
      className="rounded-md bg-neon px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-black transition-transform hover:-translate-y-px"
    >
      {isPending ? "…" : "Connect"}
    </button>
  );
}
