import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GraphExplorer } from "../components/GraphExplorer";
import { PoolDetails } from "../components/PoolDetails";
import { PositionList } from "../components/PositionList";
import { RelatedWallets } from "../components/RelatedWallets";
import { SearchBar } from "../components/SearchBar";
import { StatsCards } from "../components/StatsCards";
import { TokenList } from "../components/TokenList";
import { WalletHeader } from "../components/WalletHeader";
import { ApiError, api } from "../services/api";
import { buildExplorerGraph } from "../services/graph";
import type { ExplorerData, Pool, PoolProvider } from "../types/api";

const seededWallet = "0x1111111111111111111111111111111111111111";
const poolId = (chainId: number, address: string) => `${chainId}:${address}`;

function addressFromPath() {
  const match = window.location.pathname.match(/^\/wallet\/([^/]+)$/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export function ExplorerPage() {
  const [address, setAddress] = useState(addressFromPath);
  const [data, setData] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pool, setPool] = useState<Pool | null>(null);
  const [providers, setProviders] = useState<PoolProvider[]>([]);
  const [poolLoading, setPoolLoading] = useState(false);
  const [poolError, setPoolError] = useState<string | null>(null);
  const request = useRef<AbortController | null>(null);
  const poolRequest = useRef<AbortController | null>(null);

  const loadWallet = useCallback(
    async (nextAddress: string, updateUrl = true) => {
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;
      setAddress(nextAddress);
      setLoading(true);
      setError(null);
      setData(null);
      setPool(null);
      setProviders([]);
      setPoolError(null);
      if (updateUrl)
        window.history.pushState(
          {},
          "",
          `/wallet/${encodeURIComponent(nextAddress)}`,
        );
      try {
        const [wallet, positions, tokens, relatedWallets] = await Promise.all([
          api.getWallet(nextAddress, controller.signal),
          api.getPositions(nextAddress, controller.signal),
          api.getTokens(nextAddress, controller.signal),
          api.getRelatedWallets(nextAddress, controller.signal),
        ]);
        const ids = [
          ...new Set(
            positions.map((position) =>
              poolId(position.chainId, position.poolAddress),
            ),
          ),
        ];
        const pools = await Promise.all(
          ids.map((id) => api.getPool(id, controller.signal)),
        );
        if (!controller.signal.aborted)
          setData({ wallet, positions, tokens, relatedWallets, pools });
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(
          caught instanceof ApiError && caught.status === 404
            ? "Wallet not found. Check the address and try again."
            : caught instanceof Error
              ? caught.message
              : "Unable to load wallet data.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (address) void loadWallet(address, false);
  }, []); // Initial route only.
  useEffect(() => {
    const handler = () => {
      const fromUrl = addressFromPath();
      if (fromUrl) void loadWallet(fromUrl, false);
    };
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [loadWallet]);

  const loadPool = useCallback(async (id: string) => {
    poolRequest.current?.abort();
    const controller = new AbortController();
    poolRequest.current = controller;
    setPoolLoading(true);
    setPoolError(null);
    setPool(null);
    setProviders([]);
    try {
      const [nextPool, response] = await Promise.all([
        api.getPool(id, controller.signal),
        api.getPoolProviders(id, controller.signal),
      ]);
      if (!controller.signal.aborted) {
        setPool(nextPool);
        setProviders(response.providers);
      }
    } catch (caught) {
      if (!controller.signal.aborted)
        setPoolError(
          caught instanceof Error
            ? caught.message
            : "Unable to load pool details.",
        );
    } finally {
      if (!controller.signal.aborted) setPoolLoading(false);
    }
  }, []);

  const graph = useMemo(
    () => (data ? buildExplorerGraph(data) : { nodes: [], edges: [] }),
    [data],
  );
  const totalLiquidity =
    data?.positions.reduce((sum, position) => sum + position.liquidity, 0) ?? 0;

  return (
    <main className="mx-auto min-h-screen max-w-[1600px] px-4 py-6 md:px-8">
      <header className="mb-7 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            DeFi analytics
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Wallet relationship explorer
          </p>
        </div>
        <SearchBar
          initialAddress={address}
          onSearch={(value) => void loadWallet(value)}
          loading={loading}
        />
      </header>
      {!data && !loading && !error && (
        <EmptyState onExplore={() => void loadWallet(seededWallet)} />
      )}
      {loading && (
        <Status
          title="Loading wallet graph"
          detail="Fetching wallet, liquidity positions, related wallets, and connected pools…"
        />
      )}
      {error && (
        <Status
          title="Could not load wallet"
          detail={error}
          error
          onRetry={() => address && void loadWallet(address, false)}
        />
      )}
      {data && (
        <div className="space-y-5">
          <WalletHeader wallet={data.wallet} />
          <StatsCards
            positions={data.positions.length}
            tokens={data.tokens.length}
            relatedWallets={data.relatedWallets.length}
            liquidity={totalLiquidity}
          />
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <section className="min-w-0">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">
                  Relationship graph
                </h2>
                <p className="text-xs text-slate-500">
                  Select a gold pool or related wallet node
                </p>
              </div>
              <GraphExplorer
                nodes={graph.nodes}
                edges={graph.edges}
                onPoolSelect={(id) => void loadPool(id)}
                onWalletSelect={(walletAddress) =>
                  void loadWallet(walletAddress)
                }
              />
            </section>
            <aside className="space-y-4">
              <PoolDetails
                pool={pool}
                providers={providers}
                loading={poolLoading}
                error={poolError}
                onWalletSelect={(walletAddress) =>
                  void loadWallet(walletAddress)
                }
              />
              <Section title="Positions">
                <PositionList positions={data.positions} />
              </Section>
              <Section title="Tokens">
                <TokenList tokens={data.tokens} />
              </Section>
              <Section title="Related wallets">
                <RelatedWallets
                  wallets={data.relatedWallets}
                  onSelect={(walletAddress) => void loadWallet(walletAddress)}
                />
              </Section>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
function Status({
  title,
  detail,
  error = false,
  onRetry,
}: {
  title: string;
  detail: string;
  error?: boolean;
  onRetry?: () => void;
}) {
  return (
    <section className="mx-auto mt-24 max-w-xl border border-slate-800 bg-slate-900/40 p-6 text-center">
      <h1
        className={`text-lg font-semibold ${error ? "text-rose-300" : "text-slate-100"}`}
      >
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded border border-slate-600 px-3 py-1.5 text-sm text-slate-200 hover:border-cyan-400 hover:text-cyan-300"
        >
          Retry
        </button>
      )}
    </section>
  );
}
function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="mx-auto mt-24 max-w-xl border border-dashed border-slate-700 bg-slate-900/30 p-7 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
        Ready to explore
      </p>
      <h1 className="mt-2 text-xl font-semibold text-slate-100">
        Trace shared DeFi liquidity relationships.
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter a wallet address above, or inspect the seeded Alice wallet to get
        started.
      </p>
      <button
        onClick={onExplore}
        className="mt-5 rounded-md border border-cyan-500/60 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
      >
        Explore seeded wallet
      </button>
    </section>
  );
}
