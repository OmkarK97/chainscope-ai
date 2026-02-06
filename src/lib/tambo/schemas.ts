import { z } from "zod";

export const SeveritySchema = z.string().describe("Severity level: critical, high, medium, low, or info");

export const VulnerabilityCategorySchema = z.string().describe("Category: reentrancy, overflow, underflow, access-control, unchecked-return, gas-optimization, front-running, dos, logic-error, centralization, or tx-origin");

export const VulnerabilityCardSchema = z.object({
  id: z.string().optional().default("vuln-1").describe("Unique identifier for the vulnerability"),
  title: z.string().optional().default("Vulnerability").describe("Short title describing the vulnerability"),
  severity: SeveritySchema.optional().default("medium").describe("Severity level of the vulnerability"),
  description: z.string().optional().default("").describe("Detailed description of the vulnerability"),
  category: VulnerabilityCategorySchema.optional().default("logic-error").describe("Category of the vulnerability"),
  lineNumbers: z
    .object({
      start: z.number().optional().default(0),
      end: z.number().optional().default(0),
    })
    .optional()
    .describe("Line numbers where the vulnerability was found"),
  codeSnippet: z
    .string()
    .optional()
    .describe("Code snippet showing the vulnerable code"),
  fixedCode: z
    .string()
    .optional()
    .describe("The corrected/fixed version of the vulnerable code snippet"),
  impact: z.string().optional().describe("Potential impact of this vulnerability"),
  recommendation: z
    .string()
    .optional()
    .describe("Recommended fix for this vulnerability"),
});

export const SecurityScoreSchema = z.object({
  score: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .default(0)
    .describe("Security score from 0 to 100"),
  grade: z.string().optional().default("F").describe("Letter grade: A, B, C, D, or F"),
  breakdown: z
    .object({
      critical: z.number().optional().default(0),
      high: z.number().optional().default(0),
      medium: z.number().optional().default(0),
      low: z.number().optional().default(0),
      info: z.number().optional().default(0),
    })
    .optional()
    .default({ critical: 0, high: 0, medium: 0, low: 0, info: 0 })
    .describe("Count of issues by severity"),
  summary: z.string().optional().default("").describe("Summary of the security assessment"),
});

export const CodeDiffSchema = z.object({
  vulnerabilityId: z.string().optional().default("vuln-1").describe("ID of the vulnerability being fixed"),
  title: z.string().optional().default("Fix").describe("Title of the fix"),
  originalCode: z.string().optional().default("").describe("The vulnerable code"),
  fixedCode: z.string().optional().default("").describe("The secure fixed code"),
  explanation: z.string().optional().default("").describe("Explanation of the fix"),
  pattern: z
    .string()
    .optional()
    .default("")
    .describe("Security pattern applied (e.g., Checks-Effects-Interactions)"),
});

export const FixSuggestionSchema = z.object({
  vulnerabilityId: z.string().optional().default("vuln-1").describe("ID of the vulnerability"),
  title: z.string().optional().default("Fix Suggestion").describe("Title of the fix suggestion"),
  description: z.string().optional().default("").describe("Detailed description of the fix"),
  steps: z.array(z.string()).optional().default([]).describe("Step-by-step fix instructions"),
  codeExample: z.string().optional().describe("Example code for the fix"),
  effort: z
    .string()
    .optional()
    .default("medium")
    .describe("Effort level: low, medium, or high"),
  priority: z
    .string()
    .optional()
    .default("soon")
    .describe("Priority: immediate, soon, or later"),
});

export const AuditSummarySchema = z.object({
  contractName: z.string().optional().default("Contract").describe("Name of the audited contract"),
  contractType: z
    .string()
    .optional()
    .describe("Type of contract (ERC20, ERC721, DeFi, etc.)"),
  linesAnalyzed: z.number().optional().default(0).describe("Number of lines analyzed"),
  overallRisk: SeveritySchema.optional().default("medium").describe("Overall risk level"),
  issueBreakdown: z
    .object({
      critical: z.number().optional().default(0),
      high: z.number().optional().default(0),
      medium: z.number().optional().default(0),
      low: z.number().optional().default(0),
      info: z.number().optional().default(0),
    })
    .optional()
    .default({ critical: 0, high: 0, medium: 0, low: 0, info: 0 })
    .describe("Count of issues by severity"),
  topRecommendations: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Top recommendations for improving security"),
});

export const ScanningIndicatorSchema = z.object({
  status: z
    .string()
    .optional()
    .default("scanning")
    .describe("Current scanning status: scanning, analyzing, or complete"),
  message: z.string().optional().default("Analyzing contract...").describe("Status message to display"),
  progress: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .describe("Progress percentage"),
});

export const SafeContractSchema = z.object({
  contractName: z.string().optional().default("Contract").describe("Name of the contract"),
  message: z.string().optional().default("No critical vulnerabilities found.").describe("Message about the contract's security"),
  checksPerformed: z
    .array(z.string())
    .optional()
    .default([])
    .describe("List of security checks performed"),
});

export const FixedContractSchema = z.object({
  contractName: z.string().optional().default("Contract").describe("Name of the contract"),
  code: z.string().optional().default("").describe("The complete fixed Solidity contract code with all vulnerabilities resolved"),
  changesSummary: z
    .array(z.string())
    .optional()
    .default([])
    .describe("Brief list of changes made, e.g. 'Added reentrancy guard', 'Fixed access control'"),
});
