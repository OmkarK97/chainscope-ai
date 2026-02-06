"use client";

import { motion } from "framer-motion";
import { CheckCircle, Shield, Sparkles } from "lucide-react";

export interface SafeContractProps {
  contractName: string;
  message: string;
  checksPerformed: string[];
}

export function SafeContractCard({
  contractName = "Contract",
  message = "No critical vulnerabilities found.",
  checksPerformed = [],
}: SafeContractProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl overflow-hidden"
    >
      {/* Header with celebration */}
      <div className="relative px-5 py-6 text-center overflow-hidden">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/20 mb-4"
          style={{ boxShadow: "0 0 30px rgba(34, 211, 238, 0.1)" }}
        >
          <Shield className="w-8 h-8 text-cyan-400" />
        </motion.div>

        {/* Sparkle decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="absolute top-4 left-1/4"
        >
          <Sparkles className="w-4 h-4 text-cyan-400/60" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-6 right-1/4"
        >
          <Sparkles className="w-3 h-3 text-cyan-400/40" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-semibold text-cyan-400 mb-2"
        >
          No Critical Issues Found!
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-cyan-300/60"
        >
          {contractName}
        </motion.p>
      </div>

      {/* Message */}
      <div className="px-5 py-4 border-t border-cyan-500/10 bg-cyan-500/[0.02]">
        <p className="text-sm text-white/60 leading-relaxed">{message}</p>
      </div>

      {/* Checks performed */}
      <div className="px-5 py-4 border-t border-cyan-500/10">
        <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">
          Security Checks Performed
        </h4>
        <ul className="space-y-2">
          {(checksPerformed || []).map((check, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="flex items-center gap-2 text-sm text-white/50"
            >
              <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              {check}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
