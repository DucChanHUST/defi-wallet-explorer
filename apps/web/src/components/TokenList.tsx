import type { Token } from "../types/api";

export function TokenList({ tokens }: { tokens: Token[] }) {
  if (!tokens.length)
    return <p className="text-sm text-slate-500">No connected tokens found.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <span
          key={`${token.chainId}:${token.tokenAddress}`}
          className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-300"
        >
          <b className="text-slate-100">{token.symbol}</b>
          <span className="ml-1 text-slate-500">{token.chainId}</span>
        </span>
      ))}
    </div>
  );
}
