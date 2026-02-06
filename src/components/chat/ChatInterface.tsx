"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Loader2, FileCode, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { Button } from "@/components/ui/Button";
import { SuggestedActions } from "@/components/ui/SuggestedActions";
import { SAMPLE_VULNERABLE_CONTRACT } from "@/lib/constants";

interface SuggestedAction {
  label: string;
  action: string;
}

export function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [codeInput, setCodeInput] = useState("");
  const [showCodeEditor, setShowCodeEditor] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const handleSubmit = async () => {
    if (!value.trim() && !codeInput.trim()) return;

    // Combine text input with code if present
    let messageContent = value;
    if (codeInput.trim()) {
      messageContent = value
        ? `${value}\n\n\`\`\`solidity\n${codeInput}\n\`\`\``
        : `Audit this Solidity contract for security vulnerabilities:\n\n\`\`\`solidity\n${codeInput}\n\`\`\``;
      setCodeInput("");
      setShowCodeEditor(false);
    }

    setValue(messageContent);
    try {
      await submit();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setValue("");
    }
  };

  const handleSuggestedAction = async (action: string) => {
    setValue(action);
    try {
      await submit();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setValue("");
    }
  };

  const loadSampleContract = () => {
    setCodeInput(SAMPLE_VULNERABLE_CONTRACT);
    setShowCodeEditor(true);
  };

  const getSuggestedActions = (): SuggestedAction[] => {
    const messages = (thread?.messages || []).filter(m => m.role !== "system");
    if (messages.length === 0) {
      return [
        { label: "Try a sample contract", action: "load_sample" },
      ];
    }

    // Context-aware suggestions based on conversation
    const hasAuditResponse = messages.some(
      (m) => m.role === "assistant" && m.renderedComponent
    );

    if (hasAuditResponse) {
      return [
        { label: "Explain the most critical issue", action: "Explain the most critical vulnerability in detail" },
        { label: "Show fixes for all issues", action: "Show me how to fix all the vulnerabilities" },
        { label: "Audit another contract", action: "I want to audit another contract" },
      ];
    }

    return [
      { label: "Check for reentrancy", action: "Check this contract for reentrancy vulnerabilities" },
      { label: "Full security audit", action: "Perform a comprehensive security audit" },
      { label: "Gas optimization tips", action: "Give me gas optimization suggestions" },
    ];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <AnimatePresence mode="popLayout">
          {/* Welcome message if no user/assistant messages */}
          {(!thread?.messages || thread.messages.filter(m => m.role !== "system").length === 0) && (
            <motion.div
              key="welcome-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-white/10 backdrop-blur-sm mb-4">
                <FileCode className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold text-white/90 mb-2">
                Welcome to ChainScope AI
              </h2>
              <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                Paste your Solidity smart contract below and I'll analyze it for
                security vulnerabilities, providing detailed findings and fix
                suggestions.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={loadSampleContract}
                leftIcon={<FileCode className="w-4 h-4" />}
              >
                Load Sample Vulnerable Contract
              </Button>
            </motion.div>
          )}

          {/* Messages (filter out system messages) */}
          {thread?.messages.filter(m => m.role !== "system").map((message, index) => (
            <motion.div
              key={`msg-${index}-${message.id || 'no-id'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-4 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500/15 to-cyan-500/5 border border-blue-500/20"
                    : "glass-card"
                }`}
              >
                {/* Text content */}
                {Array.isArray(message.content) ? (
                  message.content.map((part, i) =>
                    part.type === "text" ? (
                      message.role === "assistant" ? (
                        <div key={i} className="text-sm text-white/70 prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{part.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p
                          key={i}
                          className="text-sm text-white/80 whitespace-pre-wrap"
                        >
                          {part.text}
                        </p>
                      )
                    ) : null
                  )
                ) : (
                  message.role === "assistant" ? (
                    <div className="text-sm text-white/70 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{String(message.content)}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {String(message.content)}
                    </p>
                  )
                )}

                {/* Rendered component from Tambo */}
                {message.renderedComponent && (
                  <div className="mt-4">{message.renderedComponent}</div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isPending && (
            <motion.div
              key="loading-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-cyan-400"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Analyzing...</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      <div className="px-4 py-3 border-t border-white/5">
        <SuggestedActions
          actions={getSuggestedActions()}
          onSelect={(action) => {
            if (action === "load_sample") {
              loadSampleContract();
            } else {
              handleSuggestedAction(action);
            }
          }}
        />
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-white/5 bg-white/[0.01]">
        {/* Code Editor Toggle */}
        {showCodeEditor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/40">Smart Contract Code</span>
              <button
                onClick={() => {
                  setCodeInput("");
                  setShowCodeEditor(false);
                }}
                className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </button>
            </div>
            <CodeEditor
              value={codeInput}
              onChange={setCodeInput}
              minHeight="150px"
            />
          </motion.div>
        )}

        {/* Text Input */}
        <div className="flex gap-3">
          {!showCodeEditor && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowCodeEditor(true)}
              title="Add code"
            >
              <FileCode className="w-4 h-4" />
            </Button>
          )}
          <div className="flex-1 relative">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={
                codeInput
                  ? "Add instructions or press Enter to audit..."
                  : "Describe what you want to audit or paste code above..."
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                text-sm text-white/80 placeholder:text-white/25
                focus:outline-none focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10
                transition-all duration-200"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!value.trim() && !codeInput.trim()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            {codeInput ? "Audit" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
