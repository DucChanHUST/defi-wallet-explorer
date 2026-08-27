import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { ExplorerNode, GraphNodeData } from "../services/graph";
import type { Edge, NodeProps } from "@xyflow/react";

interface GraphExplorerProps {
  nodes: ExplorerNode[];
  edges: Edge[];
  onPoolSelect: (id: string) => void;
  onWalletSelect: (address: string) => void;
}

function GraphNode({ data, type }: NodeProps<ExplorerNode>) {
  const palette: Record<string, string> = {
    wallet: "border-cyan-400 bg-cyan-400/10 text-cyan-50",
    relatedWallet: "border-cyan-800 bg-slate-900 text-slate-200",
    position: "border-violet-500/70 bg-violet-500/10 text-violet-100",
    pool: "border-amber-400/70 bg-amber-400/10 text-amber-50",
    token: "border-emerald-500/70 bg-emerald-500/10 text-emerald-50",
    chain: "border-sky-500/70 bg-sky-500/10 text-sky-50",
    protocol: "border-pink-500/70 bg-pink-500/10 text-pink-50",
  };
  return (
    <div
      className={`min-w-36 rounded-md border px-3 py-2 shadow-lg shadow-slate-950/30 ${palette[type ?? ""] ?? "border-slate-700 bg-slate-900"} ${data.prominent ? "ring-1 ring-cyan-300" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-slate-400"
      />
      <p className="text-sm font-semibold leading-tight">{data.title}</p>
      {data.subtitle && (
        <p className="mt-1 max-w-44 truncate font-mono text-[10px] opacity-70">
          {data.subtitle}
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-slate-400"
      />
    </div>
  );
}

const nodeTypes = {
  wallet: GraphNode,
  relatedWallet: GraphNode,
  position: GraphNode,
  pool: GraphNode,
  token: GraphNode,
  chain: GraphNode,
  protocol: GraphNode,
};

export function GraphExplorer({
  nodes,
  edges,
  onPoolSelect,
  onWalletSelect,
}: GraphExplorerProps) {
  const onNodeClick: NodeMouseHandler<ExplorerNode> = (_event, node) => {
    const entity = (node.data as GraphNodeData).entity;
    if (entity.kind === "pool") onPoolSelect(entity.id);
    if (entity.kind === "wallet" && !node.data.prominent)
      onWalletSelect(entity.address);
  };
  return (
    <div className="h-[560px] overflow-hidden rounded-md border border-slate-800 bg-[#0b101b]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.2}
        maxZoom={1.8}
        nodesDraggable
      >
        <Background gap={20} size={1} color="#263246" />
        <Controls
          showInteractive={false}
          className="!border-slate-700 !bg-slate-900 [&>button]:!border-slate-700 [&>button]:!bg-slate-900 [&>button]:!fill-slate-300"
        />
        {/* <MiniMap className="!bg-slate-950" nodeColor="#38bdf8" /> */}
      </ReactFlow>
    </div>
  );
}
