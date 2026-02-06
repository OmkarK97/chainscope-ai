import type { Vulnerability, SecurityScore, Severity } from "@/types";

export function calculateSecurityScore(
  vulnerabilities: Vulnerability[]
): SecurityScore {
  let score = 100;

  const breakdown = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  for (const vuln of vulnerabilities) {
    breakdown[vuln.severity]++;
    switch (vuln.severity) {
      case "critical":
        score -= 25;
        break;
      case "high":
        score -= 15;
        break;
      case "medium":
        score -= 8;
        break;
      case "low":
        score -= 3;
        break;
      case "info":
        score -= 1;
        break;
    }
  }

  score = Math.max(0, Math.min(100, score));

  const grade = getGrade(score);
  const summary = getSummary(score, breakdown);

  return {
    score,
    grade,
    breakdown,
    summary,
  };
}

function getGrade(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

function getSummary(
  score: number,
  breakdown: Record<string, number>
): string {
  const totalIssues =
    breakdown.critical +
    breakdown.high +
    breakdown.medium +
    breakdown.low +
    breakdown.info;

  if (totalIssues === 0) {
    return "Excellent! No security issues detected. The contract appears to follow best practices.";
  }

  if (score >= 90) {
    return "Great security posture with only minor issues. Address the info-level items for best practices.";
  }

  if (score >= 75) {
    return "Good security with some areas for improvement. Review and address the medium-priority findings.";
  }

  if (score >= 60) {
    return "Moderate security concerns. Several issues need attention before deployment.";
  }

  if (score >= 40) {
    return "Significant security risks identified. Critical review and fixes required before deployment.";
  }

  return "Critical security vulnerabilities detected. Do NOT deploy this contract without major remediation.";
}

export function getOverallRisk(
  breakdown: Record<string, number>
): Severity {
  if (breakdown.critical > 0) return "critical";
  if (breakdown.high > 0) return "high";
  if (breakdown.medium > 0) return "medium";
  if (breakdown.low > 0) return "low";
  return "info";
}

export function generateRecommendations(
  vulnerabilities: Vulnerability[]
): string[] {
  const recommendations: string[] = [];
  const categories = new Set(vulnerabilities.map((v) => v.category));

  if (categories.has("reentrancy")) {
    recommendations.push(
      "Implement reentrancy guards using OpenZeppelin's ReentrancyGuard"
    );
  }

  if (categories.has("access-control")) {
    recommendations.push(
      "Add proper access control using Ownable or AccessControl from OpenZeppelin"
    );
  }

  if (categories.has("overflow") || categories.has("underflow")) {
    recommendations.push(
      "Upgrade to Solidity 0.8+ for built-in overflow protection"
    );
  }

  if (categories.has("tx-origin")) {
    recommendations.push("Replace tx.origin with msg.sender for authentication");
  }

  if (categories.has("unchecked-return")) {
    recommendations.push(
      "Check return values of all external calls or use SafeERC20"
    );
  }

  if (categories.has("dos")) {
    recommendations.push(
      "Implement pagination or limits for loops over dynamic arrays"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("Continue following security best practices");
    recommendations.push("Consider a professional audit before mainnet deployment");
  }

  return recommendations.slice(0, 5);
}
