import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "../../utils/cn";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const controls = useAnimation();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[currentWordIndex].text;
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const wordPause = 1000;

    const updateText = () => {
      if (!isDeleting) {
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
          timeout = setTimeout(updateText, typeSpeed);
        } else {
          timeout = setTimeout(() => setIsDeleting(true), wordPause);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
          timeout = setTimeout(updateText, deleteSpeed);
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    timeout = setTimeout(updateText, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, currentWordIndex, isDeleting, words]);

  return (
    <div className={cn("inline-block", className)}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-4xl md:text-5xl font-bold text-center"
      >
        <motion.span
          key={currentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "text-2xl sm:text-4xl md:text-5xl font-bold",
            words[currentWordIndex]?.className
          )}
        >
          {currentText}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-4 md:h-8 bg-blue-500",
            cursorClassName
          )}
        >
          &nbsp;
        </motion.span>
      </motion.span>
    </div>
  );
};
