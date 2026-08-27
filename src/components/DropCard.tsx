import Link from "next/link";
import { Drop } from "@/lib/types";
import { fmtEth, mediaUrl, pct, timeLeft } from "@/lib/format";

export function DropCard({ drop }: { drop: Drop }) {
  const progress = pct(drop.raisedEth, drop.targetEth);
  const external = drop.source === "pons" && drop.tradeUrl;
  const href = external ? drop.tradeUrl! : `/drop/${drop.id}`;
  const cta = external ? "Trade on Pons ↗" : "Commit ETH";

  return (
    <article className="tile tile-hover flex flex-col overflow-hidden">
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="relative block aspect-[4/3] overflow-hidden border-b border-hairline"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl(drop.artworkUrl || drop.logoUrl || "/brand/logo.png")}
          alt={drop.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 chip-accent px-2 py-1 text-[10px]">
          {progress}%
        </div>
      </a>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="truncate text-[16px] font-bold tracking-[-0.02em]">
            {external ? (
              <a href={href} target="_blank" rel="noreferrer">
                {drop.name}
              </a>
            ) : (
              <Link href={href}>{drop.name}</Link>
            )}
          </div>
          <div className="mt-1 truncate font-mono text-[11px] text-mute">
            {drop.creatorHandle} · ${drop.symbol}
          </div>
        </div>
        <div className="track" style={{ height: 4 }}>
          <div className="track-fill" style={{ width: `${progress}%` }}>
            <span className="track-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between font-mono text-[11px] text-mute">
          <span>
            {fmtEth(drop.raisedEth)} / {fmtEth(drop.targetEth)} ETH
          </span>
          <span>{external ? "on curve" : timeLeft(drop.deadline)}</span>
        </div>
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="btn-accent mt-auto py-2.5 text-center text-[13px]"
          >
            {cta}
          </a>
        ) : (
          <Link
            href={href}
            className="btn-accent mt-auto py-2.5 text-center text-[13px]"
          >
            {cta}
          </Link>
        )}
      </div>
    </article>
  );
}
