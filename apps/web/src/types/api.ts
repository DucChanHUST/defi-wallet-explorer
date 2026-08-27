export interface Chain {
  chainId: number;
  name: string;
}

export interface Wallet {
  address: string;
  label: string | null;
  chains: Chain[];
}

export interface RelatedWallet {
  address: string;
  label: string | null;
  sharedPools: number;
}

export interface LiquidityPosition {
  id: string;
  poolAddress: string;
  chainId: number;
  liquidity: number;
  createdAt: string;
}

export interface WalletPositionsResponse {
  wallet: string;
  position: LiquidityPosition[];
}

export interface Token {
  tokenAddress: string;
  chainId: number;
  name: string;
  symbol: string;
  decimals: number;
}

export interface WalletTokensResponse {
  wallet: string;
  tokens: Token[];
}

export interface RelatedWalletsResponse {
  wallet: string;
  relatedWallets: RelatedWallet[];
}

export interface PoolToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface Pool {
  id: string;
  address: string;
  chainId: number;
  name: string;
  feeTier: number;
  protocol: { id: string; name: string; version: string };
  chain: string;
  tokens: PoolToken[];
}

export interface PoolsResponse {
  pools: Pool[];
}

export interface PoolProvider {
  address: string;
  label: string | null;
  positions: number;
  liquidity: number;
}

export interface PoolProvidersResponse {
  pool: string;
  providers: PoolProvider[];
}

export interface ExplorerData {
  wallet: Wallet;
  positions: LiquidityPosition[];
  tokens: Token[];
  relatedWallets: RelatedWallet[];
  pools: Pool[];
}
