import type {
  Pool,
  PoolProvidersResponse,
  PoolsResponse,
  RelatedWalletsResponse,
  Wallet,
  WalletPositionsResponse,
  WalletTokensResponse,
} from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal });
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

const addressPath = (address: string) => encodeURIComponent(address);

export const api = {
  getWallet: (address: string, signal?: AbortSignal) =>
    get<Wallet>(`/wallets/${addressPath(address)}`, signal),
  getPositions: async (address: string, signal?: AbortSignal) =>
    (
      await get<WalletPositionsResponse>(
        `/wallets/${addressPath(address)}/positions`,
        signal,
      )
    ).position,
  getTokens: async (address: string, signal?: AbortSignal) =>
    (
      await get<WalletTokensResponse>(
        `/wallets/${addressPath(address)}/tokens`,
        signal,
      )
    ).tokens,
  getRelatedWallets: async (address: string, signal?: AbortSignal) =>
    (
      await get<RelatedWalletsResponse>(
        `/wallets/${addressPath(address)}/related`,
        signal,
      )
    ).relatedWallets,
  getPools: async (signal?: AbortSignal) =>
    (await get<PoolsResponse>("/pools", signal)).pools,
  getPool: (id: string, signal?: AbortSignal) =>
    get<Pool>(`/pools/${encodeURIComponent(id)}`, signal),
  getPoolProviders: (id: string, signal?: AbortSignal) =>
    get<PoolProvidersResponse>(
      `/pools/${encodeURIComponent(id)}/providers`,
      signal,
    ),
};
