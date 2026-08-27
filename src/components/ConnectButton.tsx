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

function isWalletConnect(c: Connector) {
  const id = c.id.toLowerCase();
  const name = c.name.toLowerCase();
  return id.includes("walletconnect") || name.includes("walletconnect");
}

function isMetaMask(c: Connector) {
  const id = c.id.toLowerCase();
  const name = c.name.toLowerCase();
  const raw = (c as Connector & { rdns?: string | string[] }).rdns;
  const rdns = Array.isArray(raw)
    ? raw.join(" ").toLowerCase()
    : typeof raw === "string"
      ? raw.toLowerCase()
      : "";
  return (
    id.includes("metamask") ||
    name.includes("metamask") ||
    rdns.includes("metamask")
  );
}

function WalletIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  const icons: Record<string, string> = {
    metamask:
      "https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg",
    phantom: "https://phantom.app/img/phantom-icon-purple.png",
    rainbow:
      "https://raw.githubusercontent.com/rainbow-me/rainbowkit/main/packages/rainbowkit/src/wallets/walletConnectors/rainbowWallet/rainbowWallet.svg",
    walletconnect:
      "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg",
    base: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
    tronlink:
      "https://raw.githubusercontent.com/tronprotocol/documentation/master/images/tron.png",
  };

  let src = "";
  if (n.includes("metamask")) src = icons.metamask;
  else if (n.includes("phantom")) src = icons.phantom;
  else if (n.includes("rainbow")) src = icons.rainbow;
  else if (n.includes("walletconnect")) src = icons.walletconnect;
  else if (n.includes("base")) src = icons.base;
  else if (n.includes("tron")) src = icons.tronlink;

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className="h-9 w-9 flex-none rounded-[10px] object-cover"
      />
    );
  }

  return (
    <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#E8ECF0] text-[13px] font-bold text-[#25292E]">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function WalletRow({
  name,
  onClick,
  disabled,
  active,
}: {
  name: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors disabled:opacity-50 ${
        active ? "bg-[#F0F2F5]" : "hover:bg-[#F5F6F8]"
      }`}
    >
      <WalletIcon name={name} />
      <span className="text-[15px] font-bold text-[#25292E]">{name}</span>
    </button>
  );
}

export function ConnectButton() {
  const [open, setOpen] = useState(false);
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const { installed, popular } = useMemo(() => {
    const seen = new Set<string>();
    const list = connectors.filter((c) => {
      const key = `${c.id}:${c.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const wc = list.filter(isWalletConnect);
    const mm = list.filter(isMetaMask);
    const injectedish = list.filter(
      (c) => !isWalletConnect(c) && c.type === "injected",
    );

    // Prefer EIP-6963 injected wallets as "Installed"
    const installedList =
      injectedish.length > 0
        ? injectedish
        : mm.filter((c) => c.type === "injected");

    const installedIds = new Set(installedList.map((c) => c.id));
    const popularList: { name: string; connector?: Connector; href?: string }[] =
      [];

    if (!installedList.some(isMetaMask) && mm[0]) {
      popularList.push({ name: "MetaMask", connector: mm[0] });
    }

    popularList.push({
      name: "Rainbow",
      href: "https://rainbow.me/download",
    });
    popularList.push({
      name: "Base",
      href: "https://www.base.org/eth",
    });

    if (wc[0]) {
      popularList.push({ name: "WalletConnect", connector: wc[0] });
    }

    // If MetaMask connector exists and not already shown in installed, keep for popular connect
    if (!installedIds.has(mm[0]?.id || "") && mm[0] && !popularList.some((p) => p.name === "MetaMask")) {
      popularList.unshift({ name: "MetaMask", connector: mm[0] });
    }

    return { installed: installedList, popular: popularList };
  }, [connectors]);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative grid w-full max-w-[720px] overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.28)] max-md:max-w-[420px] md:grid-cols-[280px_1fr]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Connect a Wallet"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/5 text-[18px] text-[#25292E] hover:bg-black/10"
              aria-label="Close"
            >
              ×
            </button>

            {/* Left: wallet list */}
            <div className="border-b border-black/5 bg-[#F6F7F9] p-5 md:border-b-0 md:border-r">
              <h2 className="pr-8 text-[18px] font-bold tracking-[-0.02em] text-[#25292E]">
                Connect a Wallet
              </h2>

              <div className="mt-5">
                <div className="px-1 text-[12px] font-bold text-[#91959C]">
                  Installed
                </div>
                <div className="mt-1 space-y-0.5">
                  {installed.length === 0 && (
                    <div className="px-3 py-3 text-[13px] text-[#91959C]">
                      No browser wallets detected
                    </div>
                  )}
                  {installed.map((c) => (
                    <WalletRow
                      key={`${c.id}-${c.name}`}
                      name={c.name}
                      disabled={isPending}
                      onClick={() =>
                        connect(
                          { connector: c, chainId: robinhoodChain.id },
                          { onSuccess: () => setOpen(false) },
                        )
                      }
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="px-1 text-[12px] font-bold text-[#91959C]">
                  Popular
                </div>
                <div className="mt-1 space-y-0.5">
                  {popular.map((p) => (
                    <WalletRow
                      key={p.name}
                      name={p.name}
                      disabled={isPending}
                      onClick={() => {
                        if (p.href && !p.connector) {
                          window.open(p.href, "_blank", "noreferrer");
                          return;
                        }
                        if (p.connector) {
                          connect(
                            {
                              connector: p.connector,
                              chainId: robinhoodChain.id,
                            },
                            { onSuccess: () => setOpen(false) },
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="mt-3 px-1 text-[12px] text-red-500">
                  {error.message}
                </p>
              )}
            </div>

            {/* Right: explainer */}
            <div className="flex flex-col items-center justify-between gap-8 px-8 py-10 text-center max-md:hidden">
              <div className="w-full max-w-[340px]">
                <h3 className="text-[18px] font-bold text-[#25292E]">
                  What is a Wallet?
                </h3>

                <div className="mt-10 flex gap-4 text-left">
                  <div className="relative h-14 w-14 flex-none overflow-hidden rounded-2xl bg-gradient-to-br from-[#B8F3C8] via-[#7ED4FF] to-[#C9B6FF]">
                    <div className="absolute inset-2 rounded-xl bg-white/80" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#25292E]">
                      A Home for your Digital Assets
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-[#6B7280]">
                      Wallets are used to send, receive, store, and display
                      digital assets like Ethereum and NFTs.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 text-left">
                  <div className="relative h-14 w-14 flex-none overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFB4E0] via-[#FFD28A] to-[#8BE9A8]">
                    <div className="absolute inset-2 rounded-xl bg-white/70" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#25292E]">
                      A New Way to Log In
                    </div>
                    <p className="mt-1 text-[13px] leading-snug text-[#6B7280]">
                      Instead of creating new accounts and passwords on every
                      website, just connect your wallet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[280px]">
                <a
                  href="https://ethereum.org/wallets/find-wallet/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#1E4634] px-6 py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
                >
                  Get a Wallet
                </a>
                <a
                  href="https://ethereum.org/wallets/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-[14px] font-semibold text-[#1E4634] hover:underline"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
