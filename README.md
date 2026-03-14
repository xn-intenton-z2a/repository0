# repo

This repository is powered by [intentïon agentic-lib](https://github.com/xn-intenton-z2a/agentic-lib) — autonomous code transformation driven by GitHub Copilot. Write a mission, and the system generates issues, writes code, runs tests, and opens pull requests on a schedule.

## Hamming distance: computeHamming

A Unicode-aware Hamming distance implementation is provided as computeHamming(a, b) exported from src/lib/main.js.

- Throws TypeError("Inputs must be strings") for non-string inputs.
- Throws RangeError("Inputs must have same length") when inputs differ in length (measured in user-perceived characters when supported by the environment).
- Uses Intl.Segmenter with granularity 'grapheme' when available and falls back to Array.from otherwise.

Example:

import { computeHamming } from './src/lib/main.js';
console.log(computeHamming('karolin', 'kathrin')); // 3

Browser demo
- Open src/web/index.html to try the interactive demo. The page includes two inputs and a Compute button (ids: input-a, input-b, compute-hamming) and shows results in #hamming-result.

Rest of repository documentation remains below.

(Original README content continues...)
