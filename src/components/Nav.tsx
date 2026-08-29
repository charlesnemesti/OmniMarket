"use client";

import Image from "next/image";
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
    <header className="flex items-center justify-between gap-4 border-b border-hairline pb-4">
      <Link href="/" className="flex items-center gap-3 min-w-0">
        <Image
          src="/brand/logo.png"
          alt={`${brand.name} logo`}
          width={36}
          height={36}
          className="logo-mark h-9 w-9 rounded-md object-cover"
          priority
        />
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

      <div className="flex items-center gap-2">
        <a
          href={brand.xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow OmniMarket on X"
          className="grid h-9 w-9 place-items-center rounded-md border border-hairline text-mute transition-colors hover:border-white/20 hover:bg-white/5 hover:text-foam"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-4 w-4 fill-current"
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <ConnectButton />
      </div>
    </header>
  );
}
