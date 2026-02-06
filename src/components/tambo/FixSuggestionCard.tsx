"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Lightbulb, Wrench } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";

export interface FixSuggestionProps {
  vulnerabilityId: string;
  title: string;
  description: string;
  steps: string[];
  codeExample?: string;
  effort: "low" | "medium" | "high";
  priority: "immediate" | "soon" | "later";
}

const effortColors = {
  low: "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
  high: "text-red-400 bg-red-500/10 border border-red-500/20",
};

const priorityColors = {
  immediate: "text-red-400 bg-red-500/10 border border-red-500/20",
  soon: "text-orange-400 bg-orange-500/10 border border-orange-500/20",
  later: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
};

const priorityIcons = {
  immediate: "🚨",
  soon: "⚡",
  later: "📝",
};

export function FixSuggestionCard({
  title = "Fix Suggestion",
  description = "",
  steps = [],
  codeExample,
  effort = "medium",
  priority = "soon",
}: FixSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <Wrench className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${effortColors[effort] || effortColors.medium}`}>
            <Clock className="w-3 h-3 inline mr-1" />
            {(effort || "medium").charAt(0).toUpperCase() + (effort || "medium").slice(1)} Effort
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || priorityColors.soon}`}>
            {priorityIcons[priority] || "⚡"} {(priority || "soon").charAt(0).toUpperCase() + (priority || "soon").slice(1)} Priority
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed">{description}</p>

        {/* Steps */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Implementation Steps
          </h4>
          <ol className="space-y-2">
            {(steps || []).map((step, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex items-start gap-3 text-sm text-white/50"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                {step}
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Code Example */}
        {codeExample && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="flex items-center gap-2 text-sm font-medium text-white/70 mb-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              Example Implementation
            </h4>
            <div className="rounded-lg overflow-hidden border border-white/10">
              <Highlight
                theme={themes.nightOwl}
                code={codeExample.trim()}
                language="solidity"
              >
                {({ style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    style={{
                      ...style,
                      margin: 0,
                      padding: "1rem",
                      background: "transparent",
                    }}
                    className="text-xs overflow-x-auto"
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="inline-block w-6 text-white/20 select-none text-right mr-3">
                          {i + 1}
                        </span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
