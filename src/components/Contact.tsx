import { motion } from "framer-motion";
import { Mail, Phone, Linkedin, Github, LucideIcon } from "lucide-react";
import { SectionWrapper } from "../ui/section-wrapper";

interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  link: string;
}

const contactInfo: ContactInfo[] = [
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

interface ContactCardProps {
  contact: ContactInfo;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const Icon = contact.icon;

  return (
    <motion.a
      href={contact.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.015 }}
      className="flex items-center p-4 rounded-lg border border-white/10 bg-black/60 hover:bg-black/70 transition-all backdrop-blur-sm group"
    >
      <div className="p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
        <Icon className="w-6 h-6 text-purple-500" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-white/80">{contact.label}</p>
        <p className="text-white font-medium">{contact.value}</p>
      </div>
    </motion.a>
  );
};

const Contact: React.FC = () => {
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
          <div className="p-6 rounded-lg border border-white/10 bg-black/60 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((contact) => (
                <ContactCard key={contact.label} contact={contact} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Contact;
