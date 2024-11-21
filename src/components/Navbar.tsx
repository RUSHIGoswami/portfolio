import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User, Code, Wrench, Mail, LucideIcon } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface NavItem {
  name: string;
  link: string;
  icon: LucideIcon;
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

const navItems: NavItem[] = [
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

const NavLink: React.FC<NavLinkProps> = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.a
            href={item.link}
            className="flex items-center justify-center p-3 transition-colors duration-200 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? "text-purple-500" : "text-white/80 hover:text-white"
              }`}
            />
          </motion.a>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            align="center"
            className="hidden md:block data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade bg-black/60 text-white px-3 py-1.5 rounded-md text-sm shadow-lg z-[60] backdrop-blur-sm border border-white/10"
            sideOffset={5}
          >
            {item.name}
            <Tooltip.Arrow className="fill-black/60" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
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

  return (
    <>
      <style>{`
        @keyframes slideLeftAndFade {
          from {
            opacity: 0;
            transform: translateX(-2px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <motion.nav
        initial={{
          x: window.innerWidth >= 768 ? -100 : 0,
          y: window.innerWidth >= 768 ? 0 : 100,
        }}
        animate={{
          x: 0,
          y: 0,
        }}
        className="fixed z-50
          md:left-8 md:top-1/2 md:-translate-y-1/2
          left-1/2 bottom-8 -translate-x-1/2 md:translate-x-0"
      >
        <div
          className="flex md:flex-col items-center bg-black/60 backdrop-blur-lg rounded-full 
          py-2 md:py-3 px-3 md:px-2
          space-x-1 md:space-x-0 md:space-y-1
          shadow-lg shadow-black/20 border border-white/10"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              item={item}
              isActive={activeSection === item.link.substring(1)}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
