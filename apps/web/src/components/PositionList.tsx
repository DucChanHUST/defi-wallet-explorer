import type { LiquidityPosition } from "../types/api";

export function PositionList({
  positions,
}: {
  positions: LiquidityPosition[];
}) {
  if (!positions.length)
    return (
      <p className="text-sm text-slate-500">No liquidity positions found.</p>
    );
  return (
    <ul className="divide-y divide-slate-800">
      {positions.map((position) => (
        <li key={position.id} className="py-2.5">
          <div className="flex justify-between gap-3">
            <span className="font-mono text-xs text-slate-300">
              {position.id}
            </span>
            <span className="text-xs font-medium text-cyan-300">
              {position.liquidity.toLocaleString()} liquidity
            </span>
          </div>
          <p className="mt-1 truncate font-mono text-xs text-slate-500">
            {position.chainId}:{position.poolAddress}
          </p>
        </li>
      ))}
    </ul>
  );
}
