interface StatsCardsProps {
  positions: number;
  tokens: number;
  relatedWallets: number;
  liquidity: number;
}
const compact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function StatsCards({
  positions,
  tokens,
  relatedWallets,
  liquidity,
}: StatsCardsProps) {
  const stats = [
    ["Positions", positions],
    ["Connected tokens", tokens],
    ["Related wallets", relatedWallets],
    ["Reported liquidity", compact(liquidity)],
  ];
  return (
    <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {stats.map(([label, value]) => (
        <div
          key={label}
          className="border border-slate-800 bg-slate-900/40 px-3 py-3"
        >
          <p className="text-xs text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-semibold text-slate-100">{value}</p>
        </div>
      ))}
    </section>
  );
}
