"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function MessageDisplay() {
  const { thread } = useTamboThread();
  const { isPending } = useTamboThreadInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const messages = (thread?.messages || []).filter(m => m.role !== "system");

  // Show welcome state if no messages
  if (messages.length === 0 && !isPending) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center h-full"
      >
        <div className="text-center max-w-2xl">
          {/* Title with fade + scale */}
          <motion.h2 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-bold text-white/90 mb-4"
          >
            Ready to Audit
          </motion.h2>
          
          {/* Description with fade + blur */}
          <motion.p 
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/40 text-lg mb-8 leading-relaxed"
          >
            Paste your Solidity smart contract code in the sidebar and click <strong className="text-purple-400">Audit Contract</strong> to begin security analysis.
          </motion.p>
          
          {/* Feature badges with staggered entrance */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap gap-3 justify-center text-sm text-white/30"
          >
            {[
              { icon: "🔍", text: "Reentrancy Detection" },
              { icon: "🛡️", text: "Access Control" },
              { icon: "⚡", text: "Integer Overflow" },
              { icon: "💨", text: "Gas Optimization" }
            ].map((feature, i) => (
              <motion.span
                key={feature.text}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.8 + (i * 0.1),
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 cursor-default"
              >
                {feature.icon} {feature.text}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <AnimatePresence mode="popLayout">
        {/* Messages */}
        {messages.map((message, index) => (
          <motion.div
            key={`msg-${index}-${message.id || 'no-id'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* User messages - compact display */}
            {message.role === "user" && (
              <div className="flex justify-end mb-4">
                <div className="max-w-[70%] rounded-xl p-3 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 border border-purple-500/20">
                  {Array.isArray(message.content) ? (
                    message.content.map((part, i) =>
                      part.type === "text" ? (
                        <p key={i} className="text-sm text-white/80 whitespace-pre-wrap">
                          {part.text}
                        </p>
                      ) : null
                    )
                  ) : (
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {String(message.content)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Assistant messages - full width for components */}
            {message.role === "assistant" && (
              <div>
                {/* Text content */}
                {Array.isArray(message.content) ? (
                  message.content.map((part, i) =>
                    part.type === "text" && part.text && part.text.trim() ? (
                      <div key={i} className="mb-4 glass-card p-5 rounded-xl">
                        <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none
                          prose-headings:font-bold prose-headings:text-white/90
                          prose-h1:text-lg prose-h1:mb-3 prose-h1:mt-0
                          prose-h2:text-base prose-h2:mb-2 prose-h2:mt-4
                          prose-h3:text-sm prose-h3:mb-2 prose-h3:mt-3
                          prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-3
                          prose-strong:text-white/90 prose-strong:font-semibold
                          prose-ul:my-2 prose-li:text-white/70 prose-li:my-1
                          prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      </div>
                    ) : null
                  )
                ) : (
                  String(message.content).trim() && (
                    <div className="mb-4 glass-card p-5 rounded-xl">
                      <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none
                        prose-headings:font-bold prose-headings:text-white/90
                        prose-h1:text-lg prose-h1:mb-3 prose-h1:mt-0
                        prose-h2:text-base prose-h2:mb-2 prose-h2:mt-4
                        prose-h3:text-sm prose-h3:mb-2 prose-h3:mt-3
                        prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-3
                        prose-strong:text-white/90 prose-strong:font-semibold
                        prose-ul:my-2 prose-li:text-white/70 prose-li:my-1
                        prose-code:text-purple-300 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
                        <ReactMarkdown>{String(message.content)}</ReactMarkdown>
                      </div>
                    </div>
                  )
                )}

                {/* Rendered component from Tambo - full width */}
                {message.renderedComponent && (
                  <div className="mb-6">{message.renderedComponent}</div>
                )}
              </div>
            )}
          </motion.div>
        ))}

        {/* Loading indicator */}
        {isPending && (
          <motion.div
            key="loading-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 justify-center py-8"
          >
            <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
            <span className="text-sm text-purple-400">Analyzing contract...</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}
