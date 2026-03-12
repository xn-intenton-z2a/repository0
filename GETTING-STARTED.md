# Getting Started with intentïon

Three steps to autonomous code evolution. No OpenAI key required.

## Step 1: Create Your Repository

Click **"Use this template"** on the [repository0](https://github.com/xn-intenton-z2a/repository0) page, or use the GitHub CLI:

```bash
gh repo create my-project --template xn-intenton-z2a/repository0 --public --clone
cd my-project
```

## Step 2: Write Your Mission

Edit `MISSION.md` to describe what you want to build. Be specific about features, technical requirements, and quality expectations. The agent reads this file to understand your project goals.

### Option A: Use a built-in graded mission

agentic-lib ships with 18 built-in missions, graded using [Codewars kyu/dan](https://docs.codewars.com/concepts/kata/) difficulty and [Bloom's taxonomy](https://en.wikipedia.org/wiki/Bloom%27s_taxonomy) cognitive type. To start with one, use `init --purge --mission`:

```bash
npx @xn-intenton-z2a/agentic-lib init --purge --mission 7-kyu-understand-fizz-buzz
```

Built-in missions (easiest to hardest):

| Mission | Kyu/Dan | Bloom's | Description |
|---------|---------|---------|-------------|
| `8-kyu-remember-empty` | 8 kyu | Remember | Blank template |
| `8-kyu-remember-hello-world` | 8 kyu | Remember | Hello World |
| `7-kyu-understand-fizz-buzz` | 7 kyu | Understand | Classic FizzBuzz |
| `6-kyu-understand-hamming-distance` | 6 kyu | Understand | Hamming distance (strings + bits) |
| `6-kyu-understand-roman-numerals` | 6 kyu | Understand | Roman numeral conversion |
| `5-kyu-create-ascii-face` | 5 kyu | Create | ASCII face art |
| `5-kyu-apply-string-utils` | 5 kyu | Apply | 10 string utility functions |
| `4-kyu-apply-cron-engine` | 4 kyu | Apply | Cron expression parser |
| `4-kyu-apply-dense-encoding` | 4 kyu | Apply | Dense binary encoding |
| `4-kyu-analyze-json-schema-diff` | 4 kyu | Analyze | JSON Schema diff |
| `3-kyu-analyze-lunar-lander` | 3 kyu | Analyze | Lunar lander simulation |
| `3-kyu-evaluate-time-series-lab` | 3 kyu | Evaluate | Time series analysis |
| `3-kyu-evaluate-owl-ontology` | 3 kyu | Evaluate | OWL ontology processor |
| `2-kyu-evaluate-markdown-compiler` | 2 kyu | Evaluate | Markdown compiler |
| `2-kyu-create-plot-code-lib` | 2 kyu | Create | Code visualization library |
| `1-kyu-create-ray-tracer` | 1 kyu | Create | Ray tracer |
| `1-dan-create-c64-emulator` | 1 dan | Create | C64 emulator |
| `2-dan-create-agi` | 2 dan | Create | AGI vision |

List all available missions:

```bash
npx @xn-intenton-z2a/agentic-lib iterate --list-missions
```

### Option B: Write your own mission

Example:

```markdown
# Mission

Build a CLI tool that converts CSV files to formatted Markdown tables.

## Features
- Read CSV from file or stdin
- Auto-detect delimiter (comma, tab, semicolon)
- Align columns by content type (left for text, right for numbers)
- Support --output flag to write to file

## Technical Requirements
- Pure Node.js, no external dependencies
- ESM modules
- Comprehensive unit tests
```

Commit and push your mission:

```bash
git add MISSION.md
git commit -m "Set project mission"
git push
```

## Step 3: Enable GitHub Copilot

The workflows use the GitHub Copilot SDK (via the `agentic-step` action) to generate code. Ensure your repository has access:

1. Go to your repository **Settings > Actions > General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Go to the **Actions** tab and enable the workflows (GitHub disables scheduled workflows on new repos from templates)
4. Ensure your GitHub account or organization has a **GitHub Copilot** subscription

That is it. The workflows will begin running on their schedule, reading your mission, creating issues, writing code, and opening pull requests.

## What Happens Next

The agentic pipeline runs in cycles:

```
MISSION.md
  -> Issues created from mission goals
  -> Code generated on branches
  -> Tests run automatically
  -> PRs opened for review
  -> Automerge on passing checks
  -> Next issue picked up
```

Activity is logged to `intentïon.md` in your repository root.

## Configuration

Fine-tune the agent behavior in `.github/agentic-lib/agents/agentic-lib.yml`:

| Setting | Default | Purpose |
|---------|---------|---------|
| `featureDevelopmentIssuesWipLimit` | 2 | Max concurrent feature issues |
| `maintenanceIssuesWipLimit` | 1 | Max concurrent maintenance issues |
| `attemptsPerBranch` | 2 | Retries per branch before giving up |
| `attemptsPerIssue` | 1 | Retries per issue before giving up |
| `tdd` | false | Require tests before implementation |

Edit `CONTRIBUTING.md` to set coding guidelines the agent must follow.

## Links

- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) -- the core SDK
- [API Reference](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/API.md) -- agentic-step action documentation
- [Demo](https://github.com/xn-intenton-z2a/agentic-lib/blob/main/DEMO.md) -- run the demo script
