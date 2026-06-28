import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

/**
 * A node in the resume knowledge graph. Three kinds, styled by hierarchy:
 *   root — Rushi himself          hub — Skills / Projects / Experience
 *   leaf — an individual skill or project
 * `isIgnited` is the "live wire" state the agent sets when a node is part of an answer.
 */
export const CustomNode: React.FC<NodeProps> = ({ data, isConnectable, selected }) => {
  const kind = (data.kind as string) || "leaf";
  const ignited = Boolean(data.isIgnited);

  const sizing =
    kind === "root"
      ? "px-5 py-4 min-w-[190px]"
      : kind === "hub"
      ? "px-4 py-3 min-w-[150px]"
      : "px-3.5 py-2.5 min-w-[120px]";

  const border = ignited
    ? "border-live shadow-[0_0_22px_rgba(110,231,183,0.45)]"
    : selected
    ? "border-signal shadow-[0_0_16px_rgba(242,178,74,0.25)]"
    : kind === "root"
    ? "border-signal/60"
    : "border-line";

  return (
    <div
      className={`rounded-xl border bg-panel/95 backdrop-blur-md transition-all duration-300 ${sizing} ${border}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className={`w-1.5! h-1.5! border-none! ${ignited ? "bg-live!" : "bg-signal!"}`}
      />

      <div className="flex flex-col items-center text-center gap-1">
        {kind !== "leaf" && (
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted">
            {kind === "root" ? "node:root" : "node:hub"}
          </span>
        )}
        <div
          className={`font-display font-semibold leading-tight ${
            kind === "root" ? "text-lg text-paper" : kind === "hub" ? "text-paper" : "text-sm text-paper/90"
          }`}
        >
          {data.label as string}
        </div>
        {data.sublabel ? (
          <div className="font-mono text-[10px] text-signal/90">{data.sublabel as string}</div>
        ) : null}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className={`w-1.5! h-1.5! border-none! ${ignited ? "bg-live!" : "bg-signal!"}`}
      />
    </div>
  );
};
