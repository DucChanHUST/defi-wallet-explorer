import type { Pool, PoolProvider } from "../types/api";

interface PoolDetailsProps {
  pool: Pool | null;
  providers: PoolProvider[];
  loading: boolean;
  error: string | null;
  onWalletSelect: (address: string) => void;
}

export function PoolDetails({
  pool,
  providers,
  loading,
  error,
  onWalletSelect,
}: PoolDetailsProps) {
  if (loading)
    return (
      <Panel title="Pool details">
        <p className="text-sm text-slate-400">Loading pool data…</p>
      </Panel>
    );
  if (error)
    return (
      <Panel title="Pool details">
        <p className="text-sm text-rose-300">{error}</p>
      </Panel>
    );
  if (!pool)
    return (
      <Panel title="Pool details">
        <p className="text-sm text-slate-500">
          Select a gold pool node to inspect its protocol, tokens, and liquidity
          providers.
        </p>
      </Panel>
    );
  return (
    <Panel title="Pool details">
      <div className="space-y-5">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            {pool.name}
          </h3>
          <p className="mt-1 font-mono text-xs text-slate-500">{pool.id}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Network" value={pool.chain} />
          <Info label="Fee tier" value={`${pool.feeTier * 100}%`} />
          <Info
            label="Protocol"
            value={`${pool.protocol.name} ${pool.protocol.version}`}
          />
          <Info
            label="Tokens"
            value={pool.tokens.map((token) => token.symbol).join(" / ")}
          />
        </dl>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Liquidity providers
          </p>
          {providers.length ? (
            <ul className="divide-y divide-slate-800">
              {providers.map((provider) => (
                <li key={provider.address}>
                  <button
                    onClick={() => onWalletSelect(provider.address)}
                    className="flex w-full justify-between gap-2 py-2 text-left hover:bg-slate-800/50"
                  >
                    <span>
                      <span className="block text-sm text-slate-200">
                        {provider.label ?? "Unlabelled wallet"}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {provider.address.slice(0, 9)}…
                        {provider.address.slice(-5)}
                      </span>
                    </span>
                    <span className="text-right text-xs text-cyan-300">
                      {provider.liquidity.toLocaleString()}
                      <span className="block text-slate-500">
                        {provider.positions} positions
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">
              No providers found for this pool.
            </p>
          )}
        </div>
      </div>
    </Panel>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-200">{value}</dd>
    </div>
  );
}
