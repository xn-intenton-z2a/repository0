# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Getting Started

1. **Write your mission** in [`MISSION.md`](MISSION.md) — describe what you want to build in plain English
2. **Configure GitHub** — see [Setup](#setup) below
3. **Push to main** — the autonomous workflows take over from here

The system will create issues from your mission, generate code to resolve them, run tests, and open PRs. A supervisor agent orchestrates the pipeline, and you can interact through GitHub Discussions.

## Hamming distance API

This repository provides two Hamming distance functions exported from `src/lib/main.js`.

- `hammingDistanceString(a, b)` — computes the Hamming distance between two strings of equal length, comparing Unicode code points.
  - Throws `TypeError` if either argument is not a string.
  - Throws `RangeError` if the strings have different lengths in code points.
  - Example:
    - `hammingDistanceString("karolin", "kathrin") // => 3`
    - `hammingDistanceString("", "") // => 0`

- `hammingDistanceInt(a, b)` — computes the bit-level Hamming distance between two non-negative integers.
  - Throws `TypeError` if either argument is not an integer Number.
  - Throws `RangeError` if an argument is negative.
  - Uses `BigInt` internally to compute differing bits; results are correct for integer values within JavaScript's Number precision range.
  - Example:
    - `hammingDistanceInt(1, 4) // => 2` (binary: 001 vs 100)
    - `hammingDistanceInt(0, 0) // => 0`

Usage (Node):

```js
import { hammingDistanceString, hammingDistanceInt } from './src/lib/main.js';

console.log(hammingDistanceString('karolin', 'kathrin')); // 3
console.log(hammingDistanceInt(1, 4)); // 2
```

Usage (browser):

The website at `src/web/index.html` imports `src/web/lib.js` which re-exports the library for demo purposes. The page displays the library identity and a small Hamming demo.

## Setup

Follow the instructions in the repository root to run tests and view the demo locally.

## Tests

- Unit tests: `npm test` (runs Vitest unit tests in `tests/unit/`)
- Behaviour tests: `npm run test:behaviour` (runs Playwright tests in `tests/behaviour/`)

## See Also

- `MISSION.md` — the project mission
- `features/HAMMING_DISTANCE.md` — background and references

