import type { Severity } from "@/types";

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  info: "#22d3ee",
};

export const SEVERITY_BG_COLORS: Record<Severity, string> = {
  critical: "bg-red-500/10 border border-red-500/20",
  high: "bg-orange-500/10 border border-orange-500/20",
  medium: "bg-yellow-500/10 border border-yellow-500/20",
  low: "bg-blue-500/10 border border-blue-500/20",
  info: "bg-cyan-500/10 border border-cyan-500/20",
};

export const SEVERITY_TEXT_COLORS: Record<Severity, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-blue-400",
  info: "text-cyan-400",
};

export const SEVERITY_BADGE_COLORS: Record<Severity, string> = {
  critical: "bg-red-500/20 text-red-300 border border-red-500/30",
  high: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  info: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
};

export const GRADE_COLORS: Record<string, string> = {
  A: "#22d3ee",
  B: "#84cc16",
  C: "#eab308",
  D: "#f97316",
  F: "#ef4444",
};

export function normalizeSeverity(value?: string): Severity {
  if (!value) return "info";
  const lower = value.toLowerCase().trim();
  if (lower.includes("critical")) return "critical";
  if (lower.includes("high")) return "high";
  if (lower.includes("medium") || lower.includes("moderate")) return "medium";
  if (lower.includes("low")) return "low";
  return "info";
}

export function normalizeGrade(value?: string): string {
  if (!value) return "F";
  const upper = value.toUpperCase().trim();
  if (upper.startsWith("A")) return "A";
  if (upper.startsWith("B")) return "B";
  if (upper.startsWith("C")) return "C";
  if (upper.startsWith("D")) return "D";
  return "F";
}

export const SAMPLE_VULNERABLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract VulnerableVault {
    mapping(address => uint256) public balances;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABILITY 1: Reentrancy
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        balances[msg.sender] = 0;
    }

    // VULNERABILITY 2: Missing access control
    function setOwner(address _newOwner) external {
        owner = _newOwner;
    }

    // VULNERABILITY 3: tx.origin
    function emergencyWithdraw() external {
        require(tx.origin == owner, "Not owner");
        payable(owner).transfer(address(this).balance);
    }

    // VULNERABILITY 4: Integer overflow (Solidity < 0.8)
    function addBalance(uint256 amount) external {
        balances[msg.sender] += amount;
    }
}`;
