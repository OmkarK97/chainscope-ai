"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { GRADE_COLORS, SEVERITY_BADGE_COLORS, normalizeGrade } from "@/lib/constants";

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

export function SecurityScoreMeter({
  score = 0,
  grade = "F",
  breakdown = { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  summary = "",
}: SecurityScoreProps) {
  const springScore = useSpring(0, { stiffness: 50, damping: 20 });
  const displayScore = useTransform(springScore, (latest) =>
    Math.round(latest)
  );

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  const circumference = 2 * Math.PI * 90;
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

  const gradeDescriptions: Record<string, string> = {
    A: "Excellent Security",
    B: "Good Security",
    C: "Needs Improvement",
    D: "Poor Security",
    F: "Critical Issues",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl glass-card p-6"
    >
      <h3 className="text-center text-sm font-medium text-white/40 uppercase tracking-wider mb-6">
        Security Score
      </h3>

      {/* Gauge */}
      <div className="flex justify-center mb-6">
        <div className="relative w-52 h-52">
          {/* Background circle */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="104"
              cy="104"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="12"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="104"
              cy="104"
              r="90"
              fill="none"
              stroke={gradeColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: `drop-shadow(0 0 12px ${gradeColor}50)`,
              }}
            />
          </svg>

          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl font-bold"
              style={{ color: gradeColor }}
            >
              {displayScore}
            </motion.span>
            <span className="text-white/30 text-sm">/100</span>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                backgroundColor: `${gradeColor}20`,
                color: gradeColor,
              }}
            >
              Grade: {normalizedGradeValue}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Grade description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-white/60 mb-6"
      >
        {gradeDescriptions[normalizedGradeValue]}
      </motion.p>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-3 mb-4"
      >
        {safeBreakdown.critical > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.critical}`}>
            {safeBreakdown.critical} Critical
          </span>
        )}
        {safeBreakdown.high > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.high}`}>
            {safeBreakdown.high} High
          </span>
        )}
        {safeBreakdown.medium > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.medium}`}>
            {safeBreakdown.medium} Medium
          </span>
        )}
        {safeBreakdown.low > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.low}`}>
            {safeBreakdown.low} Low
          </span>
        )}
        {safeBreakdown.info > 0 && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.info}`}>
            {safeBreakdown.info} Info
          </span>
        )}
        {safeBreakdown.critical === 0 &&
          breakdown.high === 0 &&
          breakdown.medium === 0 &&
          breakdown.low === 0 &&
          breakdown.info === 0 && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${SEVERITY_BADGE_COLORS.info}`}>
              No Issues Found
            </span>
          )}
      </motion.div>

      {/* Summary */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-white/40"
      >
        {summary}
      </motion.p>
    </motion.div>
  );
}
