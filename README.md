# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Hamming distance functions

This library provides two Hamming-distance utilities exported from `src/lib/main.js`:

- `hammingDistance(a, b)` — computes the Hamming distance between two strings by comparing Unicode code points (not UTF-16 code units). Both arguments must be strings and have equal length (in code points). Throws `TypeError` for non-string arguments and `RangeError` for unequal lengths.

- `hammingDistanceBits(a, b)` — computes the bit-level Hamming distance between two non-negative integer Numbers by counting differing bits. Both arguments must be integer Numbers (no fractional part) and non-negative. Throws `TypeError` for invalid types and `RangeError` for negative inputs.

Examples:

```js
import { hammingDistance, hammingDistanceBits } from "./src/lib/main.js";

console.log(hammingDistance('karolin', 'kathrin')); // 3
console.log(hammingDistance('', '')); // 0
console.log(hammingDistanceBits(1, 4)); // 2
console.log(hammingDistanceBits(0, 0)); // 0
```

Notes:
- String comparisons are done by Unicode code points so astral characters (emoji, historic scripts) are treated as single characters. Use `Array.from()` or spread to iterate code points.
- `hammingDistanceBits` converts inputs to `BigInt` internally to perform exact bitwise XOR. Very large Number inputs (beyond `Number.MAX_SAFE_INTEGER`) may already be imprecise as JavaScript Numbers; avoid relying on bit-level semantics for inexact Number representations.

## Getting Started

1. Run tests: `npm test`
2. Start the demo site (serves generated docs after build): `npm run start`

## Existing Project Info

(remaining README content preserved below)

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

The rest of this README is unchanged.
