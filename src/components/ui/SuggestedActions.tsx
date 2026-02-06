"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SuggestedAction {
  label: string;
  action: string;
}

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onSelect: (action: string) => void;
}

export function SuggestedActions({ actions, onSelect }: SuggestedActionsProps) {
  if (actions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="flex items-center gap-1.5 text-xs text-white/40">
        <Sparkles className="w-3.5 h-3.5" />
        Suggestions:
      </span>
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(action.action)}
          className="px-3 py-1.5 text-xs font-medium rounded-full
            bg-white/5 text-white/60 border border-white/10
            hover:bg-white/10 hover:text-white/90 hover:border-white/20
            hover:shadow-[0_0_15px_rgba(34,211,238,0.08)]
            transition-all duration-200"
        >
          {action.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
