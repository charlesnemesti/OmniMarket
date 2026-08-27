"use client";

import { useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@/components/ConnectButton";
import { dropEscrowAbi } from "@/lib/contracts";
import { fmtEth } from "@/lib/format";

export function CommitPanel({
  escrow,
  minCommitEth,
}: {
  escrow: `0x${string}`;
  minCommitEth: number;
}) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState(String(minCommitEth || 0.01));
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  if (!isConnected) {
    return (
      <div className="rounded-md border border-hairline bg-panel p-5">
        <div className="mb-3 text-sm text-mute">Connect wallet to commit ETH</div>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-hairline bg-panel p-5">
      <label className="font-mono text-[10px] tracking-[0.14em] text-neon">
        COMMIT ETH
      </label>
      <div className="mt-2 flex gap-2">
        <input
          className="input flex-1"
          type="number"
          min={minCommitEth}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="btn-primary px-5"
          disabled={isPending || confirming}
          onClick={() =>
            writeContract({
              address: escrow,
              abi: dropEscrowAbi,
              functionName: "commit",
              value: parseEther(amount || "0"),
            })
          }
        >
          {isPending || confirming ? "Confirm…" : "Commit"}
        </button>
      </div>
      <div className="mt-2 font-mono text-[11px] text-mute">
        Min {fmtEth(minCommitEth)} ETH · withdraw before deadline
      </div>
      {error && (
        <div className="mt-2 text-[12px] text-red-400">{error.message}</div>
      )}
      {isSuccess && (
        <div className="mt-2 text-[12px] text-neon">Commit confirmed.</div>
      )}
    </div>
  );
}
