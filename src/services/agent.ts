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
  experience: ExperienceData[];
  education: Education[];
  articles: Article[];
  contact: ContactInfo[];
}

export interface AgentReply {
  text: string;
  nodeIds: string[];
  edgeIds: string[];
}

// ---- Per-node metadata, surfaced in the graph's click-to-inspect card ----
export type NodeMetaType =
  | "root"
  | "hub"
  | "category"
  | "project"
  | "experience"
  | "skill";

export interface NodeMeta {
  type: NodeMetaType;
  description?: string;
  tags?: string[];
  link?: string;
  github?: string;
  sublabel?: string;
}

// ---- Stable node IDs (shared by the graph builder and the agent) ----
const ROOT = "root";
const HUB_SKILLS = "hub-skills";
const HUB_PROJECTS = "hub-projects";

const catId = (i: number) => `cat-${i}`;
const projId = (i: number) => `proj-${i}`;
const expId = (i: number) => `exp-${i}`;
const skillNodeId = (id: string) => `skill:${id}`;

const edgeRootSkills = "e-root-skills";
const edgeRootProjects = "e-root-projects";
const edgeExp = (i: number) => `e-root-exp-${i}`;
const edgeCat = (i: number) => `e-skills-cat-${i}`;
const edgeProjHub = (i: number) => `e-projects-proj-${i}`;
const edgeCatSkill = (ci: number, id: string) => `e-cat-${ci}-${id}`;
const edgeProjSkill = (pi: number, id: string) => `e-proj-${pi}-${id}`;

interface SkillEntry {
  id: string; // primary key (Sanity skill document _id)
  label: string; // display name
  real: boolean; // true = referenced by a skill category (curated), the source of truth
  cats: Set<number>; // skill-category indices this skill appears under
  projs: Set<number>; // project indices that reference this skill
}

/**
 * The skill graph is now a true relational model. Skills are first-class entities
 * (Sanity documents); both skill categories and project tooling hold REFERENCES to
 * them. We index by the skill's primary key (`id`), so a skill used by a category
 * and three projects is ONE shared node — referential integrity is enforced
 * upstream by Sanity, not by fuzzy name matching.
 *   - `real:true`  → referenced by at least one skill category (curated taxonomy).
 *   - `real:false` → referenced only by projects (a tool not in the curated taxonomy).
 */
function indexSkills(data: PortfolioData): Map<string, SkillEntry> {
  const skills = new Map<string, SkillEntry>();

  const upsert = (id: string, name: string) => {
    if (!skills.has(id)) skills.set(id, { id, label: name, real: false, cats: new Set(), projs: new Set() });
    const e = skills.get(id)!;
    if (name) e.label = name;
    return e;
  };

  // 1. Curated skills — referenced by categories (source of truth).
  data.skills.forEach((cat, ci) =>
    (cat.skills ?? []).forEach((s) => {
      if (!s?.id) return;
      const e = upsert(s.id, s.name);
      e.real = true;
      e.cats.add(ci);
    })
  );

  // 2. Project tools — foreign keys onto the same skill entities.
  data.projects.forEach((p, pi) =>
    (p.tools ?? []).forEach((t) => {
      if (!t?.id) return;
      upsert(t.id, t.name).projs.add(pi);
    })
  );

  return skills;
}

/**
 * Build the resume knowledge graph. Hierarchy:
 *   root → Skills hub → category → individual skill
 *   root → Projects hub → project → tool (REUSES the same skill node when shared)
 *   root → experience
 * Positions are placeholders — the force simulation lays everything out at runtime.
 */
