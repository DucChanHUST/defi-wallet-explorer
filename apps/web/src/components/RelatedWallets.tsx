import type { RelatedWallet } from "../types/api";

export function RelatedWallets({
  wallets,
  onSelect,
}: {
  wallets: RelatedWallet[];
  onSelect: (address: string) => void;
}) {
  if (!wallets.length)
    return (
      <p className="text-sm text-slate-500">
        No wallets share pools with this wallet.
      </p>
    );
  return (
    <ul className="divide-y divide-slate-800">
      {wallets.map((wallet) => (
        <li key={wallet.address}>
          <button
            onClick={() => onSelect(wallet.address)}
            className="flex w-full items-center justify-between gap-3 py-2.5 text-left hover:bg-slate-800/50"
          >
            <span>
              <span className="block text-sm text-slate-200">
                {wallet.label ?? "Unlabelled wallet"}
              </span>
              <span className="font-mono text-xs text-slate-500">
                {wallet.address.slice(0, 8)}…{wallet.address.slice(-5)}
              </span>
            </span>
            <span className="text-xs text-cyan-300">
              {wallet.sharedPools} shared
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
