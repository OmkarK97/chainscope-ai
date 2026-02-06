export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type VulnerabilityCategory =
  | "reentrancy"
  | "overflow"
  | "underflow"
  | "access-control"
  | "unchecked-return"
  | "gas-optimization"
  | "front-running"
  | "dos"
  | "logic-error"
  | "centralization"
  | "tx-origin";

export interface Vulnerability {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  category: VulnerabilityCategory;
  lineNumbers?: {
    start: number;
    end: number;
  };
  codeSnippet?: string;
  impact?: string;
  recommendation?: string;
}

export interface SecurityScore {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  summary: string;
}

export interface AuditResult {
  contractName: string;
  contractType?: string;
  linesAnalyzed: number;
  auditDuration: string;
  overallRisk: Severity;
  vulnerabilities: Vulnerability[];
  securityScore: SecurityScore;
  topRecommendations: string[];
}

export interface CodeDiff {
  vulnerabilityId: string;
  title: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  pattern: string;
}

export interface FixSuggestion {
  vulnerabilityId: string;
  title: string;
  description: string;
  steps: string[];
  codeExample?: string;
  effort: "low" | "medium" | "high";
  priority: "immediate" | "soon" | "later";
}
