import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ForceGraph2D, { ForceGraphMethods } from "react-force-graph-2d";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  Maximize2,
  MessageSquare,
  X,
  ExternalLink,
} from "lucide-react";
import { Github } from "./BrandIcons";
import { ChatPanel } from "./ChatPanel";
import {
  fetchProjects,
  fetchSkills,
  fetchExperiences,
  fetchEducations,
  fetchArticles,
  fetchContact,
} from "../services/sanity";
import {
  answer,
  buildGraph,
  PortfolioData,
  NodeMeta,
} from "../services/agent";

// ---- Palette (mirrors tailwind.config.js) ----
const C = {
  ink: "#0B0E13",
  panel: "#12161F",
  line: "#232A38",
  paper: "#E7EAF0",
  muted: "#8B93A4",
  signal: "#F2B24A",
  live: "#6EE7B7",
};

const ROOT = "root";
const ROOT_IMG = `${import.meta.env.BASE_URL}rushigoswami.jpg`;
// The source photo is full-body; this focuses the crop on the face (normalized
// image coords + zoom over a cover fit).
const ROOT_FOCUS = { zoom: 2.65, cx: 0.53, cy: 0.43 };

type Kind = "root" | "hub" | "leaf";

interface ImgFocus {
  zoom: number;
  cx: number;
  cy: number;
}

interface GNode {
  id: string;
  kind: Kind;
  label: string;
  sublabel?: string;
  img?: string;
  imgFocus?: ImgFocus;
  real?: boolean; // for leaf skills: true = curated skill, false = project-only tool
  meta?: NodeMeta; // surfaced in the click-to-inspect card
  // mutated by the force simulation:
  x?: number;
  y?: number;
  // set to pin a node in place (after the user drags it):
  fx?: number;
  fy?: number;
}

interface GLink {
  id: string;
  source: string;
  target: string;
}

interface GraphLayoutProps {
  onBack: () => void;
}

// Radius (graph units) by hierarchy. Root is deliberately dominant.
const RADIUS: Record<Kind, number> = { root: 38, hub: 15, leaf: 9 };

// Extra clearance (graph units) reserved around each node for its label pill so
// neighbours never overlap the text — root keeps the most room.
const LABEL_PAD: Record<Kind, number> = { root: 26, hub: 30, leaf: 16 };

// Custom collision force: keeps node circles + their labels from overlapping.
// Written inline so we don't depend on a top-level d3-force install (it's only
// bundled transitively inside react-force-graph).
function makeCollideForce() {
  let nodes: GNode[] = [];
  const force = (alpha: number) => {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ra = RADIUS[a.kind] + LABEL_PAD[a.kind];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const rb = RADIUS[b.kind] + LABEL_PAD[b.kind];
        const min = ra + rb;
        let dx = (b.x ?? 0) - (a.x ?? 0);
        let dy = (b.y ?? 0) - (a.y ?? 0);
        let dist = Math.hypot(dx, dy);
        if (dist === 0) {
          dist = 1;
          dx = (i % 2 === 0 ? 1 : -1) * 0.5;
          dy = 0.5;
        }
        if (dist < min) {
          const shift = ((min - dist) / dist) * alpha * 0.6;
          const px = dx * shift;
          const py = dy * shift;
          const av = a as GNode & { vx?: number; vy?: number };
          const bv = b as GNode & { vx?: number; vy?: number };
          bv.vx = (bv.vx ?? 0) + px;
          bv.vy = (bv.vy ?? 0) + py;
          av.vx = (av.vx ?? 0) - px;
          av.vy = (av.vy ?? 0) - py;
        }
      }
    }
  };
  (force as unknown as { initialize: (n: GNode[]) => void }).initialize = (
    n: GNode[],
  ) => {
    nodes = n;
  };
  return force;
}

