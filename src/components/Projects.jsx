import { Container, Grid, Stack, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { SectionWrapper } from "../ui/section-wrapper";

const Projects = () => {
  const projects = [
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

  return (
    <SectionWrapper id="projects">
      <Container className="relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        >
          Projects
        </motion.h2>

        <Grid container spacing={4}>
          {projects.map((project, idx) => (
            <Grid item xs={12} key={project.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-lg border border-white/10 bg-black/80 backdrop-blur-sm transition-all group"
              >
                <h3 className="text-xl font-semibold mb-4 text-white/90 group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-white/70 group-hover:text-white/80 transition-colors mb-4">
                  {project.description}
                </p>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  gap={1}
                  mt={2}
                >
                  {project.tools.map((tool) => (
                    <Chip
                      key={tool}
                      label={tool}
                      className="bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white border-white/20"
                    />
                  ))}
                </Stack>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </SectionWrapper>
  );
};

export default Projects;
