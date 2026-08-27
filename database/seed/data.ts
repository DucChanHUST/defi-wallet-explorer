// ============================================================
//
// Purpose:
// Realistic seed data for the DeFi Wallet Relationship Explorer.
//
// This file DOES NOT talk to CognoDB.
// It only describes the data that seed.ts will insert.
// ============================================================

export const chains = [
  {
    chainId: 1,
    name: "Ethereum",
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
  },
  {
    chainId: 8453,
    name: "Base",
  },
];

export const protocols = [
  {
    id: "uniswap-v3",
    name: "Uniswap",
    version: "V3",
  },
  {
    id: "curve",
    name: "Curve",
    version: "StableSwap",
  },
  {
    id: "aerodrome",
    name: "Aerodrome",
    version: "Slipstream",
  },
];

export const wallets = [
  {
    address: "0x1111111111111111111111111111111111111111",
    label: "Alice",
    chainIds: [1, 42161],
  },
  {
    address: "0x2222222222222222222222222222222222222222",
    label: "Bob",
    chainIds: [1, 42161],
  },
  {
    address: "0x3333333333333333333333333333333333333333",
    label: "Charlie",
    chainIds: [1, 8453],
  },
  {
    address: "0x4444444444444444444444444444444444444444",
    label: "David",
    chainIds: [1],
  },
  {
    address: "0x5555555555555555555555555555555555555555",
    label: "Eve",
    chainIds: [42161, 8453],
  },
  {
    address: "0x6666666666666666666666666666666666666666",
    label: "Frank",
    chainIds: [1, 42161],
  },
  {
    address: "0x7777777777777777777777777777777777777777",
    label: "Grace",
    chainIds: [8453],
  },
  {
    address: "0x8888888888888888888888888888888888888888",
    label: "Henry",
    chainIds: [1, 42161],
  },
  {
    address: "0x9999999999999999999999999999999999999999",
    label: "Ivy",
    chainIds: [1],
  },
  {
    address: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    label: "Jack",
    chainIds: [42161, 8453],
  },
];

