"use client";

import { motion } from "framer-motion";
import { Shield, Github, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-6 py-4 glass-strong"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white/90">ChainScope AI</h1>
            <p className="text-xs text-white/40">Smart Contract Security Auditor</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://docs.tambo.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <span>Built with Tambo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/omkarkamalapure/chainscope-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </motion.header>
      {/* Glowing divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
    </>
  );
}
