# Claude Code Memory - intentïon repository0

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

**You may**: create branches, commit changes, push branches, open pull requests

**You may NOT**: merge PRs, push to main, delete branches, rewrite history

**Branch naming**: `claude/<short-description>`

## Code Quality Rules

- **No unnecessary formatting** — don't reformat lines you're not changing
- **No backwards-compatible aliases** — update all callers instead
- Only run linting/formatting fixes when specifically asked

## Security Checklist

- Never commit secrets — use GitHub Actions secrets
- Never commit OpenAI API keys
