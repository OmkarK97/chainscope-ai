import { z } from "zod";
import { detectVulnerabilities } from "@/lib/audit/patterns";
import {
  calculateSecurityScore,
  generateRecommendations,
  getOverallRisk,
} from "@/lib/audit/scoring";

export const tamboTools = [
  {
    name: "analyze_contract",
    description:
      "Analyze a Solidity smart contract for security vulnerabilities. Returns detected vulnerabilities, security score, and recommendations.",
    inputSchema: z.object({
      code: z.string().describe("The Solidity smart contract code to analyze"),
      contractName: z
        .string()
        .optional()
        .describe("Optional name of the contract"),
    }),
    outputSchema: z.object({
      contractName: z.string(),
      linesAnalyzed: z.number(),
      overallRisk: z.string(),
      vulnerabilities: z.array(z.any()),
      securityScore: z.any(),
      recommendations: z.array(z.string()),
    }),
    tool: async ({
      code,
      contractName,
    }: {
      code: string;
      contractName?: string;
    }) => {
      const vulnerabilities = detectVulnerabilities(code);
      const securityScore = calculateSecurityScore(vulnerabilities);
      const recommendations = generateRecommendations(vulnerabilities);
      const linesAnalyzed = code.split("\n").length;
      const overallRisk = getOverallRisk(securityScore.breakdown);

      // Extract contract name from code if not provided
      const extractedName =
        contractName ||
        code.match(/contract\s+(\w+)/)?.[1] ||
        "Unknown Contract";

      return {
        contractName: extractedName,
        linesAnalyzed,
        overallRisk,
        vulnerabilities,
        securityScore,
        recommendations,
      };
    },
  },
  {
    name: "explain_vulnerability",
    description:
      "Get a detailed explanation of a specific vulnerability type including real-world examples and impact.",
    inputSchema: z.object({
      vulnerabilityType: z
        .string()
        .describe("The type of vulnerability to explain: reentrancy, overflow, access-control, unchecked-return, tx-origin, dos, or front-running"),
    }),
    outputSchema: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      realWorldExample: z.string().optional(),
      attackVector: z.string().optional(),
      prevention: z.array(z.string()).optional(),
    }),
    tool: async ({
      vulnerabilityType,
    }: {
      vulnerabilityType: string;
    }) => {
      const explanations: Record<string, object> = {
        reentrancy: {
          title: "Reentrancy Attack",
          description:
            "A reentrancy attack occurs when an external contract call is made before state changes are applied. The malicious contract can call back into the vulnerable contract before the first execution completes.",
          realWorldExample:
            "The DAO Hack (2016) - $60M stolen using reentrancy in the withdraw function.",
          attackVector:
            "1. Attacker calls withdraw()\n2. Contract sends ETH via .call()\n3. Attacker's fallback/receive triggers\n4. Fallback calls withdraw() again\n5. State not yet updated, so check passes\n6. Loop until drained",
          prevention: [
            "Use Checks-Effects-Interactions pattern",
            "Implement ReentrancyGuard modifier",
            "Update state before external calls",
          ],
        },
        overflow: {
          title: "Integer Overflow/Underflow",
          description:
            "In Solidity < 0.8.0, arithmetic operations can overflow or underflow silently. Adding 1 to the maximum uint256 value wraps to 0.",
          realWorldExample:
            "BEC Token (2018) - Attacker minted billions of tokens due to multiplication overflow.",
          attackVector:
            "1. Find arithmetic without SafeMath\n2. Craft input that causes overflow\n3. Receive more tokens/ETH than deposited",
          prevention: [
            "Upgrade to Solidity 0.8.0+",
            "Use SafeMath library for older versions",
            "Add explicit overflow checks",
          ],
        },
        "access-control": {
          title: "Missing Access Control",
          description:
            "Functions that change critical state (ownership, balances, parameters) without proper access restrictions can be called by anyone.",
          realWorldExample:
            "Parity Multisig Wallet (2017) - Anyone could become owner and kill the contract.",
          attackVector:
            "1. Find public/external function without modifier\n2. Call function to change ownership\n3. Drain funds as new owner",
          prevention: [
            "Use onlyOwner or similar modifiers",
            "Implement role-based access control",
            "Use OpenZeppelin's Ownable or AccessControl",
          ],
        },
        "unchecked-return": {
          title: "Unchecked External Call Returns",
          description:
            "ERC20 transfer() and low-level calls can fail silently. Not checking return values can lead to lost funds or inconsistent state.",
          realWorldExample:
            "Various DeFi protocols have lost funds due to ignored transfer failures.",
          attackVector:
            "1. Token transfer fails but returns false\n2. Contract assumes success\n3. State updated incorrectly\n4. User credited without receiving tokens",
          prevention: [
            "Use SafeERC20 for token transfers",
            "Check return values of all external calls",
            "Use require(success) pattern",
          ],
        },
        "tx-origin": {
          title: "tx.origin Phishing",
          description:
            "Using tx.origin for authentication allows phishing attacks. If a user interacts with a malicious contract, that contract can call the vulnerable contract on behalf of the user.",
          realWorldExample:
            "Theoretical but well-documented attack vector in early Ethereum.",
          attackVector:
            "1. Attacker deploys malicious contract\n2. Victim calls malicious contract\n3. Malicious contract calls vulnerable contract\n4. tx.origin == victim, msg.sender == attacker\n5. Authentication passes, funds stolen",
          prevention: [
            "Use msg.sender instead of tx.origin",
            "Never use tx.origin for authentication",
            "Consider multi-sig for critical operations",
          ],
        },
        dos: {
          title: "Denial of Service (DoS)",
          description:
            "Unbounded loops or operations that can be manipulated to consume excessive gas can render contract functions unusable.",
          realWorldExample:
            "GovernMental (2016) - Lottery became unplayable due to unbounded loop.",
          attackVector:
            "1. Find function with loop over dynamic array\n2. Add many entries to the array\n3. Function exceeds block gas limit\n4. Contract becomes unusable",
          prevention: [
            "Implement pagination for large arrays",
            "Use pull-over-push pattern",
            "Set explicit limits on array sizes",
          ],
        },
        "front-running": {
          title: "Front-Running / MEV",
          description:
            "Transactions in the mempool are visible. Miners/validators can reorder transactions to extract value by front-running profitable operations.",
          realWorldExample:
            "DEX trades are regularly front-run for profit (sandwich attacks).",
          attackVector:
            "1. Monitor mempool for profitable transactions\n2. Submit same transaction with higher gas\n3. Get included first, extract profit\n4. Original transaction gets worse price",
          prevention: [
            "Use commit-reveal schemes",
            "Implement slippage protection",
            "Consider using Flashbots or private mempools",
          ],
        },
      };

      return explanations[vulnerabilityType] || { error: "Unknown vulnerability type" };
    },
  },
  {
    name: "generate_fix",
    description:
      "Generate fixed code for a specific vulnerability type with before/after comparison.",
    inputSchema: z.object({
      vulnerabilityType: z
        .string()
        .describe("The type of vulnerability to fix: reentrancy, overflow, access-control, unchecked-return, or tx-origin"),
      originalCode: z
        .string()
        .optional()
        .describe("The original vulnerable code snippet"),
    }),
    outputSchema: z.object({
      title: z.string().optional(),
      originalCode: z.string().optional(),
      fixedCode: z.string().optional(),
      explanation: z.string().optional(),
      pattern: z.string().optional(),
    }),
    tool: async ({
      vulnerabilityType,
    }: {
      vulnerabilityType: string;
      originalCode?: string;
    }) => {
      const fixes: Record<string, object> = {
        reentrancy: {
          title: "Reentrancy Fix",
          originalCode: `function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
    balances[msg.sender] = 0; // State change AFTER call
}`,
          fixedCode: `function withdraw() external nonReentrant {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0; // State change BEFORE call
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Transfer failed");
}`,
          explanation:
            "Move state changes before external calls (Checks-Effects-Interactions pattern). Adding ReentrancyGuard provides additional protection.",
          pattern: "Checks-Effects-Interactions",
        },
        overflow: {
          title: "Integer Overflow Fix",
          originalCode: `pragma solidity ^0.7.0;

function addBalance(uint256 amount) external {
    balances[msg.sender] += amount; // Can overflow
}`,
          fixedCode: `pragma solidity ^0.8.0; // Built-in overflow protection

function addBalance(uint256 amount) external {
    balances[msg.sender] += amount; // Safe in 0.8+
}

// Or for older versions:
// using SafeMath for uint256;
// balances[msg.sender] = balances[msg.sender].add(amount);`,
          explanation:
            "Upgrade to Solidity 0.8.0+ for automatic overflow checks, or use SafeMath library for older versions.",
          pattern: "Safe Arithmetic",
        },
        "access-control": {
          title: "Access Control Fix",
          originalCode: `function setOwner(address _newOwner) external {
    owner = _newOwner; // Anyone can call!
}`,
          fixedCode: `modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

function setOwner(address _newOwner) external onlyOwner {
    require(_newOwner != address(0), "Invalid address");
    owner = _newOwner;
}`,
          explanation:
            "Add access control modifier and validate input. Consider using OpenZeppelin's Ownable for production.",
          pattern: "Access Control",
        },
        "unchecked-return": {
          title: "Unchecked Return Fix",
          originalCode: `function transferTokens(address to, uint amount) external {
    token.transfer(to, amount); // Return ignored!
}`,
          fixedCode: `import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

using SafeERC20 for IERC20;

function transferTokens(address to, uint amount) external {
    token.safeTransfer(to, amount); // Reverts on failure
}`,
          explanation:
            "Use OpenZeppelin's SafeERC20 which reverts on failed transfers instead of returning false.",
          pattern: "Safe External Calls",
        },
        "tx-origin": {
          title: "tx.origin Fix",
          originalCode: `function emergencyWithdraw() external {
    require(tx.origin == owner, "Not owner"); // Phishable!
    payable(owner).transfer(address(this).balance);
}`,
          fixedCode: `function emergencyWithdraw() external {
    require(msg.sender == owner, "Not owner"); // Safe
    payable(owner).transfer(address(this).balance);
}`,
          explanation:
            "Replace tx.origin with msg.sender for authentication. msg.sender is the immediate caller, preventing phishing attacks.",
          pattern: "Secure Authentication",
        },
      };

      return fixes[vulnerabilityType] || { error: "Unknown vulnerability type" };
    },
  },
];
