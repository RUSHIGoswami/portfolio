import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomNode } from "./CustomNode";
import { ChatPanel } from "./ChatPanel";
import {
  fetchProjects,
  fetchSkills,
  fetchExperience,
  fetchEducation,
  fetchArticles,
  fetchContact,
} from "../services/sanity";
import { answer, buildGraph, PortfolioData } from "../services/agent";

const EDGE_BASE = { stroke: "#232A38", strokeWidth: 1 };
const EDGE_LIVE = { stroke: "#F2B24A", strokeWidth: 2 };

const GraphLayout: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Load resume data, then derive the graph from it.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [projects, skills, experience, education, articles, contact] = await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchExperience(),
        fetchEducation(),
        fetchArticles(),
        fetchContact(),
      ]);
      if (cancelled) return;
      const next: PortfolioData = { projects, skills, experience, education, articles, contact };
      const { nodes: n, edges: e } = buildGraph(next);
      setData(next);
      setNodes(n);
      setEdges(e.map((edge) => ({ ...edge, style: EDGE_BASE })));
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [setNodes, setEdges]);

  // Light up a set of nodes/edges; empty arrays reset the graph.
  const highlight = (nodeIds: string[], edgeIds: string[]) => {
    const nodeSet = new Set(nodeIds);
    const edgeSet = new Set(edgeIds);
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isIgnited: nodeSet.has(n.id) } })));
    setEdges((eds) =>
      eds.map((e) =>
        edgeSet.has(e.id)
          ? { ...e, animated: true, style: EDGE_LIVE }
          : { ...e, animated: false, style: EDGE_BASE }
      )
    );
  };

  const handleSendMessage = (msg: string) => {
    setMessages((prev) => [...prev, { text: msg, isUser: true }]);
    if (!data) return;

    const reply = answer(msg, data);
    highlight(reply.nodeIds, reply.edgeIds);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { text: reply.text, isUser: false }]);
    }, 450);
  };

  return (
    <div className="w-full h-screen bg-ink relative">
      {/* Constrain the flow region so fitView never centres nodes under the chat panel. */}
      <div className="absolute inset-0 lg:right-88">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          className="bg-ink"
        >
          <Controls className="bg-panel! border-line! [&>button]:bg-panel! [&>button]:border-line! [&>button]:fill-paper!" />
          <MiniMap
            className="bg-panel2! border! border-line!"
            maskColor="rgba(11, 14, 19, 0.7)"
            nodeColor="#232A38"
          />
          <Background variant={BackgroundVariant.Dots} color="#232A38" gap={28} size={1} />
        </ReactFlow>
      </div>

      <ChatPanel onSendMessage={handleSendMessage} messages={messages} isTyping={isTyping} />
    </div>
  );
};

export default GraphLayout;
