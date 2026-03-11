# Hamming Distance Library

A JavaScript library for calculating Hamming distances between strings and integers.

## Installation

```bash
npm install @xn-intenton-z2a/repository0
```

## Usage

### String Hamming Distance

Calculate the Hamming distance between two strings of equal length:

```javascript
import { hammingDistance } from '@xn-intenton-z2a/repository0';

// Basic usage
console.log(hammingDistance('karolin', 'kathrin')); // → 3

// Empty strings
console.log(hammingDistance('', '')); // → 0

// Identical strings
console.log(hammingDistance('hello', 'hello')); // → 0

// Unicode support
console.log(hammingDistance('café', 'care')); // → 2
console.log(hammingDistance('😀😁', '😀😂')); // → 1
```

### Bit Hamming Distance

Calculate the Hamming distance between two non-negative integers:

```javascript
import { hammingDistanceBits } from '@xn-intenton-z2a/repository0';

// Basic usage
console.log(hammingDistanceBits(1, 4)); // → 2 (binary: 001 vs 100)

// Same numbers
console.log(hammingDistanceBits(0, 0)); // → 0

// Larger numbers
console.log(hammingDistanceBits(15, 0)); // → 4 (binary: 1111 vs 0000)
```

### Library Identity

Get information about the library:

```javascript
import { getIdentity, name, version } from '@xn-intenton-z2a/repository0';

console.log(name);         // Library name
console.log(version);      // Library version
console.log(getIdentity()); // Complete identity object
```

## API Reference

### `hammingDistance(a, b)`

Computes the Hamming distance between two strings.

**Parameters:**
- `a` (string): First string
- `b` (string): Second string

**Returns:** `number` - The number of positions where characters differ

**Throws:**
- `TypeError`: If either argument is not a string
- `RangeError`: If strings have different lengths

**Features:**
- Unicode support (compares code points, not UTF-16 code units)
- Handles emojis and complex characters correctly
- Zero-length string support

### `hammingDistanceBits(x, y)`

Computes the Hamming distance between two integers.

**Parameters:**
- `x` (number): First non-negative integer
- `y` (number): Second non-negative integer

**Returns:** `number` - The number of differing bits

**Throws:**
- `TypeError`: If either argument is not an integer
- `RangeError`: If either argument is negative or not a safe integer

**Features:**
- Works with integers up to `Number.MAX_SAFE_INTEGER`
- Efficient bitwise implementation
- Handles zero and large numbers correctly

## Error Handling

All functions provide detailed error messages:

```javascript
try {
  hammingDistance('abc', 'abcd');
} catch (error) {
  console.log(error.message); // "Strings must have equal length"
}

try {
  hammingDistanceBits(-1, 5);
} catch (error) {
  console.log(error.message); // "First argument must be non-negative"
}
```

## Web Demo

Visit the [interactive demo](https://xn-intenton-z2a.github.io/repository0/) to try the functions in your browser.

## Examples

### Real-world Applications

**DNA Sequence Comparison:**
```javascript
const sequence1 = 'ATCGATCG';
const sequence2 = 'ATCAATCG';
console.log(hammingDistance(sequence1, sequence2)); // → 1
```

**Error Detection in Data Transmission:**
```javascript
const original = 0b11010110;
const received = 0b11110110;
console.log(hammingDistanceBits(original, received)); // → 1
```

**Password Similarity:**
```javascript
function passwordSimilarity(pwd1, pwd2) {
  if (pwd1.length !== pwd2.length) return 'Different lengths';
  const distance = hammingDistance(pwd1, pwd2);
  return `${distance} character(s) different`;
}
```

## Development

```bash
# Install dependencies
npm ci

# Run tests
npm test

# Run behavior tests
npm run test:behaviour

# Build web demo
npm run build:web

# Start local server
npm start
```

## License

MIT

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

## File Layout

```
src/lib/main.js              ← library (Node entry point: identity + mission functions)
src/web/index.html            ← web page (browser: imports lib-meta.js, demonstrates library)
tests/unit/main.test.js       ← unit tests (import main.js directly, test API-level detail)
tests/unit/web.test.js        ← web structure tests (read index.html as text, verify wiring)
tests/behaviour/              ← Playwright E2E (run page in browser, import main.js for coupling)
docs/                         ← build output (generated by npm run build:web)
docs/lib-meta.js              ← generated: exports name, version, description from package.json
```

These files form a **coupled unit**. Changes to the library must flow through to the web page, and tests verify this coupling:

- `src/lib/main.js` exports `getIdentity()` → returns `{ name, version, description }` from `package.json`
- `npm run build:web` copies `src/web/*` to `docs/` and generates `docs/lib-meta.js` from `package.json`
- `src/web/index.html` imports `lib-meta.js` at runtime → displays library identity on the page
- The behaviour test imports `getIdentity()` from `main.js` AND reads `#lib-version` from the rendered page → asserts they match

This coupling test proves the web page is consuming the real library via the build pipeline. Mission-specific functions should follow the same path — never duplicate library logic inline in the web page.

## Test Strategy

| Test layer | What it tests | How it binds |
|------------|--------------|--------------|
| **Unit tests** (`tests/unit/main.test.js`) | Library API: return values, error types, edge cases | Imports directly from `src/lib/main.js` |
| **Web structure tests** (`tests/unit/web.test.js`) | HTML structure: expected elements, `lib-meta.js` import | Reads `src/web/index.html` as text |
| **Behaviour tests** (`tests/behaviour/`) | End-to-end: page renders, interactive elements work | Playwright loads the built site; coupling test imports `getIdentity()` from `main.js` and asserts the page displays the same version |

The **coupling test** in the behaviour test is the key invariant: it proves the web page displays values from the actual library, not hardcoded or duplicated values. If the build pipeline breaks, this test fails.

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
max-feature-issues = 2      # max concurrent feature issues
max-attempts-per-issue = 2   # max retries per issue
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
