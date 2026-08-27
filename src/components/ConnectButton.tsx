"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from "wagmi";
import { shortAddr } from "@/lib/format";
import { robinhoodChain } from "@/lib/chain";

function walletLabel(connector: Connector) {
  const id = connector.id.toLowerCase();
  const name = connector.name;
  if (id.includes("metamask") || name.toLowerCase().includes("metamask")) {
    return { title: "MetaMask", hint: "Browser extension" };
  }
  if (id.includes("walletconnect") || name.toLowerCase().includes("walletconnect")) {
    return { title: "WalletConnect", hint: "Mobile & other wallets" };
  }
  if (id === "injected" || name.toLowerCase().includes("injected")) {
    return { title: "Browser wallet", hint: "Phantom, Rabby, Brave…" };
  }
  return { title: name, hint: "Installed wallet" };
}

export function ConnectButton() {
  const [open, setOpen] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const unique = useMemo(() => {
    const seen = new Set<string>();
    return connectors.filter((c) => {
      const key = `${c.id}:${c.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connectors]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (isConnected && chainId !== robinhoodChain.id) {
      switchChain?.({ chainId: robinhoodChain.id });
    }
  }, [isConnected, chainId, switchChain]);

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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-neon px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.08em] text-black transition-transform hover:-translate-y-px"
      >
        Connect
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[380px] border border-hairline bg-[#111] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] tracking-[0.16em] text-neon">
                  WALLET
                </div>
                <h2 className="mt-1 text-[20px] font-bold tracking-[-0.02em]">
                  Connect a wallet
                </h2>
              </div>
              <button
                type="button"
                className="font-mono text-sm text-mute hover:text-foam"
                onClick={() => setOpen(false)}
              >
                Esc
              </button>
            </div>

            <div className="mt-5 space-y-2">
              {unique.map((connector) => {
                const label = walletLabel(connector);
                return (
                  <button
                    key={`${connector.id}-${connector.name}`}
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      connect(
                        { connector, chainId: robinhoodChain.id },
                        {
                          onSuccess: () => setOpen(false),
                        },
                      );
                    }}
                    className="flex w-full items-center justify-between border border-hairline bg-black/40 px-4 py-3 text-left transition-colors hover:border-neon/50 hover:bg-white/[0.03] disabled:opacity-50"
                  >
                    <div>
                      <div className="text-[14px] font-semibold text-foam">
                        {label.title}
                      </div>
                      <div className="font-mono text-[11px] text-mute">
                        {label.hint}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-neon">→</span>
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="mt-3 text-[12px] text-red-400">
                {error.message}
              </p>
            )}

            <p className="mt-4 font-mono text-[10px] leading-relaxed text-mute">
              Robinhood Chain (4663). Prefer MetaMask or WalletConnect for EVM —
              Phantom may only appear via Browser wallet if installed.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
