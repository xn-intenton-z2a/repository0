# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Getting Started

1. **Write your mission** in [`MISSION.md`](MISSION.md) — describe what you want to build in plain English
2. **Configure GitHub** — see [Setup](#setup) below
3. **Push to main** — the autonomous workflows take over from here

The system will create issues from your mission, generate code to resolve them, run tests, and open PRs. A supervisor agent orchestrates the pipeline, and you can interact through GitHub Discussions.

## Setup

### Required Secrets

Add these in your repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | How to create | Purpose |
|--------|---------------|---------|
| `COPILOT_GITHUB_TOKEN` | [Fine-grained PAT](https://github.com/settings/tokens?type=beta) with **GitHub Copilot** → Read permission | Authenticates with the Copilot SDK for all agentic tasks |
| `WORKFLOW_TOKEN` | [Classic PAT](https://github.com/settings/tokens) with **workflow** scope | Allows `init.yml` to update workflow files (GITHUB_TOKEN cannot modify `.github/workflows/`) |

### Repository Settings

| Setting | Where | Value |
|---------|-------|-------|
| GitHub Actions | Settings → Actions → General | Allow all actions |
| Workflow permissions | Settings → Actions → General | Read and write permissions |
| Allow GitHub Actions to create PRs | Settings → Actions → General | Checked |
| GitHub Discussions | Settings → General → Features | Enabled (for the discussions bot) |

### Optional: Branch Protection

For production repositories, consider adding branch protection on `main`:
- Require pull request reviews before merging
- Require status checks to pass (select the `test` workflow)

## How It Works

```
MISSION.md → [supervisor] → dispatch workflows → Issue → Code → Test → PR → Merge
                                                    ↑                          |
                                                    +——————————————————————————+
```

The pipeline runs as GitHub Actions workflows. An LLM supervisor gathers repository context (issues, PRs, workflow runs, features) and strategically dispatches other workflows. Each workflow uses the Copilot SDK to make targeted changes.

## Configuration

Edit `agentic-lib.toml` to tune the system:

```toml
[schedule]
supervisor = "daily"    # off | weekly | daily | hourly | continuous

[paths]
mission = "MISSION.md"
source = "src/lib/"
tests = "tests/unit/"

[limits]
feature-issues = 2      # max concurrent feature issues
attempts-per-issue = 2   # max retries per issue
```

## Updating

The `init.yml` workflow runs daily and updates the agentic infrastructure automatically. To update manually:

```bash
npx @xn-intenton-z2a/agentic-lib@latest init
```

## Links

- [MISSION.md](MISSION.md) — your project goals
- [agentic-lib documentation](https://github.com/xn-intenton-z2a/agentic-lib) — full SDK docs
- [intentïon website](https://xn--intenton-z2a.com)
