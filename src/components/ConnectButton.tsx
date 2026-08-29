"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

  if (n.includes("metamask")) {
    // Official MetaMask fox mark (brand paths), scaled for the modal icon slot.
    return (
      <span className="grid h-9 w-9 flex-none place-items-center overflow-hidden rounded-[10px] bg-[#F6851B]">
        <svg
          viewBox="0 0 318.6 318.6"
          className="h-9 w-9"
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#E2761B"
            stroke="#E2761B"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m274.1 35.5-99.5 73.9L193 65.8z"
          />
          <path
            fill="#E2761B"
            stroke="#E2761B"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m44.4 35.5 98.7 74.6-17.5-44.3zm193.9 171.3-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9 16.2 55.3 56.7-15.6-26.5-40.6z"
          />
          <path
            fill="#E2761B"
            stroke="#E2761B"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m103.6 138.2-15.8 23.9 56.3 2.5-2-60.5zm111.3 0-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5 33.9 16.5-4.7-39.3z"
          />
          <path
            fill="#D7C1B3"
            stroke="#D7C1B3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m211.8 247.4-33.9-16.5 2.7 22.2-.3 9.3zm-106.9 0 31.5 15 -.2-9.3 2.5-22.2z"
          />
          <path
            fill="#233447"
            stroke="#233447"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m138.8 193.5-28-6.9 19.8-9.1zm40.9 0 8.2-16 19.9 9.1z"
          />
          <path
            fill="#CD6116"
            stroke="#CD6116"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m106.8 247.4 4.8-40.6-31.3.9zm71.2-40.6 4.8 40.6 26.5-39.7zm47.8-44.7-56.2 2.5 5.2 28.9 8.3-16 19.8 9.1zm-120.9 24.5 19.9-9.1 8.2 16 5.3-28.9-56.3-2.5z"
          />
          <path
            fill="#E4751F"
            stroke="#E4751F"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m87.8 162.1 23.6 46-.1-22.9zm120.9 23.1-1.1 22.9 23.7-46zm-64 4-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0-2.7 18 1.2 45 6.7-34.1z"
          />
          <path
            fill="#F6851B"
            stroke="#F6851B"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m179.8 193.5 6.7 34.1 4.8 33.3 1.3-9.3 2.7-22.2zm-41 35.9 2.6 22.2 1.2 9.3 4.9-33.3 6.6-34.1zm71.1-75.1-.5-27.6 15.9-23.9zm-120.9-51.5 15.9 23.9-.4 27.6z"
          />
          <path
            fill="#C0AD9E"
            stroke="#C0AD9E"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m180.3 262.4.3-9.3-2.5-.5h-37.7l-2.3.5.2 9.3-31.5-15 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
          />
          <path
            fill="#161616"
            stroke="#161616"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m181.7 227.6-4.9-33.3-6.7 34.1zm-40.9-33.3-4.8 33.3 11.6-.8z"
          />
          <path
            fill="#763D16"
            stroke="#763D16"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m278.3 114.2 8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
          />
          <path
            fill="#F6851B"
            stroke="#F6851B"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m267.2 153.5-52.3-15.3 15.9 23.9-23.7 46 31.6-.4h47.1zm-156.1-15.3-52.3 15.3-18.6 54.2h47.1l31.6.4-23.7-46zm71 26.4 3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
          />
        </svg>
      </span>
    );
  }

  if (n.includes("walletconnect")) {
    return (
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#3396FF]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="#fff"
            d="M7.2 9.4c2.7-2.6 7-2.6 9.7 0l.3.3c.1.1.1.3 0 .4l-1.1 1.1c-.1.1-.2.1-.3 0l-.4-.4c-1.9-1.8-4.9-1.8-6.8 0l-.5.4c-.1.1-.2.1-.3 0L6.8 10c-.1-.1-.1-.3 0-.4l.4-.2zm12 2.3 1 1c.1.1.1.3 0 .4l-4.4 4.3c-.1.1-.3.1-.4 0l-3.1-3.1c0-.1-.1-.1-.1 0l-3.1 3.1c-.1.1-.3.1-.4 0L4 13.1c-.1-.1-.1-.3 0-.4l1-1c.1-.1.3-.1.4 0l3.1 3.1c0 .1.1.1.1 0l3.1-3.1c.1-.1.3-.1.4 0l3.1 3.1c0 .1.1.1.1 0l3.1-3.1c.2-.1.3-.1.4 0z"
          />
        </svg>
      </span>
    );
  }

  if (n.includes("rainbow")) {
    return (
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#001E59]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#FF4000" d="M4 14a8 8 0 0 1 16 0h-2.5a5.5 5.5 0 0 0-11 0H4z" />
          <path fill="#FFAD00" d="M6.5 14a5.5 5.5 0 0 1 11 0H15a3 3 0 0 0-6 0H6.5z" />
          <path fill="#00CE3C" d="M9 14a3 3 0 0 1 6 0h-6z" />
        </svg>
      </span>
    );
  }

  if (n.includes("base")) {
    return (
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#0052FF]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <circle cx="12" cy="12" r="8" fill="#fff" />
          <circle cx="12" cy="12" r="4.5" fill="#0052FF" />
        </svg>
      </span>
    );
  }

  if (n.includes("phantom")) {
    return (
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-[#AB9FF2]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="#fff"
            d="M12 3c5 0 9 3.6 9 9.2 0 3.4-1.6 5.6-3.4 6.8-.4.3-.9 0-.9-.5v-2.2c0-2.4-1.3-3.5-3.2-3.5H10c-2.8 0-4.5 1.8-4.5 4.6v1.1c0 .5-.4.8-.9.5C2.9 17.8 3 14.6 3 12.2 3 6.6 7 3 12 3zm-1.2 7.2a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8zm4.8 0a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8z"
          />
        </svg>
      </span>
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
}: {
  name: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F0F2F5] disabled:opacity-50"
    >
      <WalletIcon name={name} />
      <span className="text-[15px] font-bold text-[#25292E]">{name}</span>
    </button>
  );
}

