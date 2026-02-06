"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTamboThread, useTamboThreadInput } from "@tambo-ai/react";
import { Send, Loader2, FileCode, Trash2, Sparkles } from "lucide-react";
import { CodeEditor } from "@/components/ui/CodeEditor";
import { Button } from "@/components/ui/Button";
import { SAMPLE_VULNERABLE_CONTRACT } from "@/lib/constants";

export function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();
  const [codeInput, setCodeInput] = useState("");
  const [showCodeEditor, setShowCodeEditor] = useState(true);

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

  const loadSampleContract = () => {
    setCodeInput(SAMPLE_VULNERABLE_CONTRACT);
    setShowCodeEditor(true);
  };

  const hasMessages = (thread?.messages || []).filter(m => m.role !== "system").length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-1">
          Smart Contract Input
        </h2>
        <p className="text-xs text-white/30">
          Paste your Solidity code below
        </p>
      </div>

      {/* Welcome / Sample Button */}
      {!hasMessages && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={loadSampleContract}
            leftIcon={<FileCode className="w-4 h-4" />}
            className="w-full"
          >
            Load Sample Vulnerable Contract
          </Button>
        </motion.div>
      )}

      {/* Code Editor */}
      {showCodeEditor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 flex-1 flex flex-col min-h-0"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/40">Contract Code</span>
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
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={codeInput}
              onChange={setCodeInput}
              minHeight="200px"
            />
          </div>
        </motion.div>
      )}

      {/* Text Input */}
      <div className="mt-auto space-y-3">
        <div className="flex gap-2">
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
                  ? "Add instructions (optional)..."
                  : "Describe what to audit..."
              }
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                text-sm text-white/80 placeholder:text-white/25
                focus:outline-none focus:border-purple-500/30 focus:ring-2 focus:ring-purple-500/10
                transition-all duration-200"
            />
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          isLoading={isPending}
          disabled={!value.trim() && !codeInput.trim()}
          rightIcon={<Send className="w-4 h-4" />}
          className="w-full"
        >
          {isPending ? "Analyzing..." : codeInput ? "Audit Contract" : "Send"}
        </Button>

        {/* Suggested Actions */}
        {hasMessages && (
          <div className="pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2 text-xs text-white/30">
              <Sparkles className="w-3 h-3" />
              <span>Quick Actions</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setValue("Explain the most critical vulnerability in detail");
                  submit();
                }}
                className="w-full text-left px-3 py-2 text-xs text-white/60 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Explain critical issue
              </button>
              <button
                onClick={() => {
                  setValue("Show me how to fix all the vulnerabilities");
                  submit();
                }}
                className="w-full text-left px-3 py-2 text-xs text-white/60 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Show fixes
              </button>
              <button
                onClick={() => {
                  setCodeInput("");
                  setShowCodeEditor(true);
                }}
                className="w-full text-left px-3 py-2 text-xs text-white/60 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Audit another contract
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
