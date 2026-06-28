import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  fetchProjects,
  fetchSkills,
  fetchExperience,
  fetchArticles,
  fetchContact,
} from "../services/sanity";
import {
  Project,
  SkillCategory,
  ExperienceData,
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
} from "lucide-react";
import { Github, Linkedin } from "./BrandIcons";
import ArticleReader from "./ArticleReader";

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

// Monospace "schematic" eyebrow — a node coordinate that ties cards to the graph identity.
const Eyebrow: React.FC<{ id: string }> = ({ id }) => (
  <span className="readout flex items-center gap-2">
    <span className="h-1 w-1 rounded-full bg-signal" />
    {id}
  </span>
);

const cell =
  "relative bg-panel border border-line rounded-2xl overflow-hidden transition-colors hover:border-line/80";

const BentoLayout: React.FC<BentoLayoutProps> = ({ onOpenGraph }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contact, setContact] = useState<ContactInfo[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      const [projData, skillData, expData, artData, contactData] = await Promise.all([
        fetchProjects(),
        fetchSkills(),
        fetchExperience(),
        fetchArticles(),
        fetchContact(),
      ]);
      if (cancelled) return;
      setProjects(projData);
      setSkills(skillData);
      setExperience(expData);
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
      <div className="bg-grid pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
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
    <div className="bg-grid pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[auto_auto_auto] gap-4">

        {/* Hero Cell (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${cell} col-span-1 md:col-span-2 row-span-1 p-8 flex flex-col justify-center group`}
        >
          <div className="absolute inset-0 bg-linear-to-br from-signal/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <Eyebrow id="node:root" />
            <h1 className="mt-4 text-4xl md:text-5xl font-bold text-paper leading-[1.05]">
              Rushi <span className="text-signal">Goswami</span>
            </h1>
            <p className="mt-4 text-lg text-muted max-w-md">
              Software Engineer building agents, RAG systems, and intelligent full-stack products with
              Generative AI.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {contact.map((item) => {
                const Icon = ContactIconMap[item.iconName] || Mail;
                return (
                  <a
                    key={item.label}
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
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
        </motion.div>

        {/* Experience Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${cell} col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col`}
        >
          <Eyebrow id="node:experience" />
          {experience && (
            <div className="mt-4 flex-1">
              <h3 className="font-semibold text-paper text-lg leading-tight">{experience.role}</h3>
              <p className="text-muted">{experience.company}</p>
              <p className="font-mono text-xs text-signal/90 mt-2">{experience.duration}</p>
            </div>
          )}
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
          <Share2 size={28} className="text-signal mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-paper">Explore as a graph</h3>
          <p className="readout mt-2 normal-case tracking-normal text-[11px]">
            chat with my resume agent →
          </p>
        </motion.button>

        {/* Skills Cell (Spans 2 columns) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${cell} col-span-1 md:col-span-2 row-span-2 p-6 md:p-8`}
        >
          <Eyebrow id="node:skills" />
          <h2 className="mt-3 mb-6 text-2xl font-bold text-paper">Core Skills</h2>
          <div className="space-y-6">
            {skills.map((cat) => {
              const Icon = SkillIconMap[cat.iconName] || Terminal;
              return (
                <div key={cat.title} className="flex flex-col sm:flex-row gap-4 sm:items-start">
                  <div className="flex items-center gap-2 sm:w-1/3 text-paper/90">
                    <Icon size={16} className="text-signal" />
                    <span className="font-medium text-sm">{cat.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:w-2/3">
                    {cat.skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 font-mono text-xs bg-panel2 text-paper/75 rounded-md border border-line"
                      >
                        {skill}
                      </span>
                    ))}
                    {cat.skills.length > 8 && (
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
          className={`${cell} col-span-1 md:col-span-2 row-span-1 p-6 md:p-8 flex flex-col`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Eyebrow id="node:projects" />
              <h2 className="mt-3 text-2xl font-bold text-paper">Featured Projects</h2>
            </div>
            <ArrowUpRight className="text-muted" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.title}
                className="bg-panel2 rounded-xl p-5 border border-line flex flex-col hover:border-signal/30 transition-colors"
              >
                <h3 className="font-semibold text-paper mb-2">{proj.title}</h3>
                <p className="text-sm text-muted line-clamp-3 mb-4">{proj.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {proj.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="font-mono text-[10px] px-2 py-0.5 bg-signal/10 text-signal rounded-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Articles Cell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`${cell} col-span-1 md:col-span-2 row-span-1 p-6 md:p-8`}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Eyebrow id="node:writing" />
              <h2 className="mt-3 text-2xl font-bold text-paper">Latest Articles</h2>
            </div>
            <ArrowUpRight className="text-muted" />
          </div>
          <div className="space-y-4">
            {articles.slice(0, MAX_ARTICLES).map((article) => (
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
                  <span className="font-mono text-xs text-muted shrink-0 ml-4">{article.date}</span>
                </div>
                <p className="text-sm text-muted line-clamp-2">{article.excerpt}</p>
              </button>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Article Reader Modal */}
      <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </div>
  );
};

export default BentoLayout;
