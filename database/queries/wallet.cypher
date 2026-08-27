// Get liquidity positions owned by a wallet
MATCH (w:Wallet {address: $address})
      -[:OWNS]->(position:LiquidityPosition)
      -[:IN_POOL]->(pool:Pool)

RETURN
    position.id AS positionId,
    position.amount0 AS amount0,
    position.amount1 AS amount1,
    position.lowerTick AS lowerTick,
    position.upperTick AS upperTick,
    position.liquidity AS liquidity,
    pool.id AS poolId,
    pool.name AS poolName,
    pool.chainId AS chainId
ORDER BY position.createdAt DESC;