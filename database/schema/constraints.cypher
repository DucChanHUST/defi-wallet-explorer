// ------------------------------------------------------------
// Chain
// A chainId uniquely identifies a blockchain network.
// Example: Ethereum = 1
// ------------------------------------------------------------

CREATE CONSTRAINT chain_chain_id_unique
IF NOT EXISTS
FOR (c:Chain)
REQUIRE c.chainId IS UNIQUE;


// ------------------------------------------------------------
// Wallet
// For this MVP we use address as the wallet identifier.
//
// NOTE:
// In a production multi-chain system, we may model wallet
// identity as (chainId + address). For this assignment,
// we keep the model simpler and explicitly connect Wallet
// to Chain using ACTIVE_ON.
// ------------------------------------------------------------

CREATE CONSTRAINT wallet_address_unique
IF NOT EXISTS
FOR (w:Wallet)
REQUIRE w.address IS UNIQUE;


// ------------------------------------------------------------
// Protocol
// ------------------------------------------------------------

CREATE CONSTRAINT protocol_id_unique
IF NOT EXISTS
FOR (p:Protocol)
REQUIRE p.id IS UNIQUE;


// ------------------------------------------------------------
// LiquidityPosition
// ------------------------------------------------------------

CREATE CONSTRAINT liquidity_position_id_unique
IF NOT EXISTS
FOR (p:LiquidityPosition)
REQUIRE p.id IS UNIQUE;