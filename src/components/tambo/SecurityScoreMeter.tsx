"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Shield, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { SEVERITY_BADGE_COLORS, normalizeGrade } from "@/lib/constants";

export interface SecurityScoreProps {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  summary: string;
}

const GRADE_COLORS: Record<string, string> = {
  A: "#22c55e",
  B: "#22d3ee",
  C: "#3b82f6",
  D: "#f59e0b",
  F: "#ef4444",
};

const GRADE_DESCRIPTIONS: Record<string, string> = {
  A: "Excellent Security",
  B: "Good Security",
  C: "Needs Improvement",
  D: "Poor Security",
  F: "Critical Issues",
};

export function SecurityScoreMeter({
  score = 0,
  grade = "F",
  breakdown = { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  summary = "",
}: SecurityScoreProps) {
  const springScore = useSpring(0, { stiffness: 40, damping: 25 });
  const displayScore = useTransform(springScore, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const safeBreakdown = {
    critical: breakdown?.critical ?? 0,
    high: breakdown?.high ?? 0,
    medium: breakdown?.medium ?? 0,
    low: breakdown?.low ?? 0,
    info: breakdown?.info ?? 0,
  };

  const normalizedGradeValue = normalizeGrade(grade || "F");
  const gradeColor = GRADE_COLORS[normalizedGradeValue] || "#ef4444";

  const totalIssues =
    safeBreakdown.critical +
    safeBreakdown.high +
    safeBreakdown.medium +
    safeBreakdown.low +
    safeBreakdown.info;

  const getStatusIcon = () => {
    if (score >= 90) return <Shield className="w-5 h-5 text-green-400" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-cyan-400" />;
    if (score >= 40) return <TrendingDown className="w-5 h-5 text-amber-400" />;
    return <AlertTriangle className="w-5 h-5 text-red-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl glass-card p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-semibold text-white/90">
              Security Assessment
            </h3>
            <p className="text-sm text-white/40">
              {totalIssues} {totalIssues === 1 ? "issue" : "issues"} detected
            </p>
          </div>
        </div>
      </div>

      {/* Large Gauge */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-64 h-64">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="16"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="128"
              cy="128"
              r="110"
              fill="none"
              stroke={gradeColor}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 16px ${gradeColor}40)`,
              }}
            />
          </svg>

          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-6xl font-bold mb-1"
              style={{ color: gradeColor }}
            >
              {displayScore}
            </motion.span>
            <span className="text-white/30 text-lg mb-3">/100</span>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="px-4 py-1.5 rounded-full text-base font-bold"
              style={{
                backgroundColor: `${gradeColor}20`,
                color: gradeColor,
                border: `1px solid ${gradeColor}40`,
              }}
            >
              Grade {normalizedGradeValue}
            </motion.div>
          </div>
        </div>

        {/* Grade description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-white/60 mt-4 text-base"
        >
          {GRADE_DESCRIPTIONS[normalizedGradeValue]}
        </motion.p>
      </div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="flex flex-wrap justify-center gap-2 mb-6"
      >
        {safeBreakdown.critical > 0 && (
          <span className={`security-badge security-badge-critical`}>
            {safeBreakdown.critical} Critical
          </span>
        )}
        {safeBreakdown.high > 0 && (
          <span className={`security-badge security-badge-high`}>
            {safeBreakdown.high} High
          </span>
        )}
        {safeBreakdown.medium > 0 && (
          <span className={`security-badge security-badge-medium`}>
            {safeBreakdown.medium} Medium
          </span>
        )}
        {safeBreakdown.low > 0 && (
          <span className={`security-badge security-badge-low`}>
            {safeBreakdown.low} Low
          </span>
        )}
        {safeBreakdown.info > 0 && (
          <span className={`security-badge security-badge-low`}>
            {safeBreakdown.info} Info
          </span>
        )}
        {totalIssues === 0 && (
          <span className={`security-badge security-badge-safe`}>
            No Issues Found
          </span>
        )}
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="p-4 rounded-xl bg-white/[0.02] border border-white/5"
      >
        <p className="text-sm text-white/50 leading-relaxed text-center">
          {summary}
        </p>
      </motion.div>
    </motion.div>
  );
}
