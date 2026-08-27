import Link from "next/link";
import { Shell } from "@/components/Shell";
import { brand } from "@/lib/brand";
import { PONSEA } from "@/lib/contracts";

export default function DocsPage() {
  return (
    <Shell>
      <div className="mt-12 max-w-[720px]">
        <div className="eyebrow">Docs</div>
        <h1 className="mt-3 text-[44px] font-bold tracking-[-0.04em]">
          How {brand.name} works
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-mute">
          Escrow a 1/1 with ETH on Robinhood Chain. Hit the raise and settle into a
          Pons launch + vaulted crown — or miss and refund everyone.
        </p>

        <section className="mt-12 border-t border-hairline pt-8">
          <div className="eyebrow">Phase 1</div>
          <h2 className="mt-2 text-[26px] font-bold">Commit window</h2>
          <ul className="mt-4 space-y-3 text-[14px] leading-relaxed text-mute">
            <li>Creator posts artwork, target, deadline.</li>
            <li>Backers commit ETH to escrow; withdraw anytime before deadline.</li>
            <li>Miss target → full refund. No mint.</li>
          </ul>
        </section>

        <section className="mt-10 border-t border-hairline pt-8">
          <div className="eyebrow">Phase 2</div>
          <h2 className="mt-2 text-[26px] font-bold">Threshold → launch</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[14px] leading-relaxed text-mute">
            <li>1/1 mints into the vault.</li>
            <li>Raise launches the token on Pons.</li>
            <li>LP locks permanently.</li>
            <li>Supply: 75% backers · 15% LP · 10% creator.</li>
            <li>Largest backer becomes first Patron.</li>
          </ol>
        </section>

        <section className="mt-10 border-t border-hairline pt-8">
          <div className="eyebrow">Contracts</div>
          <h2 className="mt-2 text-[26px] font-bold">On-chain</h2>
          <div className="mt-4 space-y-2 font-mono text-[11px]">
            {Object.entries(PONSEA).map(([k, v]) => (
              <div
                key={k}
                className="flex flex-wrap gap-3 border border-hairline bg-panel px-4 py-3"
              >
                <span className="text-neon">{k}</span>
                <a
                  className="break-all text-mute hover:text-foam"
                  href={`https://robinhoodchain.blockscout.com/address/${v}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {v}
                </a>
              </div>
            ))}
          </div>
        </section>

        <Link href="/" className="btn-primary mt-12 inline-flex px-6 py-3">
          Open market →
        </Link>
      </div>
    </Shell>
  );
}
