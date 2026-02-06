"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RightPanelProps {
  children: React.ReactNode;
}

export function RightPanel({ children }: RightPanelProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const checkVisibility = () => {
      setIsVisible(window.innerWidth >= 1280);
    };

    checkVisibility();
    window.addEventListener("resize", checkVisibility);
    return () => window.removeEventListener("resize", checkVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="hidden xl:flex flex-col h-full glass-medium rounded-xl overflow-hidden"
    >
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {children}
      </div>
    </motion.aside>
  );
}
