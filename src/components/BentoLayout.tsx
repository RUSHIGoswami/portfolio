import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchProjects,
  fetchSkills,
  fetchExperiences,
  fetchEducations,
  fetchArticles,
  fetchContact,
} from "../services/sanity";
import {
  Project,
  SkillCategory,
  ExperienceData,
  Education,
  Article,
  ContactInfo,
} from "../data/fallbackData";
import {
  ArrowUpRight,
  Code2,
  Bot,
  Database,
  Terminal,
  Microscope,
  Brain,
  Cloud,
  Mail,
  Phone,
  Share2,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { Github, Linkedin } from "./BrandIcons";
import ArticleReader from "./ArticleReader";
import DetailModal from "./DetailModal";

interface BentoLayoutProps {
  onOpenGraph: () => void;
}

// Map string icon names (from CMS/fallback) to Lucide components.
const SkillIconMap: Record<string, React.FC<any>> = {
  bot: Bot,
  code: Code2,
  database: Database,
  terminal: Terminal,
  microscope: Microscope,
  brain: Brain,
  cloud: Cloud,
};

const ContactIconMap: Record<string, React.FC<any>> = {
  mail: Mail,
  phone: Phone,
  linkedin: Linkedin,
  github: Github,
};

const MAX_ARTICLES = 4;
const AVATAR = `${import.meta.env.BASE_URL}rushigoswami.jpg`;

// Small monospace section label (kept for rhythm, now plain-language).
const Eyebrow: React.FC<{ label: string }> = ({ label }) => (
  <span className="readout flex items-center gap-2">
    <span className="h-1 w-1 rounded-full bg-signal" />
    {label}
  </span>
);

const cell =
  "relative bg-panel border border-line rounded-2xl overflow-hidden transition-colors hover:border-line/80";

// True masonry: measures each cell and packs it into the currently-shortest column,
// so columns stay balanced and no blank space opens under a short cell. CSS multicol
// can't do this because it won't split (or shortest-pack) atomic blocks.
const Masonry: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 16,
}) => {
  const items = React.useMemo(
    () => React.Children.toArray(children),
    [children],
  );
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [columns, setColumns] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1,
  );
  const [order, setOrder] = useState<number[][]>(() => {
    const cols =
      typeof window !== "undefined" && window.innerWidth >= 768 ? 2 : 1;
    const a = Array.from({ length: cols }, () => [] as number[]);
    items.forEach((_, i) => a[i % cols].push(i));
    return a;
  });

  useLayoutEffect(() => {
    const onResize = () => setColumns(window.innerWidth >= 768 ? 2 : 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Pack greedily into the shortest column whenever layout could have changed.
  useLayoutEffect(() => {
    const heights = items.map(
      (_, i) => itemRefs.current[i]?.getBoundingClientRect().height ?? 0,
    );
    const colH = Array(columns).fill(0);
    const assign = Array.from({ length: columns }, () => [] as number[]);
    items.forEach((_, i) => {
      const k = colH.indexOf(Math.min(...colH));
      assign[k].push(i);
      colH[k] += heights[i] + gap;
    });
    setOrder(assign);
  }, [columns, items, gap]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4 items-start">
      {order.map((col, ci) => (
        <div key={ci} className="flex-1 min-w-0 flex flex-col gap-4 w-full">
          {col.map(idx => (
            <div
              key={idx}
              ref={el => {
                itemRefs.current[idx] = el;
              }}
              className="w-full"
            >
              {items[idx]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Split a multi-line text field into clean point strings (drops blanks + leading bullet glyphs).
const toPoints = (text: string): string[] =>
  text
    .split(/\r?\n/)
    .map(l => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);

// Render a text field as bullet points when it has multiple lines, else a paragraph.
const RichText: React.FC<{ text: string }> = ({ text }) => {
  const points = toPoints(text);
  if (points.length <= 1) {
    return <p className="text-paper/85 leading-relaxed">{points[0] ?? text}</p>;
  }
  return (
    <ul className="space-y-2">
      {points.map((p, j) => (
        <li
          key={j}
          className="flex gap-3 text-paper/85 text-sm leading-relaxed"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
          {p}
        </li>
      ))}
    </ul>
  );
};

const BentoLayout: React.FC<BentoLayoutProps> = ({ onOpenGraph }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contact, setContact] = useState<ContactInfo[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExp, setSelectedExp] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      const [projData, skillData, expData, eduData, artData, contactData] =
        await Promise.all([
          fetchProjects(),
          fetchSkills(),
          fetchExperiences(),
          fetchEducations(),
          fetchArticles(),
          fetchContact(),
        ]);
      if (cancelled) return;
      setProjects(projData);
      setSkills(skillData);
      setExperiences(expData);
      setEducations(eduData);
      setArticles(artData);
      setContact(contactData);
      setLoading(false);
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-grid pt-12 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-48 bg-panel border border-line rounded-2xl animate-pulse ${
                i % 3 === 0 ? "md:col-span-2" : "md:col-span-1"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-grid pt-12 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Top row — identity, experience, graph entry. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Hero Cell (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${cell} col-span-1 md:col-span-2 row-span-1 p-8 flex flex-col justify-center group`}
        >
          <div className="absolute inset-0 bg-linear-to-br from-signal/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="hidden sm:block w-28 h-28 shrink-0 rounded-full overflow-hidden border-2 border-signal/50 shadow-lg ring-4 ring-signal/10">
              <img
                src={AVATAR}
                alt="Rushi Goswami"
                className="w-full h-full object-cover"
                style={{ transform: "scale(2.45)", transformOrigin: "55% 30%" }}
              />
            </div>
            <div>
              <div className="sm:hidden w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-signal/50 shadow-lg ring-4 ring-signal/10">
                <img
                  src={AVATAR}
                  alt="Rushi Goswami"
                  className="w-full h-full object-cover"
                  style={{
                    transform: "scale(2.45)",
                    transformOrigin: "55% 30%",
                  }}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-paper leading-[1.05]">
                Rushi <span className="text-signal">Goswami</span>
              </h1>
              <p className="mt-4 text-lg text-muted max-w-md">
                AI Engineer building production RAG pipelines, multi-agent
                systems, and Graph RAG with Generative AI.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {contact
                  .filter(item => item.link)
                  .map(item => {
                    const Icon = ContactIconMap[item.iconName] || Mail;
                    const external = item.link.startsWith("http");
                    return (
                      <a
                        key={item.label || item.link}
                        href={item.link}
                        target={external ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        title={item.value}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs bg-panel2 hover:bg-signal/10 text-paper/80 hover:text-signal rounded-md border border-line hover:border-signal/40 transition-colors"
                      >
                        <Icon size={14} />
                        <span className="hidden sm:inline">{item.label}</span>
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Experience Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cell} col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col`}
        >
          <Eyebrow label="Experience" />
          <div className="mt-4 flex-1 space-y-3">
            {experiences.map(exp => (
              <button
                type="button"
                key={`${exp.company}-${exp.role}`}
                onClick={() => setSelectedExp(exp)}
                className="group block w-full text-left cursor-pointer"
              >
                <h3 className="font-semibold text-paper leading-tight group-hover:text-signal transition-colors">
                  {exp.role}
                </h3>
                <p className="text-muted text-sm">{exp.company}</p>
                <p className="font-mono text-[11px] text-signal/90 mt-1">
                  {exp.duration}
                </p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Graph-mode launch cell */}
        <motion.button
          type="button"
          onClick={onOpenGraph}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${cell} col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col items-center justify-center text-center group border-signal/30! bg-linear-to-br from-signal/8 to-panel hover:border-signal/60!`}
        >
          <Share2
            size={28}
            className="text-signal mb-3 group-hover:scale-110 transition-transform"
          />
          <h3 className="font-semibold text-paper">Explore as a graph</h3>
          <p className="readout mt-2 normal-case tracking-normal text-[11px]">
            chat with my resume agent →
          </p>
        </motion.button>
      </div>

      {/* Content — JS masonry packs each cell into the shortest column (no blank gaps). */}
      <Masonry>
        {/* Skills Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${cell} break-inside-avoid p-6 md:p-8`}
        >
          <Eyebrow label="Skills" />
          <h2 className="mt-3 mb-6 text-2xl font-bold text-paper">
            Core Skills
          </h2>
          <div className="space-y-6">
            {skills.map(cat => {
              const Icon = SkillIconMap[cat.iconName] || Terminal;
              return (
                <div
                  key={cat.title}
                  className="flex flex-col sm:flex-row gap-4 sm:items-start"
                >
                  <div className="flex items-center gap-2 sm:w-1/3 text-paper/90">
                    <Icon size={16} className="text-signal" />
                    <span className="font-medium text-sm">{cat.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:w-2/3">
                    {(cat.skills ?? []).slice(0, 8).map((skill, j) => (
                      <span
                        key={skill.id ?? `${skill.name}-${j}`}
                        className="px-2.5 py-1 font-mono text-xs bg-panel2 text-paper/75 rounded-md border border-line"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {(cat.skills?.length ?? 0) > 8 && (
                      <span className="px-2.5 py-1 font-mono text-xs text-muted">
                        +{cat.skills.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Projects Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`${cell} break-inside-avoid p-6 md:p-8`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Eyebrow label="Projects" />
              <h2 className="mt-3 text-2xl font-bold text-paper">
                Featured Projects
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {projects.map(proj => (
              <button
                type="button"
                key={proj.title}
                onClick={() => setSelectedProject(proj)}
                className="group text-left bg-panel2 rounded-xl p-5 border border-line flex flex-col hover:border-signal/40 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-semibold text-paper group-hover:text-signal transition-colors">
                    {proj.title}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted group-hover:text-signal transition-colors"
                  />
                </div>
                <p className="text-sm text-muted line-clamp-3 mb-4">
                  {proj.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {(proj.tools ?? []).slice(0, 3).map((tool, j) => (
                    <span
                      key={tool.id ?? `${tool.name}-${j}`}
                      className="font-mono text-[10px] px-2 py-0.5 bg-signal/10 text-signal rounded-sm"
                    >
                      {tool.name}
                    </span>
                  ))}
                  {(proj.tools?.length ?? 0) > 3 && (
                    <span className="font-mono text-[10px] px-2 py-0.5 text-muted">
                      +{proj.tools.length - 3}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Education Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`${cell} break-inside-avoid p-6 md:p-8`}
        >
          <Eyebrow label="Education" />
          <div className="mt-4 space-y-5">
            {educations.map(edu => (
              <div
                key={`${edu.degree}-${edu.institution}`}
                className="flex items-start gap-4"
              >
                <div className="shrink-0 mt-1 p-2.5 rounded-xl bg-signal/10 border border-signal/20">
                  <GraduationCap size={20} className="text-signal" />
                </div>
                <div>
                  <h3 className="font-semibold text-paper text-lg leading-tight">
                    {edu.degree}
                  </h3>
                  <p className="text-muted">{edu.institution}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-signal/90">
                    <span>{edu.duration}</span>
                    <span>{edu.gpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Articles Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`${cell} break-inside-avoid p-6 md:p-8`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Eyebrow label="Articles" />
              <h2 className="mt-3 text-2xl font-bold text-paper">
                Latest Articles
              </h2>
            </div>
            <ArrowUpRight className="text-muted" />
          </div>
          <div className="space-y-4">
            {articles.slice(0, MAX_ARTICLES).map(article => (
              <button
                type="button"
                key={article.id}
                className="group block w-full text-left cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-paper group-hover:text-signal transition-colors">
                    {article.title}
                  </h3>
                  <span className="font-mono text-xs text-muted shrink-0 ml-4">
                    {article.date}
                  </span>
                </div>
                <p className="text-sm text-muted line-clamp-2">
                  {article.excerpt}
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </Masonry>

      {/* Article Reader Modal */}
      <ArticleReader
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Project detail */}
      <DetailModal
        open={!!selectedProject}
        title={selectedProject?.title ?? ""}
        onClose={() => setSelectedProject(null)}
      >
        {selectedProject && (
          <div className="space-y-6">
            <RichText text={selectedProject.description} />
            <div>
              <p className="readout mb-3">Tech stack</p>
              <div className="flex flex-wrap gap-2">
                {(selectedProject.tools ?? []).map((tool, j) => (
                  <span
                    key={tool.id ?? `${tool.name}-${j}`}
                    className="font-mono text-xs px-2.5 py-1 bg-signal/10 text-signal rounded-md border border-signal/20"
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
            </div>
            {(selectedProject.link || selectedProject.github) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-signal/15 text-signal border border-signal/30 hover:bg-signal/25 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={16} /> Live
                  </a>
                )}
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-panel2 text-paper/85 border border-line hover:border-signal/40 transition-colors text-sm font-medium"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </DetailModal>

      {/* Experience detail */}
      <DetailModal
        open={!!selectedExp}
        title={selectedExp?.role ?? ""}
        subtitle={
          selectedExp
            ? `${selectedExp.company} · ${selectedExp.duration}${
                selectedExp.location ? ` · ${selectedExp.location}` : ""
              }`
            : undefined
        }
        onClose={() => setSelectedExp(null)}
      >
        {selectedExp && (
          <div className="space-y-6">
            <RichText text={selectedExp.description} />
            {(selectedExp.achievements?.length ?? 0) > 0 && (
              <div>
                <p className="readout mb-3">Key achievements</p>
                <ul className="space-y-2">
                  {selectedExp.achievements.map((a, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-paper/85 text-sm leading-relaxed"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(selectedExp.responsibilities?.length ?? 0) > 0 && (
              <div>
                <p className="readout mb-3">Responsibilities</p>
                <ul className="space-y-2">
                  {selectedExp.responsibilities.map((r, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-paper/85 text-sm leading-relaxed"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </DetailModal>
    </div>
  );
};

export default BentoLayout;
