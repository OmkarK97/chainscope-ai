"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Shield, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  securityScore?: number;
  securityGrade?: string;
}

export function Header({ securityScore, securityGrade }: HeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getScoreColor = (score?: number) => {
    if (!score) return "text-white/40";
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-cyan-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return "security-badge-low";
    if (score >= 90) return "security-badge-safe";
    if (score >= 75) return "security-badge-low";
    if (score >= 60) return "security-badge-medium";
    if (score >= 40) return "security-badge-high";
    return "security-badge-critical";
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between py-3 glass-medium sticky top-0 z-30 border-b border-white/5"
      >
        <div className="flex items-center justify-between w-full px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-400/10 border border-white/10 glow-purple-subtle"
          >
            <img src="/logo.svg" alt="ChainScope AI" className="w-5 h-5" />
          </motion.div>
          <h1 className="text-base font-bold text-white/90">ChainScope AI</h1>
        </div>

        {/* Center - Live Security Score */}
        {mounted && securityScore !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${getScoreBadgeClass(securityScore)}`}
          >
            <Shield className="w-4 h-4" />
            <span className="font-semibold">
              Score: {securityScore}
            </span>
            {securityGrade && (
              <span className="opacity-60">({securityGrade})</span>
            )}
          </motion.div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3">
          <a
            href="https://docs.tambo.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span>Built with Tambo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://github.com/OmkarK97/chainscope-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <Github className="w-5 h-5" />
          </motion.a>
        </div>
        </div>
      </motion.header>
      {/* Subtle divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
    </>
  );
}
