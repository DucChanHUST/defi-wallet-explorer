import { driver } from "../db/driver";

// find wallet by address
export const getWallet = async (address: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (w:Wallet {address: $address})

      OPTIONAL MATCH (w)-[:ACTIVE_ON]->(chain:Chain)

      RETURN
        w.address AS address,
        w.label AS label,
        collect({
          chainId: chain.chainId,
          name: chain.name
        }) AS chains
      `,
      { address },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      address: record.get("address"),
      label: record.get("label"),
      chains: record.get("chains"),
    };
  } finally {
    await session.close();
  }
};

export const getRelatedWallets = async (address: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (target:Wallet {
        address: $address
      })
      -[:OWNS]->(:LiquidityPosition)
      -[:IN_POOL]->(pool:Pool)
      <-[:IN_POOL]-(:LiquidityPosition)
      <-[:OWNS]-(other:Wallet)

      WHERE other.address <> target.address

      RETURN
        other.address AS address,
        other.label AS label,
        count(DISTINCT pool) AS sharedPools

      ORDER BY sharedPools DESC
      `,
      { address },
    );

    return result.records.map((record) => ({
      address: record.get("address"),
      label: record.get("label"),
      sharedPools: Number(record.get("sharedPools")),
    }));
  } finally {
    await session.close();
  }
};

export const getWalletPositions = async (address: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (lp:LiquidityPosition)<-[:OWNS]-(w:Wallet {address: $address})
      MATCH (lp)-[:IN_POOL]->(pool:Pool)
      RETURN
        lp.id AS id,
        pool.address AS poolAddress,
        pool.chainId AS chainId,
        lp.liquidity AS liquidity,
        lp.createdAt AS createdAt
      `,
      { address },
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      poolAddress: record.get("poolAddress"),
      chainId: Number(record.get("chainId")),
      liquidity: Number(record.get("liquidity")),
      createdAt: record.get("createdAt").toString(),
    }));
  } finally {
    await session.close();
  }
};

export const getWalletTokens = async (address: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (w:Wallet {address: $address})-[:OWNS]->(lp:LiquidityPosition)
      -[:IN_POOL]->(pool:Pool)-[:CONTAINS]->(token:Token)
      RETURN DISTINCT
        token.address AS tokenAddress,
        token.chainId AS chainId,
        token.name AS name,
        token.symbol AS symbol,
        token.decimals AS decimals
      `,
      { address },
    );

    return result.records.map((record) => ({
      tokenAddress: record.get("tokenAddress"),
      chainId: record.get("chainId"),
      name: record.get("name"),
      symbol: record.get("symbol"),
      decimals: Number(record.get("decimals")),
    }));
  } finally {
    await session.close();
  }
};
