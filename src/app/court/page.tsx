import { Shell } from "@/components/Shell";
import { CrownCard } from "@/components/CrownCard";
import { fetchDrops, partitionDrops } from "@/lib/drops";
import { fmtEth } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CourtPage() {
  const drops = await fetchDrops();
  const { crowns } = partitionDrops(drops);
  const fees = crowns.reduce((s, d) => s + (d.feesEarnedEth || 0), 0);
  const coups = crowns.reduce((s, d) => s + Math.max(0, (d.reignCount || 1) - 1), 0);
  const generous = crowns.filter((d) => d.generous).length;

  return (
    <Shell>
      <div className="mt-12">
        <div className="eyebrow">Court</div>
        <h1 className="mt-3 text-[44px] font-bold tracking-[-0.04em] md:text-[56px]">
          Crown holders
        </h1>
        <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-mute">
          Every launched 1/1 stays in the vault. The crown collects the fee stream.
          Pay the live price — coup executes in one transaction.
        </p>

        <div className="mt-8 grid grid-cols-2 border border-hairline md:grid-cols-4">
          {[
            { l: "Crowns", v: String(crowns.length) },
            { l: "Coups", v: String(coups) },
            { l: "Fees streamed", v: `${fmtEth(fees)} ETH` },
            { l: "Generous", v: String(generous) },
          ].map((x) => (
            <div key={x.l} className="stat-cell border-r border-hairline last:border-r-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                {x.l}
              </div>
              <div className="mt-2 text-[18px] font-bold">{x.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crowns.map((d) => (
            <CrownCard key={d.id} drop={d} />
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Strike live price",
              d: "Fresh steal at 1.2×, then decay toward 0.6× over 30 days.",
            },
            {
              n: "02",
              t: "Earn the stream",
              d: "While you reign, trading fees flow to you — or burn in generous mode.",
            },
            {
              n: "03",
              t: "Exit at premium",
              d: "Usurped patrons take ~91% of the new price. Overthrow is upside.",
            },
          ].map((x) => (
            <div key={x.n} className="border border-hairline bg-panel p-5">
              <div className="font-mono text-[11px] text-neon">{x.n}</div>
              <div className="mt-2 text-[16px] font-bold">{x.t}</div>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
