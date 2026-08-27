import { Shell } from "@/components/Shell";
import { DropCard } from "@/components/DropCard";
import { fetchDrops, partitionDrops } from "@/lib/drops";
import { fmtUsdCompact } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function GraduatedPage() {
  const drops = await fetchDrops();
  const { graduated } = partitionDrops(drops);

  return (
    <Shell>
      <div className="mt-12">
        <div className="eyebrow">Launches</div>
        <h1 className="mt-3 text-[44px] font-bold tracking-[-0.04em]">
          Graduated
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] text-mute">
          Raises that cleared — locked LP, tradeable on Pons / DEX.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {graduated.map((d) => (
            <div key={d.id} className="relative">
              <DropCard
                drop={{
                  ...d,
                  status: "LIVE",
                  source: d.tradeUrl ? "pons" : d.source,
                  raisedEth: d.targetEth,
                  tradeUrl:
                    d.tradeUrl ||
                    (d.tokenAddress
                      ? `https://www.ponsfamily.com/launchpad/${d.tokenAddress}`
                      : null),
                }}
              />
              {d.mcapUsd != null && (
                <div className="pointer-events-none absolute left-3 top-3 rounded-sm bg-black/80 px-2 py-1 font-mono text-[10px] text-neon">
                  {fmtUsdCompact(d.mcapUsd)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
