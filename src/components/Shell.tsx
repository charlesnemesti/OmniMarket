import Link from "next/link";
import { Nav } from "./Nav";
import { brand } from "@/lib/brand";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-black text-foam">
      <div className="rh-grid" />
      <div className="rh-glow" />
      <div className="relative mx-auto max-w-[1200px] px-5 pb-20 pt-6 md:px-8">
        <Nav />
        {children}
        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <div className="font-mono text-[11px] tracking-[0.12em] text-mute">
            {brand.footer}
          </div>
          <div className="flex gap-5 text-[13px] text-mute">
            <Link className="hover:text-neon" href="/docs">
              Docs
            </Link>
            <Link className="hover:text-neon" href="/">
              Market
            </Link>
            <Link className="hover:text-neon" href="/graduated">
              Launches
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
