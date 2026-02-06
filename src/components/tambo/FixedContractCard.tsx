"use client";

import { motion } from "framer-motion";
import { CheckCircle, Copy, FileCode, Shield } from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

export interface FixedContractProps {
  contractName: string;
  code: string;
  changesSummary: string[];
}

export function FixedContractCard({
  contractName = "Contract",
  code = "",
  changesSummary = [],
}: FixedContractProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(safeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const safeCode = code || "";
  const lineCount = safeCode.trim().split("\n").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white/90">
              Fixed Contract
            </h3>
            <p className="text-xs text-white/40">{contractName} — {lineCount} lines</p>
          </div>
        </div>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:brightness-110"
          }`}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Code
            </>
          )}
        </button>
      </div>

      {/* Changes Summary */}
      {(changesSummary || []).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-5 py-3 border-b border-white/5 bg-cyan-500/[0.03]"
        >
          <p className="text-xs font-medium text-cyan-400 mb-2">Changes Applied:</p>
          <div className="flex flex-wrap gap-2">
            {(changesSummary || []).map((change, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-white/5 text-white/60 border border-white/10"
              >
                <CheckCircle className="w-3 h-3 text-cyan-400" />
                {change}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Code */}
      <div className="overflow-x-auto" style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Highlight
          theme={themes.nightOwl}
          code={safeCode.trim()}
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
              className="text-xs"
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  <span className="inline-block w-10 text-white/20 select-none text-right mr-3">
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
  );
}
