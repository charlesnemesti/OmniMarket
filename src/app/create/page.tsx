import { Shell } from "@/components/Shell";
import { brand } from "@/lib/brand";

export default function CreatePage() {
  return (
    <Shell>
      <div className="mt-12 max-w-[620px]">
        <div className="eyebrow">Create</div>
        <h1 className="mt-3 text-[44px] font-bold tracking-[-0.04em]">
          Post a drop
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-mute">
          Artwork, target, deadline. Hit the raise → 1/1 vaults and the token launches
          on Pons. Creator gets 10% supply + fee share — never holds the ETH.
        </p>

        <div className="mt-8 flex flex-wrap gap-2 font-mono text-[11px]">
          <span className="chip-accent px-3 py-1">1 Artwork</span>
          <span className="chip px-3 py-1">2 Economics</span>
          <span className="chip px-3 py-1">3 Review</span>
        </div>

        <div className="mt-8 border border-hairline bg-panel p-6">
          <div className="eyebrow">Artwork · 1/1</div>
          <div className="mt-4 grid place-items-center border border-dashed border-hairline py-16 font-mono text-[12px] text-mute">
            upload · square · factory write needs team ABI
          </div>
          <p className="mt-4 text-[13px] text-mute">
            {brand.name} mirrors the live instance. Until the factory ABI lands from
            the team repo, create via the shared factory UI.
          </p>
          <a
            href="https://ponsea.io/create"
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6 inline-flex px-6 py-3"
          >
            Open factory →
          </a>
        </div>
      </div>
    </Shell>
  );
}
