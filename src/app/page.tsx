import Link from "next/link";
import { Shell } from "@/components/Shell";
import { DropCard } from "@/components/DropCard";
import { CrownCard } from "@/components/CrownCard";
import { brand } from "@/lib/brand";
import { computeStats, fetchDrops, partitionDrops } from "@/lib/drops";
import { fmtEth, fmtUsdCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const drops = await fetchDrops();
  const { bidding, onCurve, crowns } = partitionDrops(drops);
  const stats = computeStats(drops);

  const statItems = [
    { label: "Committed", value: `${fmtEth(stats.committed)} ETH` },
    { label: "Launches", value: String(stats.launches) },
    { label: "24h volume", value: fmtUsdCompact(stats.volume) },
    { label: "Coups", value: String(stats.coups) },
    { label: "LP locked", value: `${fmtEth(stats.lpLocked)} ETH` },
  ];

  return (
    <Shell>
      {/* Hero: brand-first, modular — not PonSea centered soft hero */}
      <section className="mt-10 grid gap-10 md:grid-cols-[1.35fr_0.65fr] md:items-end">
        <div>
          <div
            className="eyebrow animate-rise"
            style={{ animationDelay: "0.05s" }}
          >
            Robinhood Chain · 4663
          </div>
          <h1
            className="mt-4 animate-rise text-[52px] font-bold leading-[0.95] tracking-[-0.05em] md:text-[72px]"
            style={{ animationDelay: "0.12s" }}
          >
            <span className="animate-neon text-neon">{brand.name}</span>
          </h1>
          <p
            className="mt-4 max-w-[34ch] animate-rise text-[22px] font-medium leading-tight tracking-[-0.02em] text-foam md:text-[28px]"
            style={{ animationDelay: "0.2s" }}
          >
            {brand.tagline}
          </p>
          <p
            className="mt-4 max-w-[48ch] animate-rise text-[15px] leading-relaxed text-mute"
            style={{ animationDelay: "0.28s" }}
          >
            {brand.description}
          </p>
          <div
            className="mt-7 flex flex-wrap gap-3 animate-rise"
            style={{ animationDelay: "0.36s" }}
          >
            <a href="#live" className="btn-primary px-6 py-3 text-[14px]">
              Browse market
            </a>
            <Link href="/docs" className="btn-ghost px-6 py-3 text-[14px]">
              Mechanics
            </Link>
          </div>
        </div>

        <div
          className="animate-rise border border-hairline bg-panel p-5"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="font-mono text-[10px] tracking-[0.16em] text-neon">
            FLOW
          </div>
          <ol className="mt-4 space-y-3 font-mono text-[12px] text-mute">
            <li className="flex gap-3">
              <span className="text-neon">01</span> Commit ETH to escrow
            </li>
            <li className="flex gap-3">
              <span className="text-neon">02</span> Hit threshold → settle
            </li>
            <li className="flex gap-3">
              <span className="text-neon">03</span> Token launches on Pons
            </li>
            <li className="flex gap-3">
              <span className="text-neon">04</span> Crown earns fee stream
            </li>
          </ol>
        </div>
      </section>

      <div className="section-rule mt-12" />

      <section className="mt-0 grid grid-cols-2 border-x border-b border-hairline md:grid-cols-5">
        {statItems.map((s) => (
          <div key={s.label} className="stat-cell border-r border-hairline last:border-r-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
              {s.label}
            </div>
            <div className="mt-2 text-[18px] font-bold tracking-[-0.02em] text-foam">
              {s.value}
            </div>
          </div>
        ))}
      </section>

      <section id="live" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Open raises</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.03em]">
              Live escrow
            </h2>
          </div>
          <p className="max-w-[36ch] text-right font-mono text-[11px] text-mute">
            {bidding.length} active · miss target = full refund
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bidding.map((d) => (
            <DropCard key={d.id} drop={d} />
          ))}
        </div>
      </section>

      <section id="curve" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Bonding curve</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.03em]">
              Raising on Pons
            </h2>
          </div>
          <p className="font-mono text-[11px] text-mute">
            {onCurve.length} toward graduation
          </p>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {onCurve.map((d) => (
            <DropCard key={d.id} drop={d} />
          ))}
        </div>
      </section>

      <section id="court" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Fee thrones</div>
            <h2 className="mt-2 text-[28px] font-bold tracking-[-0.03em]">
              Crown market
            </h2>
          </div>
          <Link href="/court" className="font-mono text-[12px] text-neon hover:underline">
            Open court →
          </Link>
        </div>
        <p className="mt-3 max-w-[56ch] text-[14px] text-mute">
          The 1/1 stays vaulted. Whoever holds the crown collects trading fees —
          until someone pays the live price and takes it.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crowns.slice(0, 3).map((d) => (
            <CrownCard key={d.id} drop={d} />
          ))}
        </div>
      </section>
    </Shell>
  );
}
