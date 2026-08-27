export function shortAddr(addr?: string | null) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-3)}`;
}

export function fmtEth(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "0.00";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function pct(raised: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}

export function timeLeft(deadline: string) {
  const ms = new Date(deadline).getTime() - Date.now();
  if (ms <= 0) return "ended";
  const h = Math.floor(ms / 3_600_000);
  if (h < 48) return `${h}h left`;
  const d = Math.floor(h / 24);
  return `${d}d left`;
}

export function mediaUrl(path: string) {
  if (!path) return "/brand/logo.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/brand/") || path.startsWith("/art/") || path.startsWith("/uploads/")) {
    return path;
  }
  return `https://ponsea.io${path.startsWith("/") ? path : `/${path}`}`;
}

export function ringColor(addr?: string | null) {
  if (!addr || addr.length < 10) return "hsl(210 32% 46%)";
  const n = parseInt(addr.slice(2, 8), 16) || 210;
  return `hsl(${n % 360} 32% 46%)`;
}

export function fmtUsdCompact(n: number | null) {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Math.round(n)}`;
}
