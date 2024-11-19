import { motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "../../utils/cn";

export const MovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);

  const speedValue = {
    slow: 50,
    fast: 30,
  };

  return (
    <div
      ref={containerRef}
      className={cn("scroller relative z-20 overflow-hidden", className)}
    >
      <motion.div
        ref={scrollerRef}
        className="flex gap-4 w-max"
        animate={{
          x: direction === "left" ? "-50%" : "0%",
        }}
        transition={{
          duration: items.length * speedValue[speed],
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="relative h-40 w-[300px] overflow-hidden rounded-xl border border-neutral-800"
          >
            <div className="absolute inset-0">
              <img
                src={item.thumbnail}
                alt={item.content}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <p className="text-white text-lg font-medium text-center px-4">
                {item.content}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
