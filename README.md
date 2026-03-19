# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Getting Started

1. **Write your mission** in [`MISSION.md`](MISSION.md) — describe what you want to build in plain English
2. **Configure GitHub** — see [Setup](#setup) below
3. **Push to main** — the autonomous workflows take over from here

The system will create issues from your mission, generate code to resolve them, run tests, and open PRs. A supervisor agent orchestrates the pipeline, and you can interact through GitHub Discussions.

## UUID encoding comparison

The library includes several binary-to-text encodings. Here are typical encoded lengths for a 128-bit UUID:

| Encoding | Length (chars) |
|----------|----------------|
| hex (lowercase) | 32 |
| base64 (URL-safe, no padding) | 22 |
| base62 | 22 |
| base85 (Z85) | 20 |
| base91 | 20 |
| denser (printable ASCII excluding ambiguous chars) | 20 |

These are typical lengths based on 128 bits and the entropy per character of each alphabet; the library ships built-in: base62, base85 (Z85), base91, and a denser printable-ASCII alphabet.

## Setup

### Required Secrets

Add these in your repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | How to create | Purpose |
|--------|---------------|---------|
| `COPILOT_GITHUB_TOKEN` | [Fine-grained PAT](https://github.com/settings/tokens?type=beta) with **GitHub Copilot** → Read permission | Authenticates with the Copilot SDK for all agentic tasks |
| `WORKFLOW_TOKEN` | [Classic PAT](https://github.com/settings/tokens) with **workflow** scope | Allows `init.yml` to update workflow files (GITHUB_TOKEN cannot modify `.github/workflows/`) |

(remaining content unchanged)
