import type { Edge, Node } from "@xyflow/react";
import {
  Project,
  SkillCategory,
  ExperienceData,
  Education,
  Article,
  ContactInfo,
} from "../data/fallbackData";

/**
 * A fully client-side "resume agent". No LLM, no API key, no network call — it
 * reasons over Rushi's structured resume data with keyword retrieval and returns
 * both a written answer and the graph nodes/edges to light up. This keeps the
 * portfolio safe to deploy as a static site (a public LLM key would be drainable),
 * while still feeling responsive and grounded in real data.
 */

export interface PortfolioData {
  projects: Project[];
  skills: SkillCategory[];
  experience: ExperienceData | null;
  education: Education | null;
  articles: Article[];
  contact: ContactInfo[];
}

export interface AgentReply {
  text: string;
  nodeIds: string[];
  edgeIds: string[];
}

// ---- Stable node IDs (shared by the graph builder and the agent) ----
const ROOT = "root";
const HUB_SKILLS = "hub-skills";
const HUB_PROJECTS = "hub-projects";
const NODE_EXP = "node-exp";

const skillId = (i: number) => `skill-${i}`;
const projId = (i: number) => `proj-${i}`;

const edgeRootSkills = "e-root-skills";
const edgeRootProjects = "e-root-projects";
const edgeRootExp = "e-root-exp";
const edgeSkill = (i: number) => `e-skills-${i}`;
const edgeProj = (i: number) => `e-projects-${i}`;

/**
 * Lay the resume out as a radial knowledge graph: root in the centre, the
 * Skills and Projects hubs to either side, Experience below, and a fan of
 * leaves around each hub. Positions are derived from data length so the graph
 * stays balanced whatever the CMS returns.
 */
export function buildGraph(data: PortfolioData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: ROOT,
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: "Rushi Goswami", sublabel: "AI/ML Engineer", kind: "root" },
  });

  // Skills hub + leaves (fan to the upper-left).
  nodes.push({
    id: HUB_SKILLS,
    type: "custom",
    position: { x: -340, y: -120 },
    data: { label: "Skills", kind: "hub" },
  });
  edges.push({ id: edgeRootSkills, source: ROOT, target: HUB_SKILLS });
  data.skills.forEach((cat, i) => {
    const t = data.skills.length > 1 ? i / (data.skills.length - 1) : 0.5;
    const angle = Math.PI * (0.95 + t * 0.7); // sweep across the left side
    nodes.push({
      id: skillId(i),
      type: "custom",
      position: { x: -340 + Math.cos(angle) * 260, y: -120 + Math.sin(angle) * 260 },
      data: { label: cat.title, kind: "leaf" },
    });
    edges.push({ id: edgeSkill(i), source: HUB_SKILLS, target: skillId(i) });
  });

  // Projects hub + leaves (fan to the upper-right).
  nodes.push({
    id: HUB_PROJECTS,
    type: "custom",
    position: { x: 340, y: -120 },
    data: { label: "Projects", kind: "hub" },
  });
  edges.push({ id: edgeRootProjects, source: ROOT, target: HUB_PROJECTS });
  data.projects.forEach((proj, i) => {
    const t = data.projects.length > 1 ? i / (data.projects.length - 1) : 0.5;
    const angle = Math.PI * (0.05 + t * 0.7) * -1; // sweep across the right side
    nodes.push({
      id: projId(i),
      type: "custom",
      position: { x: 340 + Math.cos(angle) * 280, y: -120 + Math.sin(angle) * 280 },
      data: { label: proj.title, kind: "leaf" },
    });
    edges.push({ id: edgeProj(i), source: HUB_PROJECTS, target: projId(i) });
  });

  // Experience node (below root).
  if (data.experience) {
    nodes.push({
      id: NODE_EXP,
      type: "custom",
      position: { x: 0, y: 320 },
      data: {
        label: data.experience.role,
        sublabel: data.experience.company,
        kind: "hub",
      },
    });
    edges.push({ id: edgeRootExp, source: ROOT, target: NODE_EXP });
  }

  return { nodes, edges };
}

