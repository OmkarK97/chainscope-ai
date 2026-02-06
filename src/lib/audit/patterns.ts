import type { Vulnerability, VulnerabilityCategory } from "@/types";

interface PatternMatch {
  pattern: RegExp;
  category: VulnerabilityCategory;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  impact: string;
  recommendation: string;
}

export const VULNERABILITY_PATTERNS: PatternMatch[] = [
  {
    pattern: /\.call\{value:.*\}.*\n(?:(?!.*=\s*0).)*/gm,
    category: "reentrancy",
    title: "Reentrancy Vulnerability",
    severity: "critical",
    description:
      "External call made before state update. An attacker can recursively call back into the contract before the state is updated.",
    impact:
      "Complete drainage of contract funds through recursive withdrawal calls.",
    recommendation:
      "Apply the Checks-Effects-Interactions pattern: update state before making external calls, or use a reentrancy guard.",
  },
  {
    pattern: /function\s+\w+\s*\([^)]*\)\s*(?:external|public)[^{]*\{[^}]*(?:owner\s*=|admin\s*=|_owner\s*=)[^}]*\}/gm,
    category: "access-control",
    title: "Missing Access Control",
    severity: "critical",
    description:
      "State-changing function that modifies ownership or admin privileges lacks access control modifiers.",
    impact:
      "Anyone can take ownership of the contract and gain full control over its assets.",
    recommendation:
      "Add onlyOwner modifier or require(msg.sender == owner) check.",
  },
  {
    pattern: /tx\.origin/g,
    category: "tx-origin",
    title: "tx.origin Authentication",
    severity: "high",
    description:
      "Using tx.origin for authentication is vulnerable to phishing attacks. A malicious contract can trick users into calling it.",
    impact:
      "User funds can be stolen through phishing attacks where users are tricked into calling a malicious contract.",
    recommendation: "Use msg.sender instead of tx.origin for authentication.",
  },
  {
    pattern: /pragma\s+solidity\s+[\^~]?0\.[0-7]\.\d+/g,
    category: "overflow",
    title: "Integer Overflow/Underflow Risk",
    severity: "high",
    description:
      "Contract uses Solidity version < 0.8.0 which doesn't have built-in overflow/underflow protection.",
    impact:
      "Arithmetic operations can silently overflow or underflow, leading to unexpected behavior and potential fund loss.",
    recommendation:
      "Upgrade to Solidity 0.8.0+ or use SafeMath library for all arithmetic operations.",
  },
  {
    pattern: /\.transfer\s*\([^)]+\)|\.send\s*\([^)]+\)/g,
    category: "unchecked-return",
    title: "Unchecked Transfer Return Value",
    severity: "medium",
    description:
      "Transfer or send return value is not checked. These functions return false on failure instead of reverting.",
    impact:
      "Failed transfers may go unnoticed, leading to inconsistent contract state.",
    recommendation:
      "Use call{value:}() with success check, or use OpenZeppelin's Address.sendValue().",
  },
  {
    pattern: /for\s*\([^)]*;\s*[^;]*<\s*\w+\.length\s*;/g,
    category: "dos",
    title: "Unbounded Loop",
    severity: "medium",
    description:
      "Loop iterates over a dynamic array without bounds. If the array grows large, this can exceed block gas limit.",
    impact:
      "Contract functions may become unusable if array grows too large, effectively bricking the contract.",
    recommendation:
      "Implement pagination or limit array size. Consider pull-over-push pattern.",
  },
  {
    pattern: /block\.(timestamp|number)/g,
    category: "front-running",
    title: "Block Property Dependency",
    severity: "low",
    description:
      "Contract relies on block.timestamp or block.number for critical logic. Miners have some control over these values.",
    impact:
      "Miners can manipulate block timestamp within certain bounds, potentially affecting contract behavior.",
    recommendation:
      "Avoid using block properties for randomness or time-critical operations. Consider using Chainlink VRF.",
  },
  {
    pattern: /selfdestruct|suicide/g,
    category: "centralization",
    title: "Selfdestruct Present",
    severity: "medium",
    description:
      "Contract contains selfdestruct which can permanently destroy the contract and send all funds to a specified address.",
    impact:
      "Contract can be destroyed, potentially causing loss of funds for users who have tokens or balances.",
    recommendation:
      "Remove selfdestruct if not absolutely necessary, or add proper access controls and timelocks.",
  },
  {
    pattern: /delegatecall/g,
    category: "logic-error",
    title: "Delegatecall Usage",
    severity: "high",
    description:
      "Contract uses delegatecall which executes code in the context of the calling contract. Improper use can be dangerous.",
    impact:
      "Malicious or buggy delegate targets can modify storage arbitrarily, potentially leading to complete fund loss.",
    recommendation:
      "Ensure delegatecall targets are trusted and immutable. Consider using well-audited proxy patterns.",
  },
  {
    pattern: /assembly\s*\{/g,
    category: "logic-error",
    title: "Inline Assembly Usage",
    severity: "info",
    description:
      "Contract uses inline assembly which bypasses Solidity's safety checks. This requires extra caution.",
    impact:
      "Assembly code can introduce subtle bugs that are hard to detect and may bypass security checks.",
    recommendation:
      "Review assembly code carefully. Document the purpose and ensure it's absolutely necessary.",
  },
];

export function findLineNumbers(
  code: string,
  pattern: RegExp
): { start: number; end: number }[] {
  const lines = code.split("\n");
  const matches: { start: number; end: number }[] = [];
  const regex = new RegExp(pattern.source, pattern.flags);

  let match;
  while ((match = regex.exec(code)) !== null) {
    const beforeMatch = code.substring(0, match.index);
    const startLine = beforeMatch.split("\n").length;
    const matchLines = match[0].split("\n").length;
    matches.push({
      start: startLine,
      end: startLine + matchLines - 1,
    });
  }

  return matches;
}

export function extractCodeSnippet(
  code: string,
  lineStart: number,
  lineEnd: number,
  context: number = 2
): string {
  const lines = code.split("\n");
  const start = Math.max(0, lineStart - context - 1);
  const end = Math.min(lines.length, lineEnd + context);
  return lines.slice(start, end).join("\n");
}

export function detectVulnerabilities(code: string): Vulnerability[] {
  const vulnerabilities: Vulnerability[] = [];
  let idCounter = 1;

  for (const patternMatch of VULNERABILITY_PATTERNS) {
    const regex = new RegExp(patternMatch.pattern.source, patternMatch.pattern.flags);
    const matches = findLineNumbers(code, regex);

    for (const lineMatch of matches) {
      const codeSnippet = extractCodeSnippet(
        code,
        lineMatch.start,
        lineMatch.end
      );

      vulnerabilities.push({
        id: `vuln-${idCounter++}`,
        title: patternMatch.title,
        severity: patternMatch.severity,
        description: patternMatch.description,
        category: patternMatch.category,
        lineNumbers: lineMatch,
        codeSnippet,
        impact: patternMatch.impact,
        recommendation: patternMatch.recommendation,
      });
    }
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  vulnerabilities.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return vulnerabilities;
}
