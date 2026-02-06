"use client";

import { motion } from "framer-motion";
import { ClipboardList, Code, Shield, Zap } from "lucide-react";
import type { Severity } from "@/types";
import { SEVERITY_BADGE_COLORS, SEVERITY_COLORS, normalizeSeverity } from "@/lib/constants";

export interface AuditSummaryProps {
  contractName: string;
  contractType?: string;
  linesAnalyzed: number;
  overallRisk: Severity;
  issueBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  topRecommendations: string[];
}

function calculateSafeScore(breakdown: AuditSummaryProps["issueBreakdown"]): number {
  let score = 100;
  score -= breakdown.critical * 25;
  score -= breakdown.high * 15;
  score -= breakdown.medium * 8;
  score -= breakdown.low * 3;
  score -= breakdown.info * 1;
  return Math.max(0, Math.min(100, score));
}

export function AuditSummaryCard({
  contractName = "Contract",
  contractType,
  linesAnalyzed = 0,
  overallRisk = "medium",
  issueBreakdown = { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  topRecommendations = [],
}: AuditSummaryProps) {
  const breakdown = {
    critical: issueBreakdown?.critical ?? 0,
    high: issueBreakdown?.high ?? 0,
    medium: issueBreakdown?.medium ?? 0,
    low: issueBreakdown?.low ?? 0,
    info: issueBreakdown?.info ?? 0,
  };
  const totalIssues =
    breakdown.critical +
    breakdown.high +
    breakdown.medium +
    breakdown.low +
    breakdown.info;

  const safePercentage = calculateSafeScore(breakdown);
  const normalizedRisk = normalizeSeverity(overallRisk || "medium");
  const barColor = SEVERITY_COLORS[normalizedRisk] || "#3b82f6";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-white/[0.02]">
        <ClipboardList className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white/90">Audit Summary</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Contract Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Code className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">Contract</p>
              <p className="text-sm font-medium text-white/80 truncate max-w-[150px]">
                {contractName}
              </p>
            </div>
          </motion.div>

          {contractType && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-white/30">Type</p>
                <p className="text-sm font-medium text-white/80">{contractType}</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">Lines Analyzed</p>
              <p className="text-sm font-medium text-white/80">{linesAnalyzed}</p>
            </div>
          </motion.div>
        </div>

        {/* Issues Found */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/40">Issues Found: {totalIssues}</span>
            <span className="text-sm text-white/40">{safePercentage}% Safe</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safePercentage}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                backgroundColor: barColor,
                boxShadow: `0 0 10px ${barColor}40`,
              }}
            />
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-wrap gap-2"
        >
          {breakdown.critical > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.critical}`}>
              {breakdown.critical} Critical
            </span>
          )}
          {breakdown.high > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.high}`}>
              {breakdown.high} High
            </span>
          )}
          {breakdown.medium > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.medium}`}>
              {breakdown.medium} Medium
            </span>
          )}
          {breakdown.low > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.low}`}>
              {breakdown.low} Low
            </span>
          )}
          {breakdown.info > 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.info}`}>
              {breakdown.info} Info
            </span>
          )}
          {totalIssues === 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.info}`}>
              No Issues Found
            </span>
          )}
        </motion.div>

        {/* Recommendations */}
        {(topRecommendations || []).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-sm font-medium text-white/60 mb-2">
              Recommendations
            </h4>
            <ul className="space-y-1.5">
              {topRecommendations.map((rec, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  className="flex items-start gap-2 text-sm text-white/50"
                >
                  <span className="text-cyan-400 mt-0.5">•</span>
                  {rec}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
