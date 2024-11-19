import { motion } from "framer-motion";

const experienceData = {
  company: "Promact Infotech",
  role: "Software Engineer",
  duration: "July 2023 - Present",
  description: "Working as a Software Engineer specializing in AI/ML development.",
  achievements: [
    "Developed and deployed multiple ML models improving business efficiency by 40%",
    "Implemented NLP solutions for automated text analysis and processing",
    "Created custom AI solutions for client-specific requirements",
    "Optimized existing ML pipelines reducing processing time by 30%"
  ],
  responsibilities: [
    "Design and implement ML models for various business applications",
    "Develop and maintain AI-powered software solutions",
    "Collaborate with cross-functional teams for project delivery",
    "Research and implement new AI/ML technologies"
  ],
  education: {
    degree: "B.Tech in Computer Science",
    institution: "Marwadi University",
    duration: "2019-2023",
    gpa: "8.9/10"
  }
};

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="about" className="relative py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        >
          About Me
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
        >
          {/* Current Role Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-white/90">Current Role</h3>
            <div className="space-y-2">
              <p className="text-white/80">{experienceData.company}</p>
              <p className="text-white/70">{experienceData.role}</p>
              <p className="text-white/60">{experienceData.duration}</p>
              <p className="text-white/80 mt-4">{experienceData.description}</p>
            </div>
          </motion.div>

          {/* Education Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-white/90">Education</h3>
            <div className="space-y-2">
              <p className="text-white/80">{experienceData.education.degree}</p>
              <p className="text-white/70">{experienceData.education.institution}</p>
              <p className="text-white/60">{experienceData.education.duration}</p>
              <p className="text-white/80 mt-4">GPA: {experienceData.education.gpa}</p>
            </div>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-white/90">Key Achievements</h3>
            <ul className="list-disc list-inside space-y-2">
              {experienceData.achievements.map((achievement, index) => (
                <li key={index} className="text-white/80">{achievement}</li>
              ))}
            </ul>
          </motion.div>

          {/* Responsibilities Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all"
          >
            <h3 className="text-xl font-semibold mb-4 text-white/90">Responsibilities</h3>
            <ul className="list-disc list-inside space-y-2">
              {experienceData.responsibilities.map((responsibility, index) => (
                <li key={index} className="text-white/80">{responsibility}</li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
