"use client";

import { motion } from "framer-motion";
import { CheckCircle, Copy, FileCode } from "lucide-react";
import { useState } from "react";

export interface CodeDiffProps {
  vulnerabilityId: string;
  title: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  pattern: string;
}

export function CodeDiffViewer({
  title = "Fix",
  originalCode = "",
  fixedCode = "",
  explanation = "",
  pattern = "",
}: CodeDiffProps) {
  const [copiedFixed, setCopiedFixed] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fixedCode);
    setCopiedFixed(true);
    setTimeout(() => setCopiedFixed(false), 2000);
  };

  const origLines = originalCode.trim().split("\n");
  const fixLines = fixedCode.trim().split("\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-xl glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-medium text-white/80">
            {title}
          </h3>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          {copiedFixed ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy fixed code</span>
            </>
          )}
        </button>
      </div>

      {/* Unified Diff */}
      <div className="overflow-x-auto font-mono text-xs">
        {/* Diff stats header */}
        <div className="px-4 py-1.5 bg-white/[0.02] border-b border-white/5 flex items-center gap-3">
          <span className="text-red-400/70">−{origLines.length} lines</span>
          <span className="text-green-400/70">+{fixLines.length} lines</span>
        </div>

        {/* Removed lines */}
        {origLines.map((line, i) => (
          <div key={`r-${i}`} className="flex bg-red-500/8 border-l-2 border-red-500/40">
            <span className="inline-block w-10 text-right pr-2 py-0.5 text-red-400/40 select-none flex-shrink-0">
              {i + 1}
            </span>
            <span className="inline-block w-6 text-center py-0.5 text-red-400/60 select-none flex-shrink-0">
              −
            </span>
            <pre className="flex-1 px-2 py-0.5 text-red-300/70">{line}</pre>
          </div>
        ))}

        {/* Separator */}
        <div className="border-t border-white/5" />

        {/* Added lines */}
        {fixLines.map((line, i) => (
          <div key={`a-${i}`} className="flex bg-green-500/8 border-l-2 border-green-500/40">
            <span className="inline-block w-10 text-right pr-2 py-0.5 text-green-400/40 select-none flex-shrink-0">
              {i + 1}
            </span>
            <span className="inline-block w-6 text-center py-0.5 text-green-400/60 select-none flex-shrink-0">
              +
            </span>
            <pre className="flex-1 px-2 py-0.5 text-green-300/70">{line}</pre>
          </div>
        ))}
      </div>

      {/* Footer with explanation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 py-3 border-t border-white/5 bg-white/[0.01]"
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-cyan-400">
            Pattern: {pattern}
          </span>
        </div>
        <p className="text-sm text-white/50">{explanation}</p>
      </motion.div>
    </motion.div>
  );
}
