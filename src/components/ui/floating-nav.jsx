import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const FloatingNav = ({
  navItems,
  className,
  children,
}) => {
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
      className={cn("flex justify-between items-center w-full px-4 py-2", className)}
    >
      {children}
      <nav className="flex items-center gap-2">
        {navItems.map((item, idx) => (
          <motion.a
            key={item.name}
            href={item.link}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative px-4 py-2 text-sm transition-all duration-500 hover:text-blue-500 dark:hover:text-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{item.name}</span>
            <motion.div
              layoutId="navbar-indicator"
              transition={{ type: "spring", bounce: 0.25 }}
              className="absolute inset-0 rounded-md bg-blue-100 dark:bg-blue-900/20"
              style={{ opacity: 0 }}
            />
          </motion.a>
        ))}
      </nav>
    </motion.div>
  );
};
