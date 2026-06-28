import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DetailModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Generic detail overlay — backdrop + spring card + header + scrollable body.
 * Shared shell for Project and Experience detail views (mirrors ArticleReader's look).
 */
const DetailModal: React.FC<DetailModalProps> = ({ open, title, subtitle, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/80 backdrop-blur-xs"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[90vh] bg-panel border border-line rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start gap-4 p-6 border-b border-line">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-paper leading-tight">{title}</h2>
                {subtitle && <p className="font-mono text-xs text-signal/90 mt-2">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 p-2 bg-panel2 hover:bg-line text-paper/80 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DetailModal;
