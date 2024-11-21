import { motion } from "framer-motion";
import { SectionWrapper } from "../ui/section-wrapper";

interface Education {
  degree: string;
  institution: string;
  duration: string;
  gpa: string;
}

interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  description: string;
  achievements: string[];
  responsibilities: string[];
  education: Education;
}

const experienceData: ExperienceData = {
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
  education: {
    degree: "B.Tech in Computer Science",
    institution: "Marwadi University",
    duration: "2019-2023",
    gpa: "8.9/10",
  },
};

const About: React.FC = () => {
  return (
    <SectionWrapper id="about me">
      <div className="flex flex-col items-center justify-center" id="about">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            About Me
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            A passionate software engineer specializing in AI/ML development
            with a strong foundation in computer science.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {/* Education Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            className="p-6 rounded-xl border border-white/10 bg-black/60 hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-500">
              Education
            </h3>
            <div className="space-y-2">
              <p className="text-white font-semibold">
                {experienceData.education.degree}
              </p>
              <p className="text-white/80">
                {experienceData.education.institution}
              </p>
              <p className="text-white/80">
                {experienceData.education.duration}
              </p>
              <p className="text-white/80">
                GPA: {experienceData.education.gpa}
              </p>
            </div>
          </motion.div>

          {/* Experience Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            className="p-6 rounded-xl border border-white/10 bg-black/60 hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-500">
              Experience
            </h3>
            <div className="space-y-2">
              <p className="text-white font-semibold">{experienceData.role}</p>
              <p className="text-white/80">{experienceData.company}</p>
              <p className="text-white/80">{experienceData.duration}</p>
              <p className="text-white/80">{experienceData.description}</p>
            </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            className="p-6 rounded-xl border border-white/10 bg-black/60 hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-500">
              Achievements
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {experienceData.achievements.map((achievement, index) => (
                <li key={index} className="text-white/80">
                  {achievement}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Responsibilities Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            className="p-6 rounded-xl border border-white/10 bg-black/60 hover:bg-black/70 transition-all backdrop-blur-sm"
          >
            <h3 className="text-2xl font-bold mb-4 text-purple-500">
              Responsibilities
            </h3>
            <ul className="list-disc list-inside space-y-2">
              {experienceData.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-white/80">
                  {responsibility}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
