# `repository0`

A template for autonomous code evolution. Create from this template, write your mission, and watch the code evolve.

## Quick Start

1. Click **"Use this template"** above (or `gh repo create my-project --template xn-intenton-z2a/repository0 --public`)
2. Edit `MISSION.md` with your project goals
3. Enable GitHub Copilot and activate the workflows in the Actions tab

The agentic workflows will begin generating issues, writing code, running tests, and opening pull requests based on your mission. No OpenAI API key required -- the system uses the GitHub Copilot SDK.

See the [Getting Started Guide](GETTING-STARTED.md) for detailed setup instructions.

## What's Included

- **Agentic workflows** in `.github/workflows/` -- the full autonomous pipeline (seed, develop, fix, review, merge)
- **Agent configuration** in `.github/agentic-lib/agents/agentic-lib.yml` -- path permissions, WIP limits, attempt limits
- **Safety controls** -- writable/read-only path separation, mission protection, TDD mode support
- **Seed files** in `.github/seeds/` -- reset points for the agent to start fresh
- **Feature definitions** in `.github/features/` -- generated and maintained by the agent
- **Clean starting point** -- `src/lib/main.js` with Hello World, ready for the agent to evolve

## How It Works

```
MISSION.md -> Issues -> Code -> Tests -> PRs -> Merge -> Repeat
```

Activity is logged to `intentïon.md` in the repository root.

## Configuration

Edit `.github/agentic-lib/agents/agentic-lib.yml` to tune the agent:

| Setting | Default | Purpose |
|---------|---------|---------|
| `featureDevelopmentIssuesWipLimit` | 2 | Max concurrent feature issues |
| `attemptsPerBranch` | 2 | Retries per branch |
| `tdd` | false | Require tests before implementation |

Edit `CONTRIBUTING.md` to set coding guidelines the agent follows.

## Links

- [MISSION.md](MISSION.md) -- project goals
- [CONTRIBUTING.md](CONTRIBUTING.md) -- contributor guidelines (for humans and agents)
- [GETTING-STARTED.md](GETTING-STARTED.md) -- setup instructions
- [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) -- the core SDK powering these workflows
- [LICENSE](LICENSE) -- MIT
