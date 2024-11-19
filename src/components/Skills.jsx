import { Box, Typography, Container, Grid, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CloudIcon from '@mui/icons-material/Cloud';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TerminalIcon from '@mui/icons-material/Terminal';
import BiotechIcon from '@mui/icons-material/Biotech';
import { motion } from "framer-motion";

const Skills = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const skillCategories = [
    {
      title: "Languages",
      icon: <CodeIcon fontSize="large" color="primary" />,
      skills: ["Python", "JavaScript", "C++"],
    },
    {
      title: "Database",
      icon: <StorageIcon fontSize="large" color="primary" />,
      skills: ["Postgres", "Azure Data Tables", "MySQL", "Neo4j- Graph DB"],
    },
    {
      title: "Web Technologies",
      icon: <TerminalIcon fontSize="large" color="primary" />,
      skills: ["React", "Django", "FastAPI", "Flask", "Git/GitHub", "VSCode"],
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
        "Ada-Boost",
        "XG-Boost",
        "K-means Clustering",
      ],
    },
    {
      title: "Deep Learning & NLP",
      icon: <PsychologyIcon fontSize="large" color="primary" />,
      skills: [
        "NLTK",
        "Spacy",
        "Stop-words",
        "Stemming",
        "Lemmatization",
        "Tokenization",
        "TF-IDF",
        "Bag of Words",
        "Word2Vec",
        "RNNs",
        "CNNs",
        "LSTM",
        "Yolo",
        "Activation Functions",
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
        "Fine Tuning",
        "PEFT",
        "VectorDBs",
        "Agents",
        "Langchain",
        "LanGraph",
        "LlamaIndex",
        "HuggingFace tools",
        "Langfuse",
        "Cursor",
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
        "AWS SQS",
      ],
    },
  ];

  return (
    <Box id="skills" py={8} className="relative" sx={{ bgcolor: 'background.paper' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      </div>

      <Container maxWidth="lg" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant={isSmallScreen ? 'h4' : 'h3'} 
            component="h2" 
            textAlign="center" 
            gutterBottom
            sx={{
              fontSize: {
                xs: '2rem',
                sm: '2.5rem',
                md: '3rem'
              },
              mb: 6,
              textGradient: 'linear-gradient(to right, #2196f3, #7a1bff)',
            }}
          >
            Skills & Technologies
          </Typography>
        </motion.div>
        
        <Grid container spacing={4}>
          {skillCategories.map((category, index) => (
            <Grid item xs={12} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper 
                  elevation={3}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows[10],
                    },
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {category.icon}
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontSize: {
                          xs: '1.1rem',
                          sm: '1.25rem'
                        },
                        color: 'primary.main',
                        ml: 1,
                        fontWeight: 600
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {category.skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        sx={{
                          m: 0.5,
                          fontSize: {
                            xs: '0.75rem',
                            sm: '0.875rem'
                          },
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                          }
                        }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Skills;
