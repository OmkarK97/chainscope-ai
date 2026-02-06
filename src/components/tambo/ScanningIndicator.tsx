"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2, Search, Shield } from "lucide-react";
import { useEffect, useState } from "react";

type NormalizedStatus = "scanning" | "analyzing" | "complete";

export interface ScanningIndicatorProps {
  status: string;
  message: string;
  progress?: number;
}

function normalizeStatus(status?: string): NormalizedStatus {
  if (!status) return "scanning";
  const lower = status.toLowerCase();
  if (lower.includes("complete") || lower.includes("done") || lower.includes("finish")) {
    return "complete";
  }
  if (
    lower.includes("analyz") ||
    lower.includes("process") ||
    lower.includes("check") ||
    lower.includes("review") ||
    lower.includes("scan") ||
    lower.includes("inspect") ||
    lower.includes("audit")
  ) {
    return "analyzing";
  }
  return "scanning";
}

export function ScanningIndicator({
  status = "scanning",
  message = "Analyzing contract...",
  progress,
}: ScanningIndicatorProps) {
  const initialStatus = normalizeStatus(status);
  const [currentStatus, setCurrentStatus] = useState<NormalizedStatus>(initialStatus);

  // Auto-complete after 5 seconds
  useEffect(() => {
    if (currentStatus === "complete") return;
    const timer = setTimeout(() => {
      setCurrentStatus("complete");
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentStatus]);

  const icons: Record<NormalizedStatus, React.ReactNode> = {
    scanning: <Search className="w-5 h-5" />,
    analyzing: <Loader2 className="w-5 h-5 animate-spin" />,
    complete: <CheckCircle className="w-5 h-5" />,
  };

  const colors: Record<NormalizedStatus, string> = {
    scanning: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    analyzing: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
    complete: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
  };

  const displayMessage = currentStatus === "complete" ? "Audit complete" : message;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-4 ${colors[currentStatus]} backdrop-blur-xl`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={
            currentStatus === "scanning"
              ? { scale: [1, 1.1, 1] }
              : {}
          }
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {icons[currentStatus]}
        </motion.div>
        <div className="flex-1">
          <p className="text-sm font-medium">{displayMessage}</p>
          {progress !== undefined && currentStatus !== "complete" && (
            <div className="mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-current rounded-full"
                style={{ boxShadow: "0 0 8px currentColor" }}
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
