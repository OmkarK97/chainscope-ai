"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 shadow-lg glow-purple-subtle md:hidden"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </motion.button>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <motion.aside 
          initial={{ opacity: 0, x: -20, borderColor: "transparent" }}
          animate={{ opacity: 1, x: 0, borderColor: "rgba(255, 255, 255, 0.05)" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="hidden md:flex flex-col h-full glass-medium border-r border-l border-b overflow-hidden"
          style={{ borderWidth: "1px" }}
        >
          {children}
        </motion.aside>
      )}

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Bottom sheet */}
            <motion.aside
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-h-[85vh] glass-card rounded-t-3xl overflow-hidden md:hidden"
            >
              {children}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
