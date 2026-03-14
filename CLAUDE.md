# Claude Code Memory - intentïon repository0

> **DO NOT USE `cd <dir> && git ...` — USE `git -C <dir> ...` ALWAYS.**
> This is a multi-repo workspace. Each subdirectory is its own git repo.
> Using `cd` in compound commands triggers security prompts every time.
> This applies to YOU and to ANY AGENT YOU SPAWN. Never use the Agent tool
> for simple file reads or git operations in subdirectories either.

## Context Survival (CRITICAL — read this first after every compaction)

**After compaction or at session start:**
1. Read all `PLAN_*.md` files in the project root — these are the active goals
2. Run `TaskList` to see tracked tasks with status
3. Do NOT start new work without checking these first

**During work:**
- When the user gives a new requirement, add it to the relevant `PLAN_*.md` or create a new one
- Track all user goals as Tasks with status (pending → in_progress → completed)
- Update `PLAN_*.md` with progress before context gets large

**PLAN file pattern:**
- Active plans live at project root: `PLAN_<DESCRIPTION>.md`
- Each plan has user assertions verbatim at the top (non-negotiable requirements)
- If no plan file exists for the current work, create one before starting
- Never nest plans in subdirectories — always project root

**Anti-patterns to avoid:**
- Do NOT drift to side issues when a plan file defines the priority
- Do NOT silently fail and move on — throw, don't skip
- Do NOT ask obvious questions — read the plan file

## What This Repository Is

A **template repository** that demonstrates the agentic-lib workflows. Starting point for new agentic projects. The code in `src/lib/main.js` is the focus of the workflow and is modified by the workflow to deliver project goals.

- **Package**: `@xn-intenton-z2a/repository0`
- **Organisation**: `xn-intenton-z2a`
- **License**: MIT
- **Entry point**: `src/lib/main.js`

## What This Repository Is NOT

- Not a production application — it's a template and demonstration
- The code is intentionally evolved by automated workflows

## Key Architecture

- GitHub workflows in `.github/workflows/` consume reusable workflows from `agentic-lib`
- `src/lib/main.js` — main functionality, modified by the agentic workflow
- `tests/unit/` — unit tests to keep the main script from drifting

## Distributed Files (CRITICAL — fix at source, not here)

All files in this repo except user content are **distributed from `agentic-lib`** via `npx @xn-intenton-z2a/agentic-lib init --purge`. Fixing them locally will be overwritten on the next init run. Fix bugs in `agentic-lib/src/` instead.

### Workflows → `.github/workflows/`

Source: `agentic-lib/.github/workflows/agentic-lib-*.yml` (transformed via `#@dist` markers)

| Distributed file | Source in agentic-lib |
|------------------|-----------------------|
| `agentic-lib-bot.yml` | `.github/workflows/agentic-lib-bot.yml` |
| `agentic-lib-init.yml` | `.github/workflows/agentic-lib-init.yml` |
| `agentic-lib-schedule.yml` | `.github/workflows/agentic-lib-schedule.yml` |
| `agentic-lib-test.yml` | `.github/workflows/agentic-lib-test.yml` |
| `agentic-lib-update.yml` | `.github/workflows/agentic-lib-update.yml` |
| `agentic-lib-workflow.yml` | `.github/workflows/agentic-lib-workflow.yml` |

### Actions → `.github/agentic-lib/actions/`

Source: `agentic-lib/src/actions/*/` (full directory copy, excluding node_modules)

| Distributed action | Source in agentic-lib |
|--------------------|-----------------------|
| `agentic-step/` | `src/actions/agentic-step/` |
| `commit-if-changed/` | `src/actions/commit-if-changed/` |
| `setup-npmrc/` | `src/actions/setup-npmrc/` |

### Agents → `.github/agentic-lib/agents/`

Source: `agentic-lib/src/agents/*` (all files copied)

### Seeds → `.github/agentic-lib/seeds/`

Source: `agentic-lib/src/seeds/*` (zero-state files + `missions/` subdirectory)

### Scripts → `.github/agentic-lib/scripts/`

Source: `agentic-lib/src/scripts/` (selected files only)

Distributed: `accept-release.sh`, `activate-schedule.sh`, `build-web.cjs`, `clean.sh`, `initialise.sh`, `md-to-html.js`, `push-to-logs.sh`, `update.sh`

### Seed files (purge only) → project root

On `--purge`, these seed files overwrite project root files:

| Seed file | Target |
|-----------|--------|
| `zero-main.js` | `src/lib/main.js` |
| `zero-main.test.js` | `tests/unit/main.test.js` |
| `zero-MISSION.md` | `MISSION.md` |
| `zero-package.json` | `package.json` |
| `zero-README.md` | `README.md` |

## Related Repositories

| Repository | Relationship |
|------------|-------------|
| `agentic-lib` | Source of the reusable workflows consumed here |
| `repository0-crucible` | Fork/experiment built from this template |
| `repository0-plot-code-lib` | Fork/experiment built from this template |
| `repository0-xn--intenton-z2a.com` | Fork/experiment built from this template |

## Test Commands

```bash
npm test          # Unit tests
```

## Git Workflow

**You may**: create branches, commit changes, push branches, push to main, open pull requests

**You may NOT** (without explicit permission on a command by command basis given immediately before execution): merge PRs, delete branches, rewrite history

**Branch naming**: `claude/<short-description>`

## Code Quality Rules

- **No unnecessary formatting** — don't reformat lines you're not changing
- **No backwards-compatible aliases** — update all callers instead
- Only run linting/formatting fixes when specifically asked

## Security Checklist

- Never commit secrets — use GitHub Actions secrets
- Never commit API keys or tokens
