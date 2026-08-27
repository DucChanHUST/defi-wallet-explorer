import { driver } from "../db/driver";

export const getPools = async () => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (pool:Pool)
      OPTIONAL MATCH (pool)-[:CONTAINS]->(token:Token)
      OPTIONAL MATCH (pool)-[:BELONGS_TO]->(protocol:Protocol)
      OPTIONAL MATCH (pool)-[:DEPLOYED_ON]->(chain:Chain)
      RETURN
        pool.id AS id,
        pool.address AS address,
        pool.chainId AS chainId,
        pool.name AS name,
        pool.feeTier AS feeTier,
        protocol.id AS protocolId,
        protocol.name AS protocolName,
        protocol.version AS protocolVersion,
        chain.name AS chainName,
        collect(DISTINCT {
          address: token.address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals
        }) AS tokens
      ORDER BY pool.chainId, pool.name
      `,
    );

    return result.records.map((record) => ({
      id: record.get("id"),
      address: record.get("address"),
      chainId: Number(record.get("chainId")),
      name: record.get("name"),
      feeTier: record.get("feeTier"),
      protocol: {
        id: record.get("protocolId"),
        name: record.get("protocolName"),
        version: record.get("protocolVersion"),
      },
      chain: record.get("chainName"),
      tokens: record
        .get("tokens")
        .filter((token: { address: string | null }) => token.address),
    }));
  } finally {
    await session.close();
  }
};

export const getPool = async (id: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
			MATCH (pool:Pool {id: $id})
			OPTIONAL MATCH (pool)-[:CONTAINS]->(token:Token)
			OPTIONAL MATCH (pool)-[:BELONGS_TO]->(protocol:Protocol)
			OPTIONAL MATCH (pool)-[:DEPLOYED_ON]->(chain:Chain)
			RETURN
				pool.id AS id,
				pool.address AS address,
				pool.chainId AS chainId,
				pool.name AS name,
				pool.feeTier AS feeTier,
				protocol.id AS protocolId,
				protocol.name AS protocolName,
				protocol.version AS protocolVersion,
				chain.name AS chainName,
				collect(DISTINCT {
					address: token.address,
					name: token.name,
					symbol: token.symbol,
					decimals: token.decimals
				}) AS tokens
			`,
      { id },
    );

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      address: record.get("address"),
      chainId: Number(record.get("chainId")),
      name: record.get("name"),
      feeTier: record.get("feeTier"),
      protocol: {
        id: record.get("protocolId"),
        name: record.get("protocolName"),
        version: record.get("protocolVersion"),
      },
      chain: record.get("chainName"),
      tokens: record
        .get("tokens")
        .filter((token: { address: string | null }) => token.address),
    };
  } finally {
    await session.close();
  }
};

export const getPoolProviders = async (id: string) => {
  const session = driver.session();

  try {
    const result = await session.run(
      `
			MATCH (pool:Pool {id: $id})
			MATCH (wallet:Wallet)-[:OWNS]->(lp:LiquidityPosition)-[:IN_POOL]->(pool)
			RETURN
				wallet.address AS address,
				wallet.label AS label,
				count(DISTINCT lp) AS positions,
				sum(lp.liquidity) AS liquidity
			ORDER BY liquidity DESC
			`,
      { id },
    );

    return result.records.map((record) => ({
      address: record.get("address"),
      label: record.get("label"),
      positions: Number(record.get("positions")),
      liquidity: Number(record.get("liquidity")),
    }));
  } finally {
    await session.close();
  }
};