const GraphLayout: React.FC<GraphLayoutProps> = ({ onBack }) => {
  const fgRef = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<PortfolioData | null>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<GNode | null>(null);
  // Chat starts open on wide screens, collapsed on phones so the graph is visible.
  const [chatOpen, setChatOpen] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 1024,
  );

  // Persistent master graph — built once. Node objects are reused across
  // expand/collapse so the simulation keeps their positions. Skill nodes are
  // shared, so a node can have MANY parents (a category + several projects).
  const masterRef = useRef<{
    nodesById: Map<string, GNode>;
    links: GLink[];
    children: Map<string, string[]>;
    parents: Map<string, string[]>;
  }>({
    nodesById: new Map(),
    links: [],
    children: new Map(),
    parents: new Map(),
  });

  const [expanded, setExpanded] = useState<Set<string>>(new Set([ROOT]));
  const [ignited, setIgnited] = useState<Set<string>>(new Set());
  const [igLinks, setIgLinks] = useState<Set<string>>(new Set());
  const [graphReady, setGraphReady] = useState(false);

  // ---- Image cache. Bumping imgVersion gives nodeCanvasObject a new identity so
  // the force graph repaints once a photo finishes loading. ----
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [imgVersion, setImgVersion] = useState(0);
  const getImage = useCallback((url: string): HTMLImageElement => {
    const cache = imagesRef.current;
    const existing = cache.get(url);
    if (existing) return existing;
    const img = new Image();
    img.onload = () => setImgVersion(v => v + 1);
    img.src = url;
    cache.set(url, img);
    return img;
  }, []);

  // ---- Measure the flow region so the canvas fills it exactly ----
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  // ---- Load resume data, derive the master graph ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [projects, skills, experience, education, articles, contact] =
        await Promise.all([
          fetchProjects(),
          fetchSkills(),
          fetchExperiences(),
          fetchEducations(),
          fetchArticles(),
          fetchContact(),
        ]);
      if (cancelled) return;
      const next: PortfolioData = {
        projects,
        skills,
        experience,
        education,
        articles,
        contact,
      };
      const { nodes: rfNodes, edges: rfEdges } = buildGraph(next);

      const nodesById = new Map<string, GNode>();
      rfNodes.forEach(n => {
        const d = n.data as {
          kind?: Kind;
          label?: string;
          sublabel?: string;
          img?: string;
          real?: boolean;
          meta?: NodeMeta;
        };
        nodesById.set(n.id, {
          id: n.id,
          kind: (d?.kind ?? "leaf") as Kind,
          label: d?.label ?? n.id,
          sublabel: d?.sublabel,
          img: n.id === ROOT ? ROOT_IMG : d?.img,
          imgFocus: n.id === ROOT ? ROOT_FOCUS : undefined,
          real: d?.real,
          meta: d?.meta,
        });
      });

      const links: GLink[] = rfEdges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
      }));

      const children = new Map<string, string[]>();
      const parents = new Map<string, string[]>();
      links.forEach(l => {
        (
          children.get(l.source) ?? children.set(l.source, []).get(l.source)!
        ).push(l.target);
        (
          parents.get(l.target) ?? parents.set(l.target, []).get(l.target)!
        ).push(l.source);
      });

      masterRef.current = { nodesById, links, children, parents };
      setData(next);
      setExpanded(new Set([ROOT]));
      setGraphReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- Visible subset: BFS from root through expanded nodes ----
  const graphData = useMemo(() => {
    if (!graphReady) return { nodes: [] as GNode[], links: [] as GLink[] };
    const { nodesById, links, children } = masterRef.current;
    const visible = new Set<string>([ROOT]);
    const queue = [ROOT];
    while (queue.length) {
      const cur = queue.shift()!;
      if (!expanded.has(cur)) continue;
      for (const child of children.get(cur) ?? []) {
        if (!visible.has(child)) {
          visible.add(child);
          queue.push(child);
        }
      }
    }
    const nodes = [...visible].map(id => nodesById.get(id)!).filter(Boolean);
    const vlinks = links
      .filter(l => visible.has(l.source) && visible.has(l.target))
      .map(l => ({ ...l }));
    return { nodes, links: vlinks };
  }, [expanded, graphReady]);

  const hasChildren = (id: string) =>
    (masterRef.current.children.get(id)?.length ?? 0) > 0;
  const isCollapsed = (id: string) => hasChildren(id) && !expanded.has(id);

  // ---- Tune the force simulation once the graph mounts ----
  useEffect(() => {
    if (!graphReady) return;
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(-520);
    const link = fg.d3Force("link") as unknown as
      | { distance?: (fn: (l: GLink) => number) => void }
      | undefined;
    // Distance scales with the connected nodes' sizes: links touching the big
    // root push their hub far enough out that nothing crowds the face.
    link?.distance?.((l: GLink) => {
      const ends = [l.source, l.target] as unknown as (GNode | string)[];
      const kinds = ends.map(e =>
        typeof e === "object" ? (e as GNode).kind : "leaf",
      );
      if (kinds.includes("root")) return 150;
      if (kinds.includes("hub")) return 64;
      return 48;
    });
    // Collision keeps circles + labels from overlapping at rest.
    fg.d3Force("collide", makeCollideForce() as never);
    fg.d3ReheatSimulation();
    const t = setTimeout(() => fg.zoomToFit(600, 90), 450);
    return () => clearTimeout(t);
  }, [graphReady]);

  // ---- Expand/collapse a node's subtree (double-click) ----
  const toggleExpand = useCallback((node: GNode) => {
    if (!hasChildren(node.id)) {
      if (node.x != null && node.y != null)
        fgRef.current?.centerAt(node.x, node.y, 400);
      return;
    }
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        // Collapse: drop this node + its whole subtree from the expanded set.
        const stack = [node.id];
        const seen = new Set<string>();
        while (stack.length) {
          const cur = stack.pop()!;
          if (seen.has(cur)) continue;
          seen.add(cur);
          next.delete(cur);
          for (const c of masterRef.current.children.get(cur) ?? [])
            stack.push(c);
        }
      } else {
        next.add(node.id);
      }
      return next;
    });
    fgRef.current?.d3ReheatSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Distinguish single-click (inspect card) from double-click (expand).
  // react-force-graph fires onNodeClick per click; we debounce to detect a pair.
  const clickTimer = useRef<number | null>(null);
  const chatWasOpen = useRef(false);
  const handleNodeClick = useCallback(
    (node: GNode) => {
      if (clickTimer.current != null) {
        window.clearTimeout(clickTimer.current);
        clickTimer.current = null;
        toggleExpand(node);
        return;
      }
      clickTimer.current = window.setTimeout(() => {
        clickTimer.current = null;
        // The card takes the chat's slot — remember chat state so we can restore it.
        chatWasOpen.current = chatOpen;
        setChatOpen(false);
        setSelected(node);
        if (node.x != null && node.y != null)
          fgRef.current?.centerAt(node.x, node.y, 400);
      }, 230);
    },
    [toggleExpand, chatOpen],
  );

  // Pin a node where the user drops it so it stays put instead of snapping back.
  const handleNodeDragEnd = useCallback((node: GNode) => {
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const closeCard = () => {
    setSelected(null);
    if (chatWasOpen.current) setChatOpen(true);
  };

  // ---- Agent highlight: reveal lit nodes (expand all ancestors), ignite wires ----
  const highlight = (nodeIds: string[], edgeIds: string[]) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.add(ROOT);
      const { parents } = masterRef.current;
      const stack = [...nodeIds];
      const seen = new Set<string>();
      while (stack.length) {
        const cur = stack.pop()!;
        for (const p of parents.get(cur) ?? []) {
          next.add(p); // expand the parent so `cur` becomes visible
          if (!seen.has(p)) {
            seen.add(p);
            stack.push(p);
          }
        }
      }
      return next;
    });
    setIgnited(new Set(nodeIds));
    setIgLinks(new Set(edgeIds));
    fgRef.current?.d3ReheatSimulation();
    setTimeout(() => fgRef.current?.zoomToFit(600, 90), 350);
  };

  const clearChat = () => {
    setMessages([]);
    setIsTyping(false);
    setIgnited(new Set());
    setIgLinks(new Set());
  };

  const handleSendMessage = (msg: string) => {
    setMessages(prev => [...prev, { text: msg, isUser: true }]);
    if (!data) return;
    const reply = answer(msg, data);
    highlight(reply.nodeIds, reply.edgeIds);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { text: reply.text, isUser: false }]);
    }, 450);
  };

  // Draw an image inside a circle, cover-fitted then zoomed/panned to a focal point.
  const drawCircularImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    r: number,
    focus?: ImgFocus,
  ) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!iw || !ih) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    const cover = Math.max((2 * r) / iw, (2 * r) / ih);
    const f = focus ?? { zoom: 1, cx: 0.5, cy: 0.5 };
    const scale = cover * f.zoom;
    const dw = iw * scale;
    const dh = ih * scale;
    // Place so the focal point of the image lands at the circle centre.
    ctx.drawImage(img, x - f.cx * dw, y - f.cy * dh, dw, dh);
    ctx.restore();
  };

  // ---- Canvas node renderer: round nodes, optional photo, label pill ----
  const paintNode = useCallback(
    (node: GNode, ctx: CanvasRenderingContext2D, scale: number) => {
      const r = RADIUS[node.kind];
      const lit = ignited.has(node.id);
      const collapsed = isCollapsed(node.id);
      const x = node.x ?? 0;
      const y = node.y ?? 0;

      // Root always carries a soft amber halo so it stays the focal point; lit
      // nodes get a mint glow.
      if (lit) {
        ctx.shadowColor = C.live;
        ctx.shadowBlur = 26;
      } else if (node.kind === "root") {
        ctx.shadowColor = "rgba(242,178,74,0.55)";
        ctx.shadowBlur = 22;
      }

      // Base fill (also the backdrop while a photo loads).
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle =
        node.kind === "root" ? C.signal : lit ? "#16382C" : C.panel;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Photo, if this node has one and it's loaded.
      if (node.img) {
        const img = getImage(node.img);
        if (img.complete && img.naturalWidth)
          drawCircularImage(ctx, img, x, y, r, node.imgFocus);
      }

      // Ring. Real (curated) skills get an amber tint; project-only tools stay grey.
      const leafReal = node.kind === "leaf" && node.real;
      ctx.lineWidth = node.kind === "root" ? 3 : 2;
      ctx.strokeStyle = lit
        ? C.live
        : node.kind === "root"
          ? C.signal
          : node.kind === "hub"
            ? "rgba(242,178,74,0.55)"
            : leafReal
              ? "rgba(242,178,74,0.4)"
              : C.line;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();

      // Collapsed-with-children hint: faint dashed outer ring.
      if (collapsed) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.arc(x, y, r + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = lit ? C.live : "rgba(242,178,74,0.4)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label below, with a subtle pill for legibility.
      const fontSize = Math.max(11, 13 / scale);
      ctx.font = `${node.kind === "leaf" ? "" : "600 "}${fontSize}px "Space Grotesk", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      const label = node.label;
      const tw = ctx.measureText(label).width;
      const padX = 5;
      const ly = y + r + 4;
      const pillH = fontSize + 6;
      const rad = 4;
      const px = x - tw / 2 - padX;
      const pw = tw + padX * 2;
      ctx.fillStyle = "rgba(11,14,19,0.78)";
      ctx.beginPath();
      ctx.moveTo(px + rad, ly);
      ctx.arcTo(px + pw, ly, px + pw, ly + pillH, rad);
      ctx.arcTo(px + pw, ly + pillH, px, ly + pillH, rad);
      ctx.arcTo(px, ly + pillH, px, ly, rad);
      ctx.arcTo(px, ly, px + pw, ly, rad);
      ctx.fill();
      ctx.fillStyle = lit ? C.live : C.paper;
      ctx.fillText(label, x, ly + 3);

      if (node.sublabel) {
        const sf = Math.max(9, 10 / scale);
        ctx.font = `${sf}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = C.signal;
        ctx.fillText(node.sublabel, x, ly + pillH + 2);
      }
    },
    // imgVersion forces a repaint when a photo finishes loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ignited, expanded, imgVersion, getImage],
  );

  const paintPointerArea = useCallback(
    (node: GNode, color: string, ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, RADIUS[node.kind] + 4, 0, 2 * Math.PI);
      ctx.fill();
    },
    [],
  );

  const linkColor = useCallback(
    (l: GLink) => (igLinks.has(l.id) ? C.live : "rgba(35,42,56,0.85)"),
    [igLinks],
  );
  const linkWidth = useCallback(
    (l: GLink) => (igLinks.has(l.id) ? 2.4 : 1),
    [igLinks],
  );
  const linkParticles = useCallback(
    (l: GLink) => (igLinks.has(l.id) ? 4 : 0),
    [igLinks],
  );

  const zoomBy = (factor: number) => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.zoom(fg.zoom() * factor, 250);
  };

  return (
    <div className="w-full h-screen bg-ink relative overflow-hidden">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-panel/80 backdrop-blur-md border border-line text-paper/90 hover:text-signal hover:border-signal/40 transition-colors shadow-xl"
      >
        <ArrowLeft size={16} />
        <span className="font-mono text-xs tracking-wide">
          Back to overview
        </span>
      </button>

      <div className="absolute bottom-6 left-4 z-50 flex flex-col gap-1.5">
        {[
          { icon: <Plus size={16} />, fn: () => zoomBy(1.4), label: "Zoom in" },
          {
            icon: <Minus size={16} />,
            fn: () => zoomBy(1 / 1.4),
            label: "Zoom out",
          },
          {
            icon: <Maximize2 size={15} />,
            fn: () => fgRef.current?.zoomToFit(500, 80),
            label: "Fit",
          },
        ].map(b => (
          <button
            key={b.label}
            type="button"
            aria-label={b.label}
            onClick={b.fn}
            className="w-9 h-9 grid place-items-center rounded-lg bg-panel/80 backdrop-blur-md border border-line text-paper/80 hover:text-signal hover:border-signal/40 transition-colors"
          >
            {b.icon}
          </button>
        ))}
      </div>

      <div
        ref={wrapRef}
        className={`absolute inset-0 ${chatOpen ? "lg:right-88" : ""} bg-ink bg-dot-white bg-dot-pattern [background-blend-mode:soft-light] transition-[right] duration-300`}
        style={{ backgroundColor: C.ink }}
      >
        {size.w > 0 && (
          <ForceGraph2D
            ref={fgRef}
            width={size.w}
            height={size.h}
            graphData={graphData}
            backgroundColor="rgba(0,0,0,0)"
            nodeRelSize={6}
            nodeVal={(n: GNode) => RADIUS[n.kind]}
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintPointerArea}
            onNodeClick={handleNodeClick}
            onNodeDragEnd={handleNodeDragEnd}
            linkColor={linkColor}
            linkWidth={linkWidth}
            linkDirectionalParticles={linkParticles}
            linkDirectionalParticleWidth={2.4}
            linkDirectionalParticleColor={() => C.live}
            linkDirectionalParticleSpeed={0.012}
            cooldownTicks={140}
            d3VelocityDecay={0.32}
            warmupTicks={20}
          />
        )}
      </div>

      <AnimatePresence>
        {chatOpen && (
          <ChatPanel
            onSendMessage={handleSendMessage}
            messages={messages}
            isTyping={isTyping}
            onClear={clearChat}
            onCollapse={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Floating button to reopen the chat when collapsed */}
      <AnimatePresence>
        {!chatOpen && !selected && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setChatOpen(true)}
            aria-label="Open resume agent"
            className="absolute bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-signal text-ink font-medium shadow-2xl hover:bg-signal/90 transition-colors"
          >
            <MessageSquare size={18} />
            <span className="font-mono text-xs tracking-wide">Ask agent</span>
          </motion.button>
        )}
      </AnimatePresence>

      <NodeCard node={selected} onClose={closeCard} />
    </div>
  );
};

