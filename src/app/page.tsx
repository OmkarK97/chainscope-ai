"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MessageDisplay } from "@/components/chat/MessageDisplay";

export default function Home() {
  return (
    <div className="flex flex-col h-screen" style={{ background: "#0a0a0f" }}>
      {/* Subtle animated aurora background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Aurora blobs - slower, more subtle */}
        <div
          className="aurora-blob w-[500px] h-[500px] bg-purple-500/20"
          style={{
            top: "10%",
            left: "20%",
            animationDelay: "0s",
          }}
        />
        <div
          className="aurora-blob w-[600px] h-[600px] bg-cyan-400/15"
          style={{
            top: "50%",
            right: "15%",
            animationDelay: "8s",
          }}
        />
        <div
          className="aurora-blob w-[450px] h-[450px] bg-purple-600/18"
          style={{
            bottom: "15%",
            left: "40%",
            animationDelay: "16s",
          }}
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        <Header />

        {/* Dashboard Grid Layout - 2 columns only */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-[360px_1fr] lg:grid-cols-[380px_1fr]">
            {/* Left Sidebar - Input Panel */}
            <Sidebar>
              <div className="flex flex-col h-full p-4">
                <ChatInterface />
              </div>
            </Sidebar>

            {/* Main Content Area - Audit Results */}
            <motion.div 
              initial={{ opacity: 0, borderColor: "transparent" }}
              animate={{ opacity: 1, borderColor: "rgba(255, 255, 255, 0.05)" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col h-full overflow-hidden bg-transparent border-l"
              style={{ borderWidth: "1px" }}
            >
              <div className="flex-1 overflow-y-auto px-6 py-6" id="audit-results">
                <MessageDisplay />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