// ---- Retrieval helpers ----
const tokenize = (q: string) =>
  q.toLowerCase().match(/[a-z0-9+#.]+/g)?.filter((t) => t.length >= 2) ?? [];

const hits = (token: string, haystack: string) =>
  haystack.toLowerCase().includes(token);

const has = (tokens: string[], ...words: string[]) =>
  tokens.some((t) => words.some((w) => t === w || t.includes(w)));

/** The suggestion chips shown under the greeting. */
export const SUGGESTIONS = [
  "What projects use LangChain?",
  "Tell me about your experience",
  "What GenAI skills do you have?",
  "How can I reach you?",
];

/**
 * Answer a free-text question over the resume data. Returns the reply plus the
 * node/edge IDs to highlight in the graph.
 */
export function answer(query: string, data: PortfolioData): AgentReply {
  const tokens = tokenize(query);
  const none = { nodeIds: [] as string[], edgeIds: [] as string[] };

  if (tokens.length === 0) {
    return { text: "Ask me about Rushi's projects, skills, experience, or how to reach him.", ...none };
  }

  // Greeting
  if (has(tokens, "hi", "hello", "hey", "yo", "sup", "greetings")) {
    return {
      text: "Hi! I'm Rushi's resume agent. Ask about his projects, skills, experience, or contact details — the graph will light up the relevant nodes.",
      nodeIds: [ROOT],
      edgeIds: [],
    };
  }

  // Contact
  if (has(tokens, "contact", "email", "reach", "hire", "linkedin", "github", "phone", "connect", "mail")) {
    const lines = data.contact.map((c) => `${c.label}: ${c.value}`).join("  ·  ");
    return {
      text: data.contact.length
        ? `You can reach Rushi here — ${lines}.`
        : "Contact details aren't loaded right now.",
      nodeIds: [ROOT],
      edgeIds: [],
    };
  }

  // Education
  if (has(tokens, "education", "study", "studied", "degree", "college", "university", "gpa", "graduate")) {
    const e = data.education;
    return {
      text: e
        ? `Rushi holds a ${e.degree} from ${e.institution} (${e.duration}), GPA ${e.gpa}.`
        : "Education details aren't loaded right now.",
      nodeIds: [ROOT],
      edgeIds: [],
    };
  }

  // Experience
  if (has(tokens, "experience", "work", "job", "role", "company", "career", "promact", "employer")) {
    const e = data.experience;
    if (!e) return { text: "Experience details aren't loaded right now.", ...none };
    const top = e.achievements.slice(0, 2).join("; ");
    return {
      text: `Rushi is a ${e.role} at ${e.company} (${e.duration}). Highlights: ${top}.`,
      nodeIds: [ROOT, NODE_EXP],
      edgeIds: [edgeRootExp],
    };
  }

  // Tech-term search across skills + project tooling.
  const matchedSkills: number[] = [];
  data.skills.forEach((cat, i) => {
    const blob = `${cat.title} ${cat.skills.join(" ")}`;
    if (tokens.some((t) => hits(t, blob))) matchedSkills.push(i);
  });

  const matchedProjects: number[] = [];
  data.projects.forEach((proj, i) => {
    const blob = `${proj.title} ${proj.description} ${proj.tools.join(" ")}`;
    if (tokens.some((t) => hits(t, blob))) matchedProjects.push(i);
  });

  const wantsAllProjects = has(tokens, "project", "projects", "built", "build", "portfolio");
  const wantsAllSkills = has(tokens, "skill", "skills", "tech", "stack", "technology", "tools");

  if (matchedSkills.length || matchedProjects.length) {
    const nodeIds = [ROOT];
    const edgeIds: string[] = [];
    const parts: string[] = [];

    if (matchedProjects.length) {
      nodeIds.push(HUB_PROJECTS, ...matchedProjects.map(projId));
      edgeIds.push(edgeRootProjects, ...matchedProjects.map(edgeProj));
      const titles = matchedProjects.map((i) => data.projects[i].title);
      parts.push(`it shows up in ${listJoin(titles)}`);
    }
    if (matchedSkills.length) {
      nodeIds.push(HUB_SKILLS, ...matchedSkills.map(skillId));
      edgeIds.push(edgeRootSkills, ...matchedSkills.map(edgeSkill));
      const cats = matchedSkills.map((i) => data.skills[i].title);
      parts.push(`it sits under ${listJoin(cats)}`);
    }

    return {
      text: `Good question — ${parts.join(", and ")}. Highlighted nodes show the connections.`,
      nodeIds,
      edgeIds,
    };
  }

  if (wantsAllProjects) {
    return {
      text: `Rushi has shipped ${data.projects.length} flagship projects: ${listJoin(
        data.projects.map((p) => p.title)
      )}.`,
      nodeIds: [ROOT, HUB_PROJECTS, ...data.projects.map((_, i) => projId(i))],
      edgeIds: [edgeRootProjects, ...data.projects.map((_, i) => edgeProj(i))],
    };
  }

  if (wantsAllSkills) {
    return {
      text: `His skills span ${listJoin(data.skills.map((s) => s.title))}. Ask about any one to see where it's used.`,
      nodeIds: [ROOT, HUB_SKILLS, ...data.skills.map((_, i) => skillId(i))],
      edgeIds: [edgeRootSkills, ...data.skills.map((_, i) => edgeSkill(i))],
    };
  }

  return {
    text: "I don't have a match for that yet. Try a specific tool (e.g. \"LangChain\", \"FastAPI\", \"Neo4j\"), or ask about his projects, experience, or contact.",
    nodeIds: [ROOT],
    edgeIds: [],
  };
}

function listJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
