import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github } from "lucide-react";
import { SectionWrapper } from "../ui/section-wrapper";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "goswamirushi39@gmail.com",
    link: "mailto:goswamirushi39@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "8140226399",
    link: "tel:8140226399",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/rushigoswami",
    link: "https://linkedin.com/in/rushigoswami",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/rushigoswami",
    link: "https://github.com/rushigoswami",
  },
];

export default function Contact() {
  return (
    <SectionWrapper id="contact">
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
          Get in Touch
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {contactInfo.map((contact, idx) => (
                <motion.a
                  key={contact.label}
                  href={contact.link}
                  target={
                    contact.icon !== Phone && contact.icon !== Mail
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    contact.icon !== Phone && contact.icon !== Mail
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all group flex items-center gap-4"
                >
                  <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <contact.icon size={24} className="text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white/90 mb-1">
                      {contact.label}
                    </h3>
                    <p className="text-white/70 group-hover:text-white/90 transition-colors">
                      {contact.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