export function buildGraph(data: PortfolioData): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const P = { x: 0, y: 0 };

  nodes.push({
    id: ROOT,
    type: "custom",
    position: P,
    data: {
      label: "Rushi Goswami",
      sublabel: "AI/ML Engineer",
      kind: "root",
      meta: {
        type: "root",
        sublabel: "AI/ML Engineer",
        description:
          "AI Engineer building production RAG pipelines, multi-agent systems, and Graph RAG with Generative AI.",
        tags: data.contact.map((c) => c.label).filter(Boolean),
      } as NodeMeta,
    },
  });

  nodes.push({
    id: HUB_SKILLS,
    type: "custom",
    position: P,
    data: {
      label: "Skills",
      kind: "hub",
      meta: {
        type: "hub",
        description: `${data.skills.length} skill categories spanning the stack.`,
        tags: data.skills.map((s) => s.title),
      } as NodeMeta,
    },
  });
  nodes.push({
    id: HUB_PROJECTS,
    type: "custom",
    position: P,
    data: {
      label: "Projects",
      kind: "hub",
      meta: {
        type: "hub",
        description: `${data.projects.length} flagship projects.`,
        tags: data.projects.map((p) => p.title),
      } as NodeMeta,
    },
  });
  edges.push({ id: edgeRootSkills, source: ROOT, target: HUB_SKILLS });
  edges.push({ id: edgeRootProjects, source: ROOT, target: HUB_PROJECTS });

  const skills = indexSkills(data);

  // One node per distinct skill (shared across categories + projects). `real`
  // distinguishes a curated skill from a project-only tool reference.
  skills.forEach((entry, id) => {
    const usedBy = [...entry.projs].map((pi) => data.projects[pi]?.title).filter(Boolean) as string[];
    const inCats = [...entry.cats].map((ci) => data.skills[ci]?.title).filter(Boolean) as string[];
    nodes.push({
      id: skillNodeId(id),
      type: "custom",
      position: P,
      data: {
        label: entry.label,
        kind: "leaf",
        real: entry.real,
        meta: {
          type: "skill",
          sublabel: entry.real ? "Curated skill" : "Project tool",
          description: usedBy.length
            ? `Used in ${listJoin(usedBy)}.`
            : entry.real
              ? "Part of the curated skill taxonomy."
              : "A tool referenced by a project.",
          tags: inCats,
        } as NodeMeta,
      },
    });
  });

  // Categories + their skill edges.
  data.skills.forEach((cat, ci) => {
    nodes.push({
      id: catId(ci),
      type: "custom",
      position: P,
      data: {
        label: cat.title,
        kind: "hub",
        meta: {
          type: "category",
          description: `${(cat.skills ?? []).length} skills in this category.`,
          tags: (cat.skills ?? []).map((s) => s.name),
        } as NodeMeta,
      },
    });
    edges.push({ id: edgeCat(ci), source: HUB_SKILLS, target: catId(ci) });
  });

  // Projects + their tool edges (reusing shared skill nodes).
  data.projects.forEach((proj, pi) => {
    nodes.push({
      id: projId(pi),
      type: "custom",
      position: P,
      data: {
        label: proj.title,
        kind: "hub",
        img: proj.imageUrl,
        meta: {
          type: "project",
          description: proj.description,
          tags: (proj.tools ?? []).map((t) => t.name),
          link: proj.link,
          github: proj.github,
        } as NodeMeta,
      },
    });
    edges.push({ id: edgeProjHub(pi), source: HUB_PROJECTS, target: projId(pi) });
  });

  // Wire every skill to its categories and projects.
  skills.forEach((entry, id) => {
    entry.cats.forEach((ci) =>
      edges.push({ id: edgeCatSkill(ci, id), source: catId(ci), target: skillNodeId(id) })
    );
    entry.projs.forEach((pi) =>
      edges.push({ id: edgeProjSkill(pi, id), source: projId(pi), target: skillNodeId(id) })
    );
  });

  // Experience nodes hang directly off root.
  data.experience.forEach((exp, i) => {
    nodes.push({
      id: expId(i),
      type: "custom",
      position: P,
      data: {
        label: exp.role,
        sublabel: exp.company,
        kind: "hub",
        meta: {
          type: "experience",
          sublabel: `${exp.company} · ${exp.duration}`,
          description: exp.description,
          tags: (exp.achievements ?? []).slice(0, 4),
        } as NodeMeta,
      },
    });
    edges.push({ id: edgeExp(i), source: ROOT, target: expId(i) });
  });

  return { nodes, edges };
}

