import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const HoverEffect = ({
  items,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <motion.a
          href={item.link}
          key={item.link}
          className="relative group block p-2 h-full w-full"
          whileHover="hover"
        >
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 blur transition duration-500"
            variants={{
              hover: {
                opacity: 0.3,
              },
            }}
          />
          <motion.div
            className="relative h-full w-full rounded-lg bg-gray-900 p-6 flex flex-col items-start"
            variants={{
              hover: {
                scale: 1.02,
              },
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <div className="font-bold text-xl text-white mb-2">{item.title}</div>
            <p className="text-gray-300">{item.description}</p>
          </motion.div>
        </motion.a>
      ))}
    </div>
  );
};
