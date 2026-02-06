"use client";

import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col h-screen" style={{ background: "#050510" }}>
      {/* Animated aurora background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="aurora-blob"
          style={{
            width: "600px",
            height: "600px",
            top: "-10%",
            left: "20%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent 70%)",
            animationDelay: "0s",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: "500px",
            height: "500px",
            top: "40%",
            right: "10%",
            background: "radial-gradient(circle, rgba(34, 211, 238, 0.08), transparent 70%)",
            animationDelay: "-5s",
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: "450px",
            height: "450px",
            bottom: "5%",
            left: "10%",
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.06), transparent 70%)",
            animationDelay: "-10s",
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay" />
        {/* Top gradient */}
        <div className="absolute inset-0 gradient-bg" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  );
}
