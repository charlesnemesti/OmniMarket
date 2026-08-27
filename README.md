# OmniMarket

Launchpad UI on [Robinhood Chain](https://docs.robinhood.com/chain/connecting/) — same live PonSea instance, OmniMarket skin.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 15 · wagmi/viem · Robinhood Chain `4663`
- Live data: `https://ponsea.io/api/drops`
- Bid: `commit()` on drop escrow

## Contracts

See `src/lib/contracts.ts`.
