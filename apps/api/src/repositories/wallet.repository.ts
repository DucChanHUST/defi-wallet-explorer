import { driver } from "../db/driver";

export const findWalletByAddress = async (address: string) => {
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
      {
        address,
      },
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

export const findRelatedWallets = async (address: string) => {
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
      {
        address,
      },
    );

    return result.records.map((record) => ({
      address: record.get("address"),
      label: record.get("label"),
      sharedPools: record.get("sharedPools").toNumber(),
    }));
  } finally {
    await session.close();
  }
};
