import { motion } from "framer-motion";
import { SectionWrapper } from "../ui/section-wrapper";
import { ReactElement } from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import TerminalIcon from "@mui/icons-material/Terminal";
import BiotechIcon from "@mui/icons-material/Biotech";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import PsychologyIcon from "@mui/icons-material/Psychology";

interface SkillCategory {
  title: string;
  icon: ReactElement;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Generative AI",
    icon: <SmartToyIcon className="w-8 h-8 text-purple-500" />,
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
    icon: <CodeIcon className="w-8 h-8 text-purple-500" />,
    skills: ["Python", "JavaScript", "C++"],
  },
  {
    title: "Database",
    icon: <StorageIcon className="w-8 h-8 text-purple-500" />,
    skills: ["Postgres", "Azure Data Tables", "Neo4j - Graph DB"],
  },
  {
    title: "Web Technologies",
    icon: <TerminalIcon className="w-8 h-8 text-purple-500" />,
    skills: ["React", "Django", "FastAPI", "Flask", "Git/GitHub"],
  },
  {
    title: "Machine Learning",
    icon: <BiotechIcon className="w-8 h-8 text-purple-500" />,
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
    icon: <PsychologyIcon className="w-8 h-8 text-purple-500" />,
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
    icon: <CloudQueueIcon className="w-8 h-8 text-purple-500" />,
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

interface SkillChipProps {
  skill: string;
}

const SkillChip: React.FC<SkillChipProps> = ({ skill }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.015 }}
      transition={{ duration: 0.15 }}
      className="inline-block px-3 py-1 m-1 rounded-full text-sm font-medium bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transform-gpu will-change-transform"
    >
      {skill}
    </motion.span>
  );
};

const Skills: React.FC = () => {
  return (
    <SectionWrapper id="skills and technologies">
      <div className="container mx-auto px-4" id="skills">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        >
          Skills & Technologies
        </motion.h2>
        <div className="flex flex-col gap-8">
          {/* Gen AI Card */}
          <motion.div
            key={skillCategories[0].title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.005 }}
            transition={{ duration: 0.15 }}
            className="p-8 rounded-lg bg-gradient-to-r from-purple-900/20 via-purple-900/35 to-purple-900/40 border border-purple-500/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transform-gpu will-change-transform"
          >
            <div className="flex items-center mb-6">
              <div className="p-4 rounded-full bg-purple-500/10">
                {skillCategories[0].icon}
              </div>
              <h3 className="text-2xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-500/80">
                {skillCategories[0].title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillCategories[0].skills.map((skill) => (
                <SkillChip key={skill} skill={skill} />
              ))}
            </div>
          </motion.div>

          {/* Other Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.slice(1).map((category, _) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.005 }}
                transition={{ duration: 0.15 }}
                className="p-6 rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/5 transform-gpu will-change-transform group"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold ml-4 text-purple-500">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Skills;
