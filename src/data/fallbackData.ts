export interface Education {
  degree: string;
  institution: string;
  duration: string;
  gpa: string;
  order?: number;
}

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  location?: string;
  description: string;
  achievements: string[];
  responsibilities: string[];
  order?: number;
}

export interface Project {
  title: string;
  description: string;
  tools: string[];
  link?: string;
  github?: string;
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  skills: string[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export interface ContactInfo {
  iconName: string;
  label: string;
  value: string;
  link: string;
}

export const fallbackEducations: Education[] = [
  {
    degree: "B.Tech in Computer Science Engineering",
    institution: "Marwadi University, Rajkot",
    duration: "2019 - 2023",
    gpa: "CGPA 8.9 / 10.0",
    order: 0,
  },
  {
    degree: "Higher Secondary Certificate (HSC)",
    institution: "GSHEB Board, Surendranagar",
    duration: "2018 - 2019",
    gpa: "88%",
    order: 1,
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "GSEB Board, Surendranagar",
    duration: "2016 - 2017",
    gpa: "89%",
    order: 2,
  },
];

export const fallbackExperiences: ExperienceData[] = [
  {
    company: "Promact Infotech",
    role: "AI Engineer",
    duration: "Jan 2023 - Present",
    location: "Vadodara, Gujarat",
    description:
      "Building production-grade Generative & Agentic AI — RAG pipelines, multi-agent orchestration, and Graph RAG across 8+ enterprise projects in construction, legal, sustainability, and sales.",
    achievements: [
      "Achieved 90%+ reduction in analysis time on the flagship construction analyser vs. manual processes.",
      "Cut redundant LLM API calls by 60% through architecture-level prompt and pipeline optimization.",
      "Recognized with the \"Fire Fighter\" and \"Ace of Initiatives\" awards.",
      "Delivered 8+ enterprise AI projects end-to-end, from architecture through production.",
    ],
    responsibilities: [
      "Own end-to-end delivery — system design, technical planning, and production validation.",
      "Lead code reviews and mentor junior engineers on performance, security, and scalability.",
      "Engineer prompts, guardrails, and output evaluation to meet enterprise-grade accuracy.",
    ],
    order: 0,
  },
];

export const fallbackProjects: Project[] = [
  {
    title: "AI-Based Large Construction Project Analyser",
    description:
      "Architected a production-grade micro-services AI platform digitizing the construction domain. Designed multi-stage RAG pipelines achieving a 90% reduction in analysis time vs. manual processes, with Graph RAG (Neo4j + KGLM), human-in-the-loop feedback, and async Azure Functions for scalable parallel document processing.",
    tools: [
      "Python",
      "FastAPI",
      "Azure Functions",
      "Azure OpenAI",
      "LangChain",
      "Graph RAG",
      "Neo4j",
    ],
  },
  {
    title: "Bot Engine — Custom AI Chatbot Builder",
    description:
      "Led end-to-end system design of a multi-framework RAG chatbot builder, simultaneously implementing LangChain, LangGraph, and Microsoft Semantic Kernel. Integrated Anthropic Claude API, Azure OpenAI, and Azure AI Search for high-accuracy semantic search, with rigorous prompt testing, guardrails, and output evaluation for enterprise-grade accuracy.",
    tools: [
      "LangChain",
      "LangGraph",
      "Semantic Kernel",
      "Anthropic Claude API",
      "Azure OpenAI",
      "Azure AI Search",
    ],
  },
  {
    title: "AI Sustainability Analyser & Multi-Agent System",
    description:
      "Architected an Agentic AI platform for SME sustainability compliance, featuring Double Materiality Analysis and multi-agent knowledge-graph chatbots over European regulatory directives. Built multi-agent RAG pipelines with Azure OpenAI tool calling and structured output, on an async Azure Functions micro-service architecture.",
    tools: [
      "Azure OpenAI",
      "Multi-Agent",
      "LlamaIndex",
      "LlamaParse",
      "Azure Document Intelligence",
      "Neo4j",
    ],
  },
  {
    title: "AI Legal Research Tool",
    description:
      "Transformed a weeks-long manual legal research process into an AI-driven workflow completing full analyses in minutes — covering legal search, judgment summarization, and acts & sections analysis. Engineered 5 ML batch pipelines running in parallel on AWS spot instances, trained a BiLSTM NER model from scratch, and set up Elasticsearch semantic search.",
    tools: [
      "Elasticsearch",
      "BiLSTM NER",
      "Azure ML",
      "AWS Spot",
      "Selenium",
      "RAG",
    ],
  },
  {
    title: "Dawat AI — LangGraph Multi-Agent System",
    description:
      "Architected a smart culinary and dietary orchestration engine using LangGraph and role-based AI agents. Engineered complex routing logic to resolve intricate constraints, including specific nutritional diets and deep cultural food contexts.",
    tools: ["LangGraph", "Role-based Agents", "Python"],
    github: "https://github.com/rushigoswami",
  },
  {
    title: "Financial Document Extractor — VLM PoC",
    description:
      "Built a proof-of-concept using open-source Vision Language Models to perform accurate Named Entity Recognition, automating extraction of structured entities from complex, unstructured financial documents and images.",
    tools: ["Vision Language Models", "NER", "Python"],
    github: "https://github.com/rushigoswami",
  },
];

export const fallbackSkills: SkillCategory[] = [
  {
    title: "Generative AI",
    iconName: "bot",
    skills: [
      "RAG",
      "Graph-RAG (Neo4j)",
      "Agentic AI",
      "Agent Orchestrators",
      "LangChain",
      "LangGraph",
      "LlamaIndex",
      "Crew AI",
      "HuggingFace",
      "Prompt Engineering (CoT, Few-shot)",
    ],
  },
  {
    title: "LLM Providers",
    iconName: "brain",
    skills: [
      "OpenAI API",
      "Anthropic API (Claude)",
      "Gemini API",
      "Azure OpenAI",
      "OpenRouter",
    ],
  },
  {
    title: "Frameworks",
    iconName: "terminal",
    skills: ["FastAPI", "Flask", "Pydantic", "SQLAlchemy", "Alembic", "REST APIs"],
  },
  {
    title: "Databases",
    iconName: "database",
    skills: [
      "PostgreSQL",
      "Elasticsearch",
      "Neo4j",
      "Azure Data Tables",
      "ChromaDB",
      "Milvus",
      "Azure AI Search",
    ],
  },
  {
    title: "ML & NLP",
    iconName: "microscope",
    skills: ["Core ML Algorithms", "Fine-Tuning", "PEFT", "BiLSTM", "NER"],
  },
  {
    title: "Observability",
    iconName: "cloud",
    skills: ["Langfuse", "LangSmith", "WandB Weave"],
  },
  {
    title: "Tooling & Other",
    iconName: "code",
    skills: [
      "Python",
      "JavaScript",
      "Selenium",
      "MCP",
      "Git",
      "Jira",
      "Cursor",
      "Claude Code",
      "NotebookLM",
    ],
  },
];

export const fallbackArticles: Article[] = [
  {
    id: "welcome",
    title: "Welcome to my new interactive portfolio",
    excerpt: "Building a node-based interactive resume using React Flow and Sanity CMS.",
    date: "2026-06-27",
    content:
      "This is a placeholder article. In the future, I will write about my journey with GenAI, LangGraph, and other modern architectures here!",
  },
];

export const fallbackContact: ContactInfo[] = [
  {
    iconName: "mail",
    label: "Email",
    value: "goswamirushi39@gmail.com",
    link: "mailto:goswamirushi39@gmail.com",
  },
  {
    iconName: "phone",
    label: "Phone",
    value: "+91 81402 26399",
    link: "tel:+918140226399",
  },
  {
    iconName: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/rushigoswami",
    link: "https://linkedin.com/in/rushigoswami",
  },
  {
    iconName: "github",
    label: "GitHub",
    value: "github.com/rushigoswami",
    link: "https://github.com/rushigoswami",
  },
];
