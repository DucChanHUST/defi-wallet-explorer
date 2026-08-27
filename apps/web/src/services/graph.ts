import type { Edge, Node } from "@xyflow/react";
import type { ExplorerData, Pool } from "../types/api";

export type GraphEntity =
  | { kind: "wallet"; address: string }
  | { kind: "pool"; id: string }
  | { kind: "position" }
  | { kind: "token" }
  | { kind: "chain" }
  | { kind: "protocol" };

export interface GraphNodeData extends Record<string, unknown> {
  title: string;
  subtitle?: string;
  entity: GraphEntity;
  prominent?: boolean;
}

export type ExplorerNode = Node<GraphNodeData>;

const poolId = (chainId: number, address: string) => `${chainId}:${address}`;
const shortAddress = (value: string) =>
  `${value.slice(0, 7)}…${value.slice(-4)}`;

function poolNode(
  pool: Pool,
  position: { x: number; y: number },
): ExplorerNode {
  return {
    id: `pool:${pool.id}`,
    type: "pool",
    position,
    data: {
      title: pool.name,
      subtitle: pool.chain,
      entity: { kind: "pool", id: pool.id },
    },
  };
}

export function buildExplorerGraph(data: ExplorerData): {
  nodes: ExplorerNode[];
  edges: Edge[];
} {
  const nodes: ExplorerNode[] = [
    {
      id: `wallet:${data.wallet.address}`,
      type: "wallet",
      position: { x: 0, y: 420 },
      data: {
        title: data.wallet.label ?? "Selected wallet",
        subtitle: shortAddress(data.wallet.address),
        entity: { kind: "wallet", address: data.wallet.address },
        prominent: true,
      },
    },
  ];
  const edges: Edge[] = [];
  const added = new Set(nodes.map((node) => node.id));
  const addEdge = (source: string, target: string, label: string) => {
    edges.push({
      id: `${source}->${target}`,
      source,
      target,
      label,
      type: "smoothstep",
      animated: false,
      style: { stroke: "#64748b", strokeWidth: 1.6 },
      labelStyle: { fill: "#94a3b8", fontSize: 9, fontWeight: 600 },
      labelBgStyle: { fill: "#0b101b", fillOpacity: 0.92 },
    });
  };

  data.wallet.chains.forEach((chain, index) => {
    const id = `chain:${chain.chainId}`;
    added.add(id);
    nodes.push({
      id,
      type: "chain",
      position: { x: 260, y: index * 86 },
      data: {
        title: chain.name,
        subtitle: `Chain ${chain.chainId}`,
        entity: { kind: "chain" },
      },
    });
    addEdge(`wallet:${data.wallet.address}`, id, "ACTIVE_ON");
  });

  data.positions.forEach((position, index) => {
    const positionId = `position:${position.id}`;
    const id = poolId(position.chainId, position.poolAddress);
    const pool = data.pools.find((candidate) => candidate.id === id);
    const y = 300 + index * 220;
    nodes.push({
      id: positionId,
      type: "position",
      position: { x: 300, y },
      data: {
        title: position.id,
        subtitle: `${Intl.NumberFormat("en-US", { notation: "compact" }).format(position.liquidity)} liquidity`,
        entity: { kind: "position" },
      },
    });
    addEdge(`wallet:${data.wallet.address}`, positionId, "OWNS");

    if (!pool || added.has(`pool:${pool.id}`)) {
      if (pool) addEdge(positionId, `pool:${pool.id}`, "IN_POOL");
      return;
    }
    added.add(`pool:${pool.id}`);
    nodes.push(poolNode(pool, { x: 600, y }));
    addEdge(positionId, `pool:${pool.id}`, "IN_POOL");

    const chainId = `chain:${pool.chainId}`;
    if (!added.has(chainId)) {
      added.add(chainId);
      nodes.push({
        id: chainId,
        type: "chain",
        position: { x: 260, y: index * 86 },
        data: {
          title: pool.chain,
          subtitle: `Chain ${pool.chainId}`,
          entity: { kind: "chain" },
        },
      });
    }
    addEdge(`pool:${pool.id}`, chainId, "DEPLOYED_ON");

    const protocolId = `protocol:${pool.protocol.id}`;
    if (!added.has(protocolId)) {
      added.add(protocolId);
      nodes.push({
        id: protocolId,
        type: "protocol",
        position: { x: 900, y },
        data: {
          title: pool.protocol.name,
          subtitle: pool.protocol.version,
          entity: { kind: "protocol" },
        },
      });
    }
    addEdge(`pool:${pool.id}`, protocolId, "BELONGS_TO");

    pool.tokens.forEach((token, tokenIndex) => {
      const tokenId = `token:${pool.chainId}:${token.address}`;
      if (!added.has(tokenId)) {
        added.add(tokenId);
        nodes.push({
          id: tokenId,
          type: "token",
          position: { x: 1160, y: y + tokenIndex * 82 },
          data: {
            title: token.symbol,
            subtitle: token.name,
            entity: { kind: "token" },
          },
        });
      }
      addEdge(`pool:${pool.id}`, tokenId, "CONTAINS");
    });
  });

  data.relatedWallets.slice(0, 8).forEach((wallet, index) => {
    const id = `related:${wallet.address}`;
    nodes.push({
      id,
      type: "relatedWallet",
      position: { x: 0, y: 540 + index * 88 },
      data: {
        title: wallet.label ?? "Related wallet",
        subtitle: `${shortAddress(wallet.address)} · ${wallet.sharedPools} shared`,
        entity: { kind: "wallet", address: wallet.address },
      },
    });
    edges.push({
      id: `related:${wallet.address}`,
      source: `wallet:${data.wallet.address}`,
      target: id,
      label: "SHARES_POOL",
      type: "smoothstep",
      style: { stroke: "#22d3ee", strokeWidth: 1.6, strokeDasharray: "5 4" },
      labelStyle: { fill: "#67e8f9", fontSize: 9, fontWeight: 600 },
      labelBgStyle: { fill: "#0b101b", fillOpacity: 0.92 },
    });
  });

  return { nodes, edges };
}
