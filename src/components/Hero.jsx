import { motion } from "framer-motion";
import { SparklesCore } from "../ui/sparkles";
import { memo, useEffect, useState } from "react";

const solutions = ["AI Innovations", "Web Solutions", "Cloud Systems"];

// Find the longest solution for consistent width
const maxLength = Math.max(...solutions.map((s) => s.length));
const placeholderText = "\u00A0".repeat(maxLength);

// Memoized TypeWriter component to prevent unnecessary re-renders
const TypeWriter = memo(() => {
  const [currentSolution, setCurrentSolution] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const solution = solutions[currentSolution];

    const getDelay = () => {
      if (!isDeleting) {
        if (displayText.length < solution.length) {
          return 100; // typing delay
        }
        return 300; // pause after typing
      } else {
        if (displayText.length > 0) {
          return 50; // deleting delay
        }
        return 100; // pause before next word
      }
    };

    const updateText = () => {
      if (!isDeleting) {
        if (displayText.length < solution.length) {
          setDisplayText(solution.slice(0, displayText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(solution.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentSolution((prev) => (prev + 1) % solutions.length);
        }
      }
    };

    timeout = setTimeout(updateText, getDelay());
    return () => clearTimeout(timeout);
  }, [currentSolution, displayText, isDeleting]);

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
          transition: "color 0.1s ease-in-out",
        }}
      >
        {displayText}
      </span>
    </div>
  );
});

TypeWriter.displayName = "TypeWriter";

const styles = `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default function Hero() {
  return (
    <div
      id="home"
      className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md relative"
    >
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
          transition={{ duration: 2.5 }}
          className="flex flex-col items-center gap-4 p-8 backdrop-blur-sm rounded-lg border border-white/10 bg-black/20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Rushi M Goswami
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="text-lg md:text-xl text-white/90 font-semibold"
          >
            Software Engineer
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="mt-3 w-full max-w-1xl text-base sm:text-xl md:text-3xl lg:text-4xl font-bold"
          >
            <span className="text-white/90">
              Engineering excellence through{" "}
            </span>
            <TypeWriter />
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/50 pointer-events-none z-10" />
    </div>
  );
}
