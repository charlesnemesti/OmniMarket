import Link from "next/link";
import { Drop } from "@/lib/types";
import { fmtEth, mediaUrl, shortAddr } from "@/lib/format";

export function CrownCard({ drop }: { drop: Drop }) {
  const price = drop.crownPriceEth ?? 0;
  const days = drop.reignStart
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(drop.reignStart).getTime()) / 86_400_000,
        ),
      )
    : 0;

  return (
    <article className="card-flat card-flat-hover flex flex-col p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[15px] font-bold tracking-[-0.02em]">
            <Link href={`/drop/${drop.id}`}>{drop.name}</Link>
          </div>
          <div className="font-mono text-[11px] text-mute">${drop.symbol}</div>
          <div className="mt-3 font-mono text-[11px] text-mute">
            patron{" "}
            <span className="text-foam">
              {drop.patronHandle || shortAddr(drop.patronAddress)}
            </span>
          </div>
          <div className="font-mono text-[11px] text-mute">
            reign #{drop.reignCount || 1} · day {days}
          </div>
        </div>
        <div className="relative h-16 w-16 flex-none overflow-hidden rounded-md border border-neon/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(drop.artworkUrl || "/brand/logo.png")}
            alt={drop.name}
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-neon/50" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border border-hairline bg-black/40 px-3 py-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.14em] text-mute">
            CROWN
          </div>
          <div className="mt-1 font-mono text-[18px] font-bold text-neon">
            {fmtEth(price, 3)} ETH
          </div>
        </div>
        <div className="font-mono text-[10px] text-neon">LIVE</div>
      </div>

      <Link
        href={`/drop/${drop.id}`}
        className="btn-accent mt-3 w-full py-2.5 text-center text-[13px]"
      >
        Usurp · {fmtEth(price, 3)} ETH
      </Link>

      <div className="mt-3 flex justify-between font-mono text-[10px] text-mute">
        <span>
          {Math.max(1, drop.reignCount || 1)} rings · {fmtEth(drop.feesEarnedEth)} fees
        </span>
        <span>{fmtEth(drop.burnedPct, 1)}% burned</span>
      </div>
    </article>
  );
}
