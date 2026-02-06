# ChainScope AI

**AI-Powered Smart Contract Security Auditor**

Paste code. Get streaming security verdicts. Fix vulnerabilities in conversation.

![ChainScope AI](https://img.shields.io/badge/Built%20with-Tambo-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Overview

ChainScope AI transforms smart contract security auditing into an interactive, conversational experience. Using Tambo's generative UI capabilities, the AI streams beautiful, animated security findings as you chat — vulnerability cards appear one-by-one, an animated security score meter updates in real-time, and code diffs show exactly how to fix issues.

### ✨ New UI Features

- **Sidebar Dashboard Layout**: Clean 2-column design with dedicated input panel and results area
- **Premium Animations**: Staggered entrance animations with blur, scale, and fade effects
- **Smooth Scrolling**: Hidden scrollbar with maintained scroll functionality
- **Synchronized Line Numbers**: Code editor with perfectly aligned line numbers that scroll in sync
- **Polished Borders**: Seamless border continuity between header and sidebar
- **Interactive Elements**: Hover effects on feature badges and buttons

## Features

### Core Functionality
- **Streaming Security Verdicts**: Vulnerabilities appear progressively with severity-coded cards
- **Animated Security Score**: Watch your score update as issues are discovered
- **Interactive Code Diffs**: See vulnerable vs. fixed code side-by-side
- **Conversational Fixes**: Ask follow-up questions, get contextual explanations
- **Suggested Actions**: One-click to explain, fix, or audit another contract

### UI/UX Excellence
- **Aceternity-Inspired Animations**: Premium entrance effects with spring easing
- **Responsive Design**: Optimized for desktop with mobile bottom sheet (coming soon)
- **Dark Mode First**: Beautiful dark theme with aurora background effects
- **Glass Morphism**: Subtle backdrop blur and transparency effects
- **Micro-interactions**: Smooth hover states and transitions throughout

## Tambo Features Used

- ✅ **Streaming UI** - Findings appear progressively
- ✅ **Stateful Components** - Score updates across conversation
- ✅ **Zod-Registered Components** - 7 custom components with full schema validation
- ✅ **Suggested Actions** - Context-aware follow-ups
- ✅ **Tool Calling** - `analyze_contract`, `explain_vulnerability`, `generate_fix`

## Tech Stack

- **Next.js 16** - App Router with TypeScript
- **Tambo SDK** - Generative UI streaming
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Prism React Renderer** - Syntax highlighting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Tambo API key ([Get one here](https://tambo.co))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chainscope-ai.git
cd chainscope-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Tambo API key to .env.local
# NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
chainscope-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Main dashboard with 2-column layout
│   │   ├── layout.tsx          # Root layout with Tambo provider
│   │   └── globals.css         # Global styles and animations
│   ├── components/
│   │   ├── tambo/              # Tambo-registered components
│   │   │   ├── VulnerabilityCard.tsx
│   │   │   ├── SecurityScoreMeter.tsx
│   │   │   ├── CodeDiffViewer.tsx
│   │   │   ├── AuditSummaryCard.tsx
│   │   │   ├── FixSuggestionCard.tsx
│   │   │   ├── ScanningIndicator.tsx
│   │   │   └── SafeContractCard.tsx
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── CodeEditor.tsx  # Syntax-highlighted code input
│   │   │   └── SuggestedActions.tsx
│   │   ├── chat/               # Chat interface
│   │   │   ├── ChatInterface.tsx    # Sidebar input panel
│   │   │   └── MessageDisplay.tsx   # Main content area
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx      # Top header with logo & score
│   │       └── Sidebar.tsx     # Left sidebar wrapper
│   ├── lib/
│   │   ├── tambo/              # Tambo registry and tools
│   │   │   ├── provider.tsx    # Tambo provider setup
│   │   │   └── registry.tsx    # Component registration
│   │   └── audit/              # Vulnerability patterns
│   └── types/                  # TypeScript types
└── public/                     # Static assets
    └── logo.svg                # ChainScope AI logo
```

## Vulnerability Detection

ChainScope AI detects common smart contract vulnerabilities:

| Vulnerability | Severity | Description |
|---------------|----------|-------------|
| Reentrancy | Critical | External call before state update |
| Missing Access Control | Critical | No ownership check on sensitive functions |
| tx.origin Auth | High | Phishing-vulnerable authentication |
| Integer Overflow | High | Solidity < 0.8 without SafeMath |
| Unchecked Returns | Medium | Ignored transfer return values |
| Unbounded Loops | Medium | DoS via gas exhaustion |
| Block Property Deps | Low | Reliance on block.timestamp/number |

## Sample Contracts

The app includes sample vulnerable contracts for testing:

```solidity
// VulnerableVault.sol - Contains reentrancy, access control, and overflow issues
contract VulnerableVault {
    function withdraw() external {
        uint256 amount = balances[msg.sender];
        (bool success, ) = msg.sender.call{value: amount}("");
        balances[msg.sender] = 0; // State change AFTER call!
    }
}
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables

```env
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Built with [Tambo](https://tambo.co) - Generative UI SDK
- Inspired by professional smart contract auditing tools
- Security patterns from [SWC Registry](https://swcregistry.io/)

---

**Built for "The UI Strikes Back" Hackathon (WeMakeDevs × Tambo AI)**

Created by Omkar
