import type { Wallet } from "../types/api";

const shorten = (address: string) =>
  `${address.slice(0, 10)}…${address.slice(-8)}`;

export function WalletHeader({ wallet }: { wallet: Wallet }) {
  return (
    <section className="border-b border-slate-800 pb-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
        Wallet overview
      </p>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            {wallet.label ?? "Unlabelled wallet"}
          </h1>
          <p
            className="mt-1 font-mono text-sm text-slate-400"
            title={wallet.address}
          >
            {shorten(wallet.address)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {wallet.chains.map((chain) => (
            <span
              key={chain.chainId}
              className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300"
            >
              {chain.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