function ConnectModal({
  open,
  onClose,
  installed,
  popular,
  isPending,
  error,
  onConnect,
}: {
  open: boolean;
  onClose: () => void;
  installed: Connector[];
  popular: { name: string; connector?: Connector; href?: string }[];
  isPending: boolean;
  error: Error | null;
  onConnect: (connector: Connector) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="wallet-modal-root fixed inset-0 flex items-center justify-center bg-black/55 p-4"
      style={{ zIndex: 2147483000 }}
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-[720px] overflow-hidden rounded-[24px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.35)] max-md:max-w-[420px] md:grid-cols-[280px_1fr]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Connect a Wallet"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/5 text-[18px] leading-none text-[#25292E] hover:bg-black/10"
          aria-label="Close"
        >
          ×
        </button>

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
                  onClick={() => onConnect(c)}
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
                    if (p.connector) onConnect(p.connector);
                  }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="mt-3 px-1 text-[12px] text-red-500">{error.message}</p>
          )}
        </div>

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
                  Wallets are used to send, receive, store, and display digital
                  assets like Ethereum and NFTs.
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
    </div>,
    document.body,
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

    const installedList =
      injectedish.length > 0
        ? injectedish
        : mm.filter((c) => c.type === "injected");

    const popularList: { name: string; connector?: Connector; href?: string }[] =
      [];

    if (!installedList.some(isMetaMask) && mm[0]) {
      popularList.push({ name: "MetaMask", connector: mm[0] });
    }

    popularList.push({ name: "Rainbow", href: "https://rainbow.me/download" });
    popularList.push({ name: "Base", href: "https://www.base.org/eth" });

    if (wc[0]) {
      popularList.push({ name: "WalletConnect", connector: wc[0] });
    }

    return { installed: installedList, popular: popularList };
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

      <ConnectModal
        open={open}
        onClose={() => setOpen(false)}
        installed={installed}
        popular={popular}
        isPending={isPending}
        error={error}
        onConnect={(connector) =>
          connect(
            { connector, chainId: robinhoodChain.id },
            { onSuccess: () => setOpen(false) },
          )
        }
      />
    </>
  );
}