// ---- Retrieval helpers ----
// Common English words that would otherwise substring-match real content
// ("do" → "Document", "you" → greeting "yo", etc.).
const STOPWORDS = new Set([
  "what", "which", "who", "whom", "how", "do", "does", "did", "you", "your", "yours",
  "have", "has", "had", "the", "and", "for", "are", "can", "could", "would", "should",
  "with", "about", "tell", "give", "show", "list", "any", "all", "use", "used", "using",
  "his", "him", "her", "she", "they", "this", "that", "these", "those", "from", "into",
  "out", "get", "got", "want", "need", "know", "see", "let",
]);
const tokenize = (q: string) =>
  q
    .toLowerCase()
    .match(/[a-z0-9+#.]+/g)
    ?.filter((t) => t.length >= 2 && !STOPWORDS.has(t)) ?? [];

const hits = (token: string, haystack: string) => haystack.toLowerCase().includes(token);

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

  // Greeting — exact-token match only, so "you" doesn't trip "yo" etc.
  const GREETINGS = ["hi", "hello", "hey", "yo", "sup", "greetings", "howdy"];
  if (tokens.some((t) => GREETINGS.includes(t))) {
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
    const e = data.education[0];
    return {
      text: e
        ? `Rushi holds a ${e.degree} from ${e.institution} (${e.duration}), ${e.gpa}.`
        : "Education details aren't loaded right now.",
      nodeIds: [ROOT],
      edgeIds: [],
    };
  }

  // Experience
  if (has(tokens, "experience", "work", "job", "role", "company", "career", "promact", "employer")) {
    if (!data.experience.length) return { text: "Experience details aren't loaded right now.", ...none };
    const e = data.experience[0];
    const top = (e.achievements ?? []).slice(0, 2).join("; ");
    return {
      text: `Rushi is a ${e.role} at ${e.company} (${e.duration}). Highlights: ${top}.`,
      nodeIds: [ROOT, ...data.experience.map((_, i) => expId(i))],
      edgeIds: data.experience.map((_, i) => edgeExp(i)),
    };
  }

  const skills = indexSkills(data);

  // Match individual skills by name. A matched skill lights its own node plus
  // every category and project it connects to — the cross-links become visible.
  const matchedSkillIds: string[] = [];
  skills.forEach((entry, id) => {
    if (tokens.some((t) => hits(t, entry.label))) matchedSkillIds.push(id);
  });

  // Match projects by title / description text too.
  const matchedProjects: number[] = [];
  data.projects.forEach((proj, i) => {
    const blob = `${proj.title ?? ""} ${proj.description ?? ""}`;
    if (tokens.some((t) => hits(t, blob))) matchedProjects.push(i);
  });

  const wantsAllProjects = has(tokens, "project", "projects", "built", "build", "portfolio");
  const wantsAllSkills = has(tokens, "skill", "skills", "tech", "stack", "technology", "tools");

  if (matchedSkillIds.length || matchedProjects.length) {
    const nodeIds = new Set<string>([ROOT]);
    const edgeIds = new Set<string>();
    const catHit = new Set<number>();
    const projHit = new Set<number>(matchedProjects);
    const skillLabels: string[] = [];

    for (const id of matchedSkillIds) {
      const entry = skills.get(id)!;
      skillLabels.push(entry.label);
      nodeIds.add(skillNodeId(id));
      entry.cats.forEach((ci) => {
        catHit.add(ci);
        nodeIds.add(catId(ci));
        edgeIds.add(edgeCatSkill(ci, id));
      });
      entry.projs.forEach((pi) => {
        projHit.add(pi);
        nodeIds.add(projId(pi));
        edgeIds.add(edgeProjSkill(pi, id));
      });
    }

    if (catHit.size) {
      nodeIds.add(HUB_SKILLS);
      edgeIds.add(edgeRootSkills);
      catHit.forEach((ci) => edgeIds.add(edgeCat(ci)));
    }
    if (projHit.size) {
      nodeIds.add(HUB_PROJECTS);
      edgeIds.add(edgeRootProjects);
      projHit.forEach((pi) => {
        nodeIds.add(projId(pi));
        edgeIds.add(edgeProjHub(pi));
      });
    }

    const parts: string[] = [];
    if (skillLabels.length) parts.push(`it maps to ${listJoin(unique(skillLabels))}`);
    if (projHit.size) {
      const titles = [...projHit].map((i) => data.projects[i].title);
      parts.push(`it shows up in ${listJoin(titles)}`);
    }

    return {
      text: `Good question — ${parts.join(", and ")}. The highlighted nodes trace the connections.`,
      nodeIds: [...nodeIds],
      edgeIds: [...edgeIds],
    };
  }

  if (wantsAllProjects) {
    return {
      text: `Rushi has shipped ${data.projects.length} flagship projects: ${listJoin(
        data.projects.map((p) => p.title)
      )}.`,
      nodeIds: [ROOT, HUB_PROJECTS, ...data.projects.map((_, i) => projId(i))],
      edgeIds: [edgeRootProjects, ...data.projects.map((_, i) => edgeProjHub(i))],
    };
  }

  if (wantsAllSkills) {
    return {
      text: `His skills span ${listJoin(data.skills.map((s) => s.title))}. Ask about any one to see where it's used.`,
      nodeIds: [ROOT, HUB_SKILLS, ...data.skills.map((_, i) => catId(i))],
      edgeIds: [edgeRootSkills, ...data.skills.map((_, i) => edgeCat(i))],
    };
  }

  return {
    text: "I don't have a match for that yet. Try a specific tool (e.g. \"LangChain\", \"FastAPI\", \"Neo4j\"), or ask about his projects, experience, or contact.",
    nodeIds: [ROOT],
    edgeIds: [],
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

function listJoin(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
