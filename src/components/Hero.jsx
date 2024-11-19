import { motion } from "framer-motion";
import { SparklesCore } from "../ui/sparkles";
import { memo, useCallback, useEffect, useState } from "react";

const solutions = ["AI solutions", "Frontend UI", "Backend solutions"];

// Find the longest solution for consistent width
const maxLength = Math.max(...solutions.map((s) => s.length));
const placeholderText = "\u00A0".repeat(maxLength);

// Memoized TypeWriter component to prevent unnecessary re-renders
const TypeWriter = memo(({ onComplete }) => {
  const [currentSolution, setCurrentSolution] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const updateText = useCallback(() => {
    const solution = solutions[currentSolution];
    if (!isDeleting) {
      if (displayText.length < solution.length) {
        setDisplayText(solution.slice(0, displayText.length + 1));
        return 150; // 150ms delay for typing each character
      } else {
        setIsDeleting(true);
        return 4000; // 4 second pause after typing
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(solution.slice(0, displayText.length - 1));
        return 80; // 80ms delay for deleting each character
      } else {
        setIsDeleting(false);
        setCurrentSolution((prev) => (prev + 1) % solutions.length);
        return 1500; // 1.5 second pause before next word
      }
    }
  }, [currentSolution, displayText, isDeleting]);

  useEffect(() => {
    const timeout = setTimeout(updateText, updateText());
    return () => clearTimeout(timeout);
  }, [updateText]);

  return (
    <div
      className="inline-block relative"
      style={{ minWidth: `${maxLength}ch` }}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 whitespace-pre opacity-0">
        {placeholderText}
      </span>
      <span
        className="absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          clipPath: "inset(0 0 0 0)",
          transform: "translateZ(0)",
          WebkitFontSmoothing: "antialiased",
          backfaceVisibility: "hidden",
          transition: "color 0.3s ease-in-out"
        }}
      >
        {displayText}
      </span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
          times: [0, 0.2, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0.2,
        }}
        className="inline-block w-[4px] h-4 md:h-6 lg:h-8 bg-blue-500 ml-1"
      />
    </div>
  );
});

TypeWriter.displayName = "TypeWriter";

export default function Hero() {
  return (
    <div id="home" className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md relative">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3.5 }}
          className="flex flex-col items-center gap-4 p-8 backdrop-blur-sm rounded-lg border border-white/10 bg-black/20"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4.5, delay: 1.2 }}
            className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Rushi M Goswami
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4.5, delay: 1.3 }}
            className="text-xl md:text-2xl text-white/90 font-semibold"
          >
            Software Engineer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 4.5, delay: 1.4 }}
            className="mt-4 w-full max-w-3xl text-base sm:text-xl md:text-3xl lg:text-4xl font-bold"
          >
            <span className="text-white/90">Building next gen </span>
            <TypeWriter />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/50 pointer-events-none z-10" />
    </div>
  );
}
