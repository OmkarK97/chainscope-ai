"use client";

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const variants = {
  primary:
    "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-transparent shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:brightness-110",
  secondary:
    "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white/90 border-white/10 backdrop-blur-sm",
  ghost:
    "bg-transparent text-white/50 hover:text-white/80 hover:bg-white/5 border-transparent",
  danger:
    "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30 shadow-lg shadow-red-500/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      onClick,
      type = "button",
      title,
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        title={title}
        onClick={onClick}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          border transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95 hover:scale-[1.02]
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
