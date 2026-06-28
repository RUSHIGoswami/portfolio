export interface Education {
  degree: string;
  institution: string;
  duration: string;
  gpa: string;
}

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
  responsibilities: string[];
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

export const fallbackEducation: Education = {
  degree: "B.Tech in Computer Science",
  institution: "Marwadi University",
  duration: "2019-2023",
  gpa: "8.9/10",
};

export const fallbackExperience: ExperienceData = {
  company: "Promact Infotech",
  role: "Software Engineer",
  duration: "January 2023 - Present",
  description:
    "Working as a Software Engineer specializing in AI/ML development.",
  achievements: [
    "Developed and deployed multiple ML models improving business efficiency by 40%",
    "Implemented NLP solutions for automated text analysis and processing",
    "Created custom AI solutions for client-specific requirements",
    "Optimized existing ML pipelines reducing processing time by 30%",
  ],
  responsibilities: [
    "Design and implement ML models for various business applications",
    "Develop and maintain AI-powered software solutions",
    "Collaborate with cross-functional teams for project delivery",
    "Research and implement new AI/ML technologies",
  ],
};

export const fallbackProjects: Project[] = [
  {
    title: "AI based large construction project analyser",
    description:
      "Developed a production level micro-services architecture with multiple servers and lambdas to build construction project's operation and maintenance analysis, task generators, tender requirement extractions, tender bidding analysis and many more AI features.",
    tools: [
      "Python",
      "FastAPI",
      "Azure functions",
      "Azure OpenAI",
      "Langchain",
      "Unstructured",
      "Neo4j",
    ],
  },
  {
    title: "AI Legal Research Tool",
    description:
      "Developed an AI application for legal professionals with legal search engine, judgment summaries, research book generation and many more AI features. Engineered batch systems with 5 different ML pipeline running parallel on spot instances and built NER system to extract and classify legal entities from large legal document corpus.",
    tools: [
      "Flask",
      "Elasticsearch",
      "OpenAI API",
      "RAG",
      "BiLSTM",
      "Selenium",
      "Azure machine learning",
    ],
  },
  {
    title: "AI Sales Agent",
    description:
      "Implemented an AI application that automates the entire sales process, from building rapport to converting leads. Utilized chat and instructive agents, reduced API calls by 60% through code refactoring resulting efficient and cost-effective way to manage CRMs and drive sales.",
    tools: [
      "FastAPI",
      "Reactjs",
      "ChromaDB",
      "Agent Architectures",
      "OpenAI API",
      "Zapier",
      "Salesforce - Apex",
    ],
  },
];

export const fallbackSkills: SkillCategory[] = [
  {
    title: "Generative AI",
    iconName: "bot",
    skills: [
      "RAG",
      "VectorDBs",
      "Tool Calling",
      "Fine Tuning",
      "PEFT",
      "Agents",
      "LLMs (Llama, Mistral, Phi-mini, Reflection)",
      "OpenAI API",
      "Langchain",
      "LangGraph",
      "Langfuse",
      "LlamaIndex",
      "HuggingFace tools",
      "OpenRouter",
      "LiteLLM",
      "Cursor",
      "Windsurf",
    ],
  },
  {
    title: "Languages",
    iconName: "code",
    skills: ["Python", "JavaScript", "C++"],
  },
  {
    title: "Database",
    iconName: "database",
    skills: ["Postgres", "Azure Data Tables", "Neo4j - Graph DB"],
  },
  {
    title: "Web Technologies",
    iconName: "terminal",
    skills: ["React", "Django", "FastAPI", "Flask", "Git/GitHub"],
  },
  {
    title: "Machine Learning",
    iconName: "microscope",
    skills: [
      "Pandas",
      "Numpy",
      "Scikit-learn",
      "Matplotlib",
      "Linear regression",
      "Logistic Regression",
      "Decision Tree",
      "Random Forest",
      "SVM",
      "KNN",
    ],
  },
  {
    title: "Deep Learning & NLP",
    iconName: "brain",
    skills: [
      "Tensorflow",
      "Pytorch",
      "NLTK",
      "Spacy",
      "TF-IDF",
      "Word2Vec",
      "Bag of Words",
      "RNNs",
      "CNNs",
      "LSTM",
      "Yolo",
    ],
  },
  {
    title: "Cloud Services",
    iconName: "cloud",
    skills: [
      "Azure AI services",
      "Azure Openai",
      "Azure Speech",
      "Azure AI search",
      "Azure Machine Learning",
      "Azure Document Intelligence",
    ],
  },
];

export const fallbackArticles: Article[] = [
  {
    id: "welcome",
    title: "Welcome to my new interactive portfolio",
    excerpt: "Building a node-based interactive resume using React Flow and Sanity CMS.",
    date: "2026-06-27",
    content: "This is a placeholder article. In the future, I will write about my journey with GenAI, LangGraph, and other modern architectures here!",
  }
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
    value: "8140226399",
    link: "tel:8140226399",
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
