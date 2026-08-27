import "dotenv/config";

import neo4j, { type Session } from "neo4j-driver";

import {
  chains,
  protocols,
  wallets,
  tokens,
  pools,
  liquidityPositions,
} from "./data";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("Missing COGNODB_URI, COGNODB_USERNAME, or COGNODB_PASSWORD");
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

async function seedChains(session: Session) {
  for (const chain of chains) {
    await session.run(
      `
      MERGE (c:Chain { chainId: $chainId })
      SET c.name = $name
      `,
      chain,
    );
  }
}

async function seedProtocols(session: Session) {
  for (const protocol of protocols) {
    await session.run(
      `
      MERGE (p:Protocol { id: $id })
      SET
        p.name = $name,
        p.version = $version
      `,
      protocol,
    );
  }
}

async function seedWallets(session: Session) {
  for (const wallet of wallets) {
    await session.run(
      `
      MERGE (w:Wallet { address: $address })
      SET w.label = $label
      `,
      {
        address: wallet.address,
        label: wallet.label,
      },
    );

    for (const chainId of wallet.chainIds) {
      await session.run(
        `
        MATCH (w:Wallet { address: $address })
        MATCH (c:Chain { chainId: $chainId })

        MERGE (w)-[:ACTIVE_ON]->(c)
        `,
        {
          address: wallet.address,
          chainId,
        },
      );
    }
  }
}

async function seedTokens(session: Session) {
  for (const token of tokens) {
    await session.run(
      `
      MERGE (
        t:Token {
          address: $address,
          chainId: $chainId
        }
      )
      SET
        t.symbol = $symbol,
        t.name = $name,
        t.decimals = $decimals
      `,
      token,
    );
  }
}

async function seedPools(session: Session) {
  for (const pool of pools) {
    const poolId = `${pool.chainId}:${pool.address}`;

    await session.run(
      `
      MERGE (
        pool:Pool {
          id: $id
        }
      )
      SET
        pool.address = $address,
        pool.chainId = $chainId,
        pool.name = $name,
        pool.feeTier = $feeTier
      `,
      {
        id: poolId,
        address: pool.address,
        chainId: pool.chainId,
        name: pool.name,
        feeTier: pool.feeTier,
      },
    );

    await session.run(
      `
      MATCH (pool:Pool { id: $poolId })
      MATCH (protocol:Protocol { id: $protocolId })

      MERGE (pool)-[:BELONGS_TO]->(protocol)
      `,
      {
        poolId,
        protocolId: pool.protocolId,
      },
    );

    await session.run(
      `
      MATCH (pool:Pool { id: $poolId })
      MATCH (chain:Chain { chainId: $chainId })

      MERGE (pool)-[:DEPLOYED_ON]->(chain)
      `,
      {
        poolId,
        chainId: pool.chainId,
      },
    );

    for (const tokenAddress of pool.tokenAddresses) {
      await session.run(
        `
        MATCH (pool:Pool { id: $poolId })
        MATCH (
          token:Token {
            address: $tokenAddress,
            chainId: $chainId
          }
        )

        MERGE (pool)-[:CONTAINS]->(token)
        `,
        {
          poolId,
          tokenAddress,
          chainId: pool.chainId,
        },
      );
    }
  }
}

async function seedLiquidityPositions(session: Session) {
  for (const position of liquidityPositions) {
    await session.run(
      `
      MERGE (
        lp:LiquidityPosition {
          id: $id
        }
      )
      SET
        lp.amount0 = $amount0,
        lp.amount1 = $amount1,
        lp.lowerTick = $lowerTick,
        lp.upperTick = $upperTick,
        lp.liquidity = $liquidity,
        lp.createdAt = datetime($createdAt)
      `,
      position,
    );

    const poolId = `${position.chainId}:${position.poolAddress}`;

    await session.run(
      `
      MATCH (wallet:Wallet {
        address: $walletAddress
      })

      MATCH (lp:LiquidityPosition {
        id: $positionId
      })

      MERGE (wallet)-[:OWNS]->(lp)
      `,
      {
        walletAddress: position.walletAddress,
        positionId: position.id,
      },
    );

    await session.run(
      `
      MATCH (lp:LiquidityPosition {
        id: $positionId
      })

      MATCH (pool:Pool {
        id: $poolId
      })

      MERGE (lp)-[:IN_POOL]->(pool)
      `,
      {
        positionId: position.id,
        poolId,
      },
    );
  }
}

async function main() {
  const session = driver.session();

  try {
    console.log("Connecting to CognoDB...");

    await driver.verifyConnectivity();

    console.log("Connected.");

    console.log("Seeding chains...");
    await seedChains(session);

    console.log("Seeding protocols...");
    await seedProtocols(session);

    console.log("Seeding wallets...");
    await seedWallets(session);

    console.log("Seeding tokens...");
    await seedTokens(session);

    console.log("Seeding pools...");
    await seedPools(session);

    console.log("Seeding liquidity positions...");
    await seedLiquidityPositions(session);

    console.log("Seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

main();
