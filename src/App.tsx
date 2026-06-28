import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import BentoLayout from "./components/BentoLayout";
import GraphLayout from "./components/GraphLayout";

export type ViewMode = "bento" | "graph";

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("bento");

  return (
    <div className="min-h-screen bg-ink text-paper selection:bg-signal/30">
      <Navbar viewMode={viewMode} setViewMode={setViewMode} />

      {/* Views are swapped (not kept mounted) and cross-faded so each mounts fresh. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {viewMode === "bento" ? <BentoLayout onOpenGraph={() => setViewMode("graph")} /> : <GraphLayout />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
