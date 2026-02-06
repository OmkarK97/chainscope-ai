"use client";

import { useRef, useEffect, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Code, FileCode } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "Paste your Solidity code here...",
  minHeight = "200px",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(
        parseInt(minHeight),
        textareaRef.current.scrollHeight
      )}px`;
    }
  }, [value, minHeight]);

  const lineCount = value.split("\n").length || 1;

  return (
    <div
      className={`relative rounded-xl transition-all duration-200 glass-card ${
        isFocused
          ? "!border-cyan-500/30 ring-2 ring-cyan-500/10"
          : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <FileCode className="w-4 h-4 text-white/25" />
        <span className="text-xs text-white/25">Solidity</span>
        <div className="flex-1" />
        <span className="text-xs text-white/20">{lineCount} lines</span>
      </div>

      {/* Editor Area */}
      <div className="relative overflow-y-auto" style={{ minHeight, maxHeight: "350px" }}>
        {/* Line Numbers */}
        <div
          className="absolute left-0 top-0 bottom-0 w-10 bg-white/[0.01] border-r border-white/5 select-none pointer-events-none"
          aria-hidden
        >
          <div className="p-4 text-right">
            {(value || " ").split("\n").map((_, i) => (
              <div key={i} className="text-xs text-white/20 leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          spellCheck={false}
          className="w-full h-full pl-14 pr-4 py-4 bg-transparent text-sm text-white/70
            font-mono leading-6 resize-none focus:outline-none placeholder:text-white/20"
          style={{ minHeight }}
        />
      </div>
    </div>
  );
}
