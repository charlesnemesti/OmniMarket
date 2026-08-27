import { Drop } from "./types";

const UPSTREAM = "https://ponsea.io/api/drops";

export async function fetchDrops(): Promise<Drop[]> {
  const res = await fetch(UPSTREAM, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error(`drops ${res.status}`);
  return res.json();
}

export function partitionDrops(drops: Drop[]) {
  const bidding = drops.filter(
    (d) => d.source === "ponsea" && d.status === "LIVE" && d.address,
  );
  const biddingLoose = drops.filter(
    (d) =>
      d.status === "LIVE" &&
      (d.source === "ponsea" || (!d.tokenAddress && !d.curveAddress)),
  );
  const onCurve = drops.filter(
    (d) => d.status === "LIVE" && d.source === "pons" && d.tradeUrl,
  );
  const crowns = drops.filter(
    (d) => d.status === "LAUNCHED" && d.patronAddress && d.crownPriceEth != null,
  );
  const graduated = drops.filter((d) => d.status === "LAUNCHED");

  return {
    bidding: bidding.length ? bidding : biddingLoose,
    onCurve,
    crowns,
    graduated,
    all: drops,
  };
}

export function computeStats(drops: Drop[]) {
  const ponseaLive = drops.filter((d) => d.source === "ponsea");
  const launched = drops.filter((d) => d.status === "LAUNCHED");
  const committed = ponseaLive.reduce((s, d) => s + (d.raisedEth || 0), 0);
  const volume = launched.reduce((s, d) => s + (d.volume24hUsd || 0), 0);
  const coups = launched.reduce((s, d) => s + Math.max(0, (d.reignCount || 1) - 1), 0);
  const lpLocked = launched.reduce((s, d) => s + (d.targetEth || 0) * 0.15, 0);
  return {
    committed,
    launches: launched.length,
    volume,
    coups,
    lpLocked,
  };
}
