# Agentic Code Analyzer

An intelligent code analyzer that helps developers understand and improve their JavaScript/Node.js codebases using agentic intelligence.

## Features

🔍 **Comprehensive Analysis**
- Scans JavaScript, TypeScript, and JSON files
- Calculates code complexity metrics
- Tracks dependencies and imports
- Provides actionable insights

📊 **Detailed Reporting**
- File structure overview
- Complexity analysis
- Dependency mapping
- Intelligent recommendations

🚀 **Agentic Evolution**
- Designed to be enhanced by automated workflows
- Continuously evolving analysis capabilities
- Template for building intelligent developer tools

## Getting Started

### Installation

```bash
npm install
```

### Usage

Analyze the current directory:
```bash
npm start
```

Analyze a specific directory:
```bash
node src/lib/main.js ./path/to/project
```

### Example Output

```
🔍 Code Analysis Results
━━━━━━━━━━━━━━━━━━━━━━━
📊 Summary:
  • Files: 15
  • Lines: 1,247
  • Size: 45.2 KB
  • Avg Complexity: 4.2
  • Dependencies: 8

📁 File Types:
  • .js: 12
  • .json: 3

📦 Top Dependencies:
  • fs/promises: 5 uses
  • path: 3 uses

💡 Insights:
  ℹ️ Moderate complexity detected (4.2). Monitor for complexity growth.
  ⚠️ Consider organizing large codebase into clear modules.
```

## Development

### Running Tests

```bash
npm test                  # All tests
npm run test:unit         # Unit tests with coverage
```

### Project Structure

- `src/lib/main.js` - Core analyzer implementation
- `tests/unit/` - Comprehensive test suite
- `.github/workflows/` - Agentic workflow automation

## Agentic Workflows

This repository demonstrates how agentic workflows can evolve software:

1. **Enable GitHub Actions** in your repository settings
2. **Define your mission** in `MISSION.md`
3. **Let workflows evolve** `src/lib/main.js` toward your goals

The code will automatically improve through:
- Automated code reviews
- Intelligent refactoring
- Feature enhancements
- Performance optimizations

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on contributing to this agentic template.

## Links

- [Mission Statement](MISSION.md) - Project goals and vision
- [Getting Started Guide](GETTING-STARTED.md) - Detailed setup instructions
