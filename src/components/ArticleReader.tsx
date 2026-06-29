import React from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Article } from "../data/fallbackData";

interface ArticleReaderProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
  return (
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-panel border border-line rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-line">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-paper mb-2">{article.title}</h2>
                <span className="font-mono text-xs text-signal/90">{article.date}</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Close article"
                className="p-2 bg-panel2 hover:bg-line text-paper/80 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Article Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {article.imageUrl && (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-auto max-h-80 object-cover rounded-xl mb-8"
                />
              )}
              
              <div className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-signal prose-code:font-mono">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArticleReader;
