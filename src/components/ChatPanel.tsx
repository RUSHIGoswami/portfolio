import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Trash2, ChevronRight } from "lucide-react";
import { SUGGESTIONS } from "../services/agent";

interface ChatPanelProps {
  onSendMessage: (msg: string) => void;
  messages: { text: string; isUser: boolean }[];
  isTyping?: boolean;
  onClear?: () => void;
  onCollapse?: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onSendMessage,
  messages,
  isTyping = false,
  onClear,
  onCollapse,
}) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest message (or typing indicator) in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ type: "spring", damping: 28, stiffness: 320 }}
      className="absolute top-20 right-2 sm:right-4 w-84 max-w-[calc(100vw-1rem)] h-[calc(100dvh-120px)] bg-panel/90 backdrop-blur-md border border-line rounded-2xl flex flex-col shadow-2xl z-30 overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-line bg-panel2/60 flex items-center gap-2.5">
        <Sparkles size={16} className="text-signal shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold text-paper text-sm leading-none">Resume Agent</h3>
          <span className="font-mono text-[10px] text-muted">local · grounded in real data</span>
        </div>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            disabled={messages.length === 0}
            aria-label="Clear chat"
            title="Clear chat"
            className="shrink-0 p-1.5 rounded-md text-paper/70 hover:text-signal hover:bg-line/60 disabled:opacity-30 disabled:hover:text-paper/70 disabled:hover:bg-transparent transition-colors"
          >
            <Trash2 size={15} />
          </button>
        )}
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label="Collapse chat"
            title="Collapse chat"
            className="shrink-0 p-1.5 rounded-md text-paper/70 hover:text-signal hover:bg-line/60 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="bg-panel2/70 p-3 rounded-xl text-sm text-paper/80 border border-line">
          Hi! I answer from Rushi's resume — projects, skills, experience, contact. Watch the graph light up.
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="font-mono text-[11px] px-2.5 py-1.5 rounded-md border border-line text-muted hover:text-signal hover:border-signal/40 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 rounded-xl text-sm max-w-[85%] ${
                msg.isUser
                  ? "bg-signal text-ink font-medium rounded-br-sm"
                  : "bg-panel2 text-paper/85 border border-line rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 rounded-xl rounded-bl-sm bg-panel2 border border-line flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-line bg-panel2/60">
        <div className="flex items-center gap-2 bg-ink rounded-full px-4 py-2 border border-line focus-within:border-signal/50 transition-colors">
          <input
            type="text"
            className="bg-transparent flex-1 outline-hidden text-sm text-paper placeholder-muted font-mono"
            placeholder="Ask about a tool, project…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
          />
          <button
            onClick={() => send(input)}
            aria-label="Send message"
            className="text-signal hover:text-signal/80 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
