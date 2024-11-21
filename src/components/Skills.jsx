import { Box, Typography, Grid, Paper, Chip, useTheme } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CloudIcon from "@mui/icons-material/Cloud";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import TerminalIcon from "@mui/icons-material/Terminal";
import BiotechIcon from "@mui/icons-material/Biotech";
import { motion } from "framer-motion";
import { SectionWrapper } from "../ui/section-wrapper";

const skillCategories = [
  {
    title: "Languages",
    icon: <CodeIcon fontSize="large" color="primary" />,
    skills: ["Python", "JavaScript", "C++"],
  },
  {
    title: "Database",
    icon: <StorageIcon fontSize="large" color="primary" />,
    skills: ["Postgres", "Azure Data Tables", "MySQL", "Neo4j - Graph DB"],
  },
  {
    title: "Web Technologies",
    icon: <TerminalIcon fontSize="large" color="primary" />,
    skills: ["React", "Django", "FastAPI", "Flask", "Git/GitHub"],
  },
  {
    title: "Machine Learning",
    icon: <BiotechIcon fontSize="large" color="primary" />,
    skills: [
      "Linear regression",
      "Ridge & Lasso Regularization",
      "Logistic Regression",
      "Naive-Bayes Classifier",
      "KNN",
      "SVM",
      "Decision Tree",
      "Random Forest",
      "Ada-Boost & XG-Boost",
      "K-means Clustering",
    ],
  },
  {
    title: "Deep Learning & NLP",
    icon: <PsychologyIcon fontSize="large" color="primary" />,
    skills: [
      "NLTK",
      "Spacy",
      "TF-IDF",
      "Bag of Words",
      "Word2Vec",
      "CNNs",
      "LSTM",
      "Yolo",
      "Pytorch",
      "Tensorflow",
    ],
  },
  {
    title: "Generative AI",
    icon: <SmartToyIcon fontSize="large" color="primary" />,
    skills: [
      "OpenAI API",
      "LLMs (Llama, Mistral, Phi-mini, Reflection-based models)",
      "Prompt Engineering",
      "RAG",
      "Tool Calling",
      "Fine Tuning + PEFT",
      "VectorDBs",
      "Agents",
      "Langchain + LangGraph",
      "LlamaIndex",
      "HuggingFace tools",
      "Langfuse",
      "Cursor",
      "Windsurf",
    ],
  },
  {
    title: "Cloud services",
    icon: <CloudIcon fontSize="large" color="primary" />,
    skills: [
      "Azure AI services",
      "Azure Openai",
      "Azure AI search",
      "Azure Document Intelligence",
      "Azure Speech",
      "Azure Machine Learning",
      "AWS bedrock",
      "AWS sagemaker",
    ],
  },
];

export default function Skills() {
  const theme = useTheme();

  return (
    <SectionWrapper id="skills">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        >
          Skills
        </motion.h2>

        <Grid container spacing={4}>
          {skillCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  className="h-full p-6 bg-black/60 hover:bg-black/70 transition-all border border-white/10 rounded-lg"
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {category.icon}
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: {
                          xs: "1.1rem",
                          sm: "1.25rem",
                        },
                        color: "primary.main",
                        ml: 1,
                        fontWeight: 600,
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      flex: 1,
                      alignContent: "flex-start",
                    }}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                          color: "text.primary",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                          },
                          fontSize: "0.85rem",
                          height: "28px",
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </div>
    </SectionWrapper>
  );
}