// ---- Click-to-inspect card: shows a node's description + metadata ----
const NodeCard: React.FC<{ node: GNode | null; onClose: () => void }> = ({
  node,
  onClose,
}) => {
  const meta = node?.meta;
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="absolute top-20 right-2 sm:right-4 w-84 max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-120px)] bg-panel/95 backdrop-blur-md border border-line rounded-2xl shadow-2xl z-30 flex flex-col overflow-hidden"
        >
          <div className="flex items-start justify-between gap-3 p-4 border-b border-line">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-paper leading-tight truncate">
                {node.label}
              </h3>
              {meta?.sublabel && (
                <span className="font-mono text-[11px] text-signal/90">
                  {meta.sublabel}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 p-1.5 bg-panel2 hover:bg-line text-paper/80 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {meta?.description && (
              <p className="text-sm text-paper/80 leading-relaxed">
                {meta.description}
              </p>
            )}

            {!!meta?.tags?.length && (
              <div className="flex flex-wrap gap-1.5">
                {meta.tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="font-mono text-[10px] px-2 py-0.5 bg-signal/10 text-signal rounded-sm border border-signal/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {(meta?.link || meta?.github) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {meta.link && (
                  <a
                    href={meta.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-signal/15 text-signal border border-signal/30 hover:bg-signal/25 transition-colors text-xs font-medium"
                  >
                    <ExternalLink size={14} /> Live
                  </a>
                )}
                {meta.github && (
                  <a
                    href={meta.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-panel2 text-paper/85 border border-line hover:border-signal/40 transition-colors text-xs font-medium"
                  >
                    <Github size={14} /> GitHub
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-line bg-panel2/50">
            <p className="font-mono text-[10px] text-muted">
              double-click the node to expand · single-click to inspect
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GraphLayout;
