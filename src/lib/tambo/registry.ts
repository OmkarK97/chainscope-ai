import type { TamboComponent } from "@tambo-ai/react";
import {
  VulnerabilityCardSchema,
  SecurityScoreSchema,
  CodeDiffSchema,
  FixSuggestionSchema,
  AuditSummarySchema,
  ScanningIndicatorSchema,
  SafeContractSchema,
  FixedContractSchema,
} from "./schemas";
import {
  VulnerabilityCard,
  SecurityScoreMeter,
  CodeDiffViewer,
  AuditSummaryCard,
  FixSuggestionCard,
  ScanningIndicator,
  SafeContractCard,
  FixedContractCard,
} from "@/components/tambo";

export const tamboComponents: TamboComponent[] = [
  {
    name: "VulnerabilityCard",
    description:
      "Displays a single security vulnerability finding with severity badge, highlighted title, description, inline diff view (vulnerable vs fixed code), impact, and recommendation. Always provide both codeSnippet and fixedCode to show the GitHub-style diff view.",
    component: VulnerabilityCard,
    propsSchema: VulnerabilityCardSchema,
  },
  {
    name: "SecurityScoreMeter",
    description:
      "An animated gauge showing the overall security score (0-100), letter grade, and breakdown of issues by severity. Use this to summarize the security assessment.",
    component: SecurityScoreMeter,
    propsSchema: SecurityScoreSchema,
  },
  {
    name: "CodeDiffViewer",
    description:
      "Unified diff view showing vulnerable code vs fixed code in GitHub style (red removed lines, green added lines) with a copy button. Use this when explaining how to fix a specific vulnerability.",
    component: CodeDiffViewer,
    propsSchema: CodeDiffSchema,
  },
  {
    name: "AuditSummaryCard",
    description:
      "Comprehensive summary of the audit including contract info, lines analyzed, issue breakdown, and top recommendations. Use at the start or end of an audit.",
    component: AuditSummaryCard,
    propsSchema: AuditSummarySchema,
  },
  {
    name: "FixSuggestionCard",
    description:
      "Detailed fix suggestion with step-by-step instructions, effort estimation, and code example. Use when providing detailed remediation guidance.",
    component: FixSuggestionCard,
    propsSchema: FixSuggestionSchema,
  },
  {
    name: "ScanningIndicator",
    description:
      "Progress indicator showing scanning/analyzing status with optional progress percentage. Use to show the audit is in progress.",
    component: ScanningIndicator,
    propsSchema: ScanningIndicatorSchema,
  },
  {
    name: "SafeContractCard",
    description:
      "Celebratory card shown when no critical vulnerabilities are found. Use to give positive feedback for secure contracts.",
    component: SafeContractCard,
    propsSchema: SafeContractSchema,
  },
  {
    name: "FixedContractCard",
    description:
      "Shows the complete fixed contract code with all vulnerabilities resolved, syntax highlighted with line numbers and a prominent copy button. Always render this as the LAST component after all VulnerabilityCards to give the user the full corrected contract.",
    component: FixedContractCard,
    propsSchema: FixedContractSchema,
  },
];
