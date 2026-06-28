import React from "react";
import { ViewMode } from "../App";

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const tabs: { id: ViewMode; label: string }[] = [
  { id: "bento", label: "Grid" },
  { id: "graph", label: "Graph" },
];

const Navbar: React.FC<NavbarProps> = ({ viewMode, setViewMode }) => {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-7xl flex items-center justify-between gap-4">
        {/* Brand mark — a node glyph + monospace handle, tying back to the graph identity. */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-full bg-panel/80 backdrop-blur-md border border-line">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-signal/60 animate-pulse-soft" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-signal" />
          </span>
          <span className="font-mono text-xs text-paper tracking-tight">rushi.goswami</span>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-panel/80 backdrop-blur-md rounded-full border border-line shadow-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              aria-pressed={viewMode === tab.id}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all ${
                viewMode === tab.id
                  ? "bg-signal/15 text-signal"
                  : "text-muted hover:text-paper hover:bg-line/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
