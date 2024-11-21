import { motion } from "framer-motion";
import { SparklesCore } from "../ui/sparkles";
import { memo, useEffect, useState } from "react";

// Constants
const SOLUTIONS = ["AI Innovations", "Web Solutions", "Cloud Systems"] as const;
const MAX_LENGTH = Math.max(...SOLUTIONS.map((s) => s.length));
const PLACEHOLDER_TEXT = "\u00A0".repeat(MAX_LENGTH);

interface TypeWriterProps {
  className?: string;
}

interface AnimationDelays {
  typing: number;
  pauseAfterTyping: number;
  deleting: number;
  pauseBeforeNext: number;
}

// Animation configuration
const ANIMATION_DELAYS: AnimationDelays = {
  typing: 100,
  pauseAfterTyping: 300,
  deleting: 50,
  pauseBeforeNext: 100,
};

// Styles
const TYPEWRITER_STYLES = {
  base: {
    minWidth: `${MAX_LENGTH}ch`,
  },
  text: {
    clipPath: "inset(0 0 0 0)",
    transform: "translateZ(0)",
    WebkitFontSmoothing: "antialiased",
    backfaceVisibility: "hidden" as const,
    transition: "color 0.1s ease-in-out",
  },
};

// Memoized TypeWriter component to prevent unnecessary re-renders
const TypeWriter = memo(({ className = "" }: TypeWriterProps) => {
  const [currentSolution, setCurrentSolution] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const solution = SOLUTIONS[currentSolution];

    const getDelay = (): number => {
      if (!isDeleting) {
        return displayText.length < solution.length
          ? ANIMATION_DELAYS.typing
          : ANIMATION_DELAYS.pauseAfterTyping;
      }
      return displayText.length > 0
        ? ANIMATION_DELAYS.deleting
        : ANIMATION_DELAYS.pauseBeforeNext;
    };

    const updateText = (): void => {
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
          setCurrentSolution((prev) => (prev + 1) % SOLUTIONS.length);
        }
      }
    };

    timeout = setTimeout(updateText, getDelay());
    return () => clearTimeout(timeout);
  }, [currentSolution, displayText, isDeleting]);

  return (
    <div
      className={`inline-block relative ${className}`}
      style={TYPEWRITER_STYLES.base}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 whitespace-pre opacity-0">
        {PLACEHOLDER_TEXT}
      </span>
      <span
        className="absolute top-0 left-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        style={TYPEWRITER_STYLES.text}
      >
        {displayText}
      </span>
    </div>
  );
});

TypeWriter.displayName = "TypeWriter";

// Styles for blink animation
const BLINK_ANIMATION = `
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

// Add styles to document only in browser environment
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = BLINK_ANIMATION;
  document.head.appendChild(styleSheet);
}

const Hero: React.FC = () => {
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
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        {/* Add a semi-transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>
      <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
          >
            Rushi Goswami
          </motion.h1>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Engineering excellence through{" "}
            <div className="inline-flex">
              <TypeWriter />
            </div>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Full-stack developer specializing in building exceptional digital
            experiences
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
