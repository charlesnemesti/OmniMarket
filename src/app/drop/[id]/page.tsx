import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { CommitPanel } from "@/components/CommitPanel";
import { fetchDrops } from "@/lib/drops";
import { fmtEth, mediaUrl, pct, shortAddr, timeLeft } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function DropPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const drops = await fetchDrops();
  const drop = drops.find((d) => String(d.id) === id);
  if (!drop) notFound();

  const progress = pct(drop.raisedEth, drop.targetEth);
  const canCommit =
    drop.status === "LIVE" &&
    drop.source === "ponsea" &&
    !!drop.address &&
    drop.address.startsWith("0x");

  return (
    <Shell>
      <div className="mt-10 grid gap-10 md:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Link href="/" className="font-mono text-[12px] text-mute hover:text-neon">
            ← Market
          </Link>
          <div className="relative mt-4 aspect-square overflow-hidden rounded-md border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(drop.artworkUrl || "/brand/logo.png")}
              alt={drop.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div>
          <div className="eyebrow">{drop.status}</div>
          <h1 className="mt-2 text-[40px] font-bold tracking-[-0.04em]">
            {drop.name}
          </h1>
          <div className="mt-2 font-mono text-[13px] text-mute">
            {drop.creatorHandle} · ${drop.symbol}
          </div>
          {drop.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-mute">
              {drop.description}
            </p>
          )}

          <div className="mt-8 border border-hairline bg-panel p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-[11px] text-mute">Progress</span>
              <span className="font-mono text-neon">{progress}%</span>
            </div>
            <div className="track mt-3" style={{ height: 6 }}>
              <div className="track-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[11px] text-mute">
              <span>
                {fmtEth(drop.raisedEth)} / {fmtEth(drop.targetEth)} ETH
              </span>
              <span>{timeLeft(drop.deadline)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              <div className="border border-hairline px-3 py-3">
                <div className="font-mono text-[10px] text-mute">Backers</div>
                <div className="mt-1 font-bold">{drop.backers}</div>
              </div>
              <div className="border border-hairline px-3 py-3">
                <div className="font-mono text-[10px] text-mute">Escrow</div>
                <div className="mt-1 font-mono text-[12px]">
                  {shortAddr(drop.address)}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            {canCommit ? (
              <CommitPanel
                escrow={drop.address as `0x${string}`}
                minCommitEth={drop.minCommitEth || 0.01}
              />
            ) : drop.tradeUrl ? (
              <a
                href={drop.tradeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex w-full py-3"
              >
                Trade on Pons ↗
              </a>
            ) : drop.crownPriceEth != null ? (
              <div className="border border-hairline bg-panel p-5">
                <div className="font-mono text-[10px] tracking-[0.14em] text-mute">
                  CROWN
                </div>
                <div className="mt-2 font-mono text-[24px] font-bold text-neon">
                  {fmtEth(drop.crownPriceEth, 3)} ETH
                </div>
                <p className="mt-2 text-[13px] text-mute">
                  Patron {shortAddr(drop.patronAddress)} · fees{" "}
                  {fmtEth(drop.feesEarnedEth)} ETH
                </p>
                <a
                  href={`https://ponsea.io/drop/${drop.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-accent mt-4 inline-flex w-full py-3"
                >
                  Usurp on live vault →
                </a>
              </div>
            ) : (
              <div className="border border-hairline bg-panel p-5 text-sm text-mute">
                No active commit escrow for this listing.
              </div>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}