export const tokens = [
  {
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    chainId: 1,
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
  {
    address: "0xusdc000000000000000000000000000000000001",
    chainId: 1,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0xusdt000000000000000000000000000000000001",
    chainId: 1,
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
  },
  {
    address: "0xdai000000000000000000000000000000000001",
    chainId: 1,
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
  },
  {
    address: "0xwbtc00000000000000000000000000000000001",
    chainId: 1,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
  },
  {
    address: "0xarbeth0000000000000000000000000000000001",
    chainId: 42161,
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
  {
    address: "0xarbusdc000000000000000000000000000000001",
    chainId: 42161,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
  {
    address: "0xarbwbtc000000000000000000000000000000001",
    chainId: 42161,
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
  },
  {
    address: "0xbaseeth000000000000000000000000000000001",
    chainId: 8453,
    symbol: "ETH",
    name: "Ether",
    decimals: 18,
  },
  {
    address: "0xbaseusdc00000000000000000000000000000001",
    chainId: 8453,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
  },
];

export const pools = [
  // Ethereum
  {
    address: "0xpool000000000000000000000000000000000001",
    chainId: 1,
    name: "ETH / USDC",
    feeTier: 0.003,
    protocolId: "uniswap-v3",
    tokenAddresses: [
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "0xusdc000000000000000000000000000000000001",
    ],
  },
  {
    address: "0xpool000000000000000000000000000000000002",
    chainId: 1,
    name: "ETH / DAI",
    feeTier: 0.003,
    protocolId: "uniswap-v3",
    tokenAddresses: [
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "0xdai000000000000000000000000000000000001",
    ],
  },
  {
    address: "0xpool000000000000000000000000000000000003",
    chainId: 1,
    name: "WBTC / ETH",
    feeTier: 0.003,
    protocolId: "uniswap-v3",
    tokenAddresses: [
      "0xwbtc00000000000000000000000000000000001",
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    ],
  },
  {
    address: "0xpool000000000000000000000000000000000004",
    chainId: 1,
    name: "USDC / USDT",
    feeTier: 0.0005,
    protocolId: "curve",
    tokenAddresses: [
      "0xusdc000000000000000000000000000000000001",
      "0xusdt000000000000000000000000000000000001",
    ],
  },
  {
    address: "0xpool000000000000000000000000000000000005",
    chainId: 1,
    name: "USDC / DAI",
    feeTier: 0.0005,
    protocolId: "curve",
    tokenAddresses: [
      "0xusdc000000000000000000000000000000000001",
      "0xdai000000000000000000000000000000000001",
    ],
  },

  // Arbitrum
  {
    address: "0xpool000000000000000000000000000000000006",
    chainId: 42161,
    name: "ETH / USDC",
    feeTier: 0.003,
    protocolId: "uniswap-v3",
    tokenAddresses: [
      "0xarbeth0000000000000000000000000000000001",
      "0xarbusdc000000000000000000000000000000001",
    ],
  },
  {
    address: "0xpool000000000000000000000000000000000007",
    chainId: 42161,
    name: "ETH / WBTC",
    feeTier: 0.003,
    protocolId: "uniswap-v3",
    tokenAddresses: [
      "0xarbeth0000000000000000000000000000000001",
      "0xarbwbtc000000000000000000000000000000001",
    ],
  },

  // Base
  {
    address: "0xpool000000000000000000000000000000000008",
    chainId: 8453,
    name: "ETH / USDC",
    feeTier: 0.003,
    protocolId: "aerodrome",
    tokenAddresses: [
      "0xbaseeth000000000000000000000000000000001",
      "0xbaseusdc00000000000000000000000000000001",
    ],
  },
];

export const liquidityPositions = [
  // Alice
  {
    id: "position-001",
    walletAddress: "0x1111111111111111111111111111111111111111",
    poolAddress: "0xpool000000000000000000000000000000000001",
    chainId: 1,
    amount0: 2.5,
    amount1: 5000,
    lowerTick: -276330,
    upperTick: -276270,
    liquidity: 125000,
    createdAt: "2026-08-01T10:00:00Z",
  },
  {
    id: "position-002",
    walletAddress: "0x1111111111111111111111111111111111111111",
    poolAddress: "0xpool000000000000000000000000000000000002",
    chainId: 1,
    amount0: 1.5,
    amount1: 4500,
    lowerTick: -276300,
    upperTick: -276240,
    liquidity: 95000,
    createdAt: "2026-08-02T10:00:00Z",
  },
  {
    id: "position-003",
    walletAddress: "0x1111111111111111111111111111111111111111",
    poolAddress: "0xpool000000000000000000000000000000000003",
    chainId: 1,
    amount0: 0.8,
    amount1: 0.04,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 72000,
    createdAt: "2026-08-03T10:00:00Z",
  },

  // Bob shares two pools with Alice
  {
    id: "position-004",
    walletAddress: "0x2222222222222222222222222222222222222222",
    poolAddress: "0xpool000000000000000000000000000000000001",
    chainId: 1,
    amount0: 1.2,
    amount1: 2400,
    lowerTick: -276330,
    upperTick: -276270,
    liquidity: 80000,
    createdAt: "2026-08-04T10:00:00Z",
  },
  {
    id: "position-005",
    walletAddress: "0x2222222222222222222222222222222222222222",
    poolAddress: "0xpool000000000000000000000000000000000002",
    chainId: 1,
    amount0: 0.7,
    amount1: 2100,
    lowerTick: -276300,
    upperTick: -276240,
    liquidity: 65000,
    createdAt: "2026-08-05T10:00:00Z",
  },
  {
    id: "position-006",
    walletAddress: "0x2222222222222222222222222222222222222222",
    poolAddress: "0xpool000000000000000000000000000000000005",
    chainId: 1,
    amount0: 1500,
    amount1: 1500,
    lowerTick: -20,
    upperTick: 20,
    liquidity: 50000,
    createdAt: "2026-08-06T10:00:00Z",
  },

  // Charlie shares WBTC/ETH with Alice
  {
    id: "position-007",
    walletAddress: "0x3333333333333333333333333333333333333333",
    poolAddress: "0xpool000000000000000000000000000000000003",
    chainId: 1,
    amount0: 0.4,
    amount1: 0.02,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 45000,
    createdAt: "2026-08-07T10:00:00Z",
  },
  {
    id: "position-008",
    walletAddress: "0x3333333333333333333333333333333333333333",
    poolAddress: "0xpool000000000000000000000000000000000008",
    chainId: 8453,
    amount0: 1.1,
    amount1: 2200,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 60000,
    createdAt: "2026-08-08T10:00:00Z",
  },

  // David
  {
    id: "position-009",
    walletAddress: "0x4444444444444444444444444444444444444444",
    poolAddress: "0xpool000000000000000000000000000000000004",
    chainId: 1,
    amount0: 3000,
    amount1: 3000,
    lowerTick: -10,
    upperTick: 10,
    liquidity: 40000,
    createdAt: "2026-08-09T10:00:00Z",
  },

  // Eve
  {
    id: "position-010",
    walletAddress: "0x5555555555555555555555555555555555555555",
    poolAddress: "0xpool000000000000000000000000000000000006",
    chainId: 42161,
    amount0: 1.5,
    amount1: 3000,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 70000,
    createdAt: "2026-08-10T10:00:00Z",
  },
  {
    id: "position-011",
    walletAddress: "0x5555555555555555555555555555555555555555",
    poolAddress: "0xpool000000000000000000000000000000000008",
    chainId: 8453,
    amount0: 1.2,
    amount1: 2400,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 55000,
    createdAt: "2026-08-11T10:00:00Z",
  },

  // Frank shares Arbitrum ETH/USDC with Eve
  {
    id: "position-012",
    walletAddress: "0x6666666666666666666666666666666666666666",
    poolAddress: "0xpool000000000000000000000000000000000006",
    chainId: 42161,
    amount0: 0.8,
    amount1: 1600,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 50000,
    createdAt: "2026-08-12T10:00:00Z",
  },

  // Grace
  {
    id: "position-013",
    walletAddress: "0x7777777777777777777777777777777777777777",
    poolAddress: "0xpool000000000000000000000000000000000008",
    chainId: 8453,
    amount0: 0.7,
    amount1: 1400,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 35000,
    createdAt: "2026-08-13T10:00:00Z",
  },

  // Henry
  {
    id: "position-014",
    walletAddress: "0x8888888888888888888888888888888888888888",
    poolAddress: "0xpool000000000000000000000000000000000001",
    chainId: 1,
    amount0: 0.5,
    amount1: 1000,
    lowerTick: -276330,
    upperTick: -276270,
    liquidity: 35000,
    createdAt: "2026-08-14T10:00:00Z",
  },
  {
    id: "position-015",
    walletAddress: "0x8888888888888888888888888888888888888888",
    poolAddress: "0xpool000000000000000000000000000000000004",
    chainId: 1,
    amount0: 1000,
    amount1: 1000,
    lowerTick: -10,
    upperTick: 10,
    liquidity: 25000,
    createdAt: "2026-08-15T10:00:00Z",
  },

  // Ivy
  {
    id: "position-016",
    walletAddress: "0x9999999999999999999999999999999999999999",
    poolAddress: "0xpool000000000000000000000000000000000005",
    chainId: 1,
    amount0: 1000,
    amount1: 1000,
    lowerTick: -20,
    upperTick: 20,
    liquidity: 30000,
    createdAt: "2026-08-16T10:00:00Z",
  },

  // Jack
  {
    id: "position-017",
    walletAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    poolAddress: "0xpool000000000000000000000000000000000006",
    chainId: 42161,
    amount0: 0.6,
    amount1: 1200,
    lowerTick: -100,
    upperTick: 100,
    liquidity: 30000,
    createdAt: "2026-08-17T10:00:00Z",
  },
];
