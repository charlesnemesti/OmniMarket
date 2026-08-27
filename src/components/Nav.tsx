"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/ConnectButton";
import { brand } from "@/lib/brand";

const links = [
  { href: "/", label: "Market" },
  { href: "/court", label: "Court" },
  { href: "/graduated", label: "Launches" },
  { href: "/create", label: "Create" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between gap-4 border-b border-hairline pb-4 animate-rise">
      <Link href="/" className="flex items-center gap-3 min-w-0">
        <span className="logo-mark grid h-9 w-9 place-items-center rounded-md text-[13px]">
          OM
        </span>
        <div className="min-w-0">
          <div className="truncate text-[18px] font-bold tracking-[-0.03em] text-foam">
            {brand.name}
          </div>
          <div className="font-mono text-[10px] tracking-[0.14em] text-mute">
            {brand.chip}
          </div>
        </div>
      </Link>

      <nav className="hidden items-center gap-1 md:flex">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                active
                  ? "nav-on bg-neon"
                  : "text-mute hover:bg-white/5 hover:text-foam"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <ConnectButton />
    </header>
  );
}
