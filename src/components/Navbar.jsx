import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User, Code, Wrench, Mail } from "lucide-react";

const navItems = [
  {
    name: "Home",
    link: "#home",
    icon: Home,
  },
  {
    name: "About",
    link: "#about",
    icon: User,
  },
  {
    name: "Skills",
    link: "#skills",
    icon: Wrench,
  },
  {
    name: "Projects",
    link: "#projects",
    icon: Code,
  },
  {
    name: "Contact",
    link: "#contact",
    icon: Mail,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.link.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    const targetId = link.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      const targetPosition = element.offsetTop - 60;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <nav
        className={`
        px-6 py-3 rounded-full border border-white/[0.2] bg-black/50 backdrop-blur-md
        ${scrolled ? "bg-black/80" : ""}
        transition-all duration-300
      `}
      >
        <div className="flex items-center gap-6">
          {navItems.map((item, idx) => (
            <motion.a
              key={item.name}
              href={item.link}
              onClick={(e) => handleNavClick(e, item.link)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div
                className={`
                relative p-2 transition-colors duration-300
                ${
                  activeSection === item.link.substring(1)
                    ? "text-purple-500 bg-clip-text"
                    : "text-white/70 hover:text-white"
                }
              `}
              >
                <item.icon size={20} />
                <motion.span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.name}
                </motion.span>
                {activeSection === item.link.substring(1) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </nav>
    </motion.div>
  );
}
