# repository0

A small JavaScript library for computing Hamming distances between strings and non-negative integers.

## Installation

This repository is a template; use the source directly or install as a package when published.

## API

Exports (named):
- name, version, description, getIdentity()
- hammingDistanceStrings(a, b)
- hammingDistanceBits(x, y)

### hammingDistanceStrings(a, b)
- Computes Hamming distance between two strings by comparing Unicode code points.
- Throws TypeError when arguments are not strings.
- Throws RangeError when strings differ in length (in code points).

Example:

```js
import { hammingDistanceStrings } from './src/lib/main.js';
console.log(hammingDistanceStrings('karolin', 'kathrin'));
// 3
```

Unicode note: comparisons are performed on Unicode code points (Array.from), not UTF-16 code units; surrogate pairs (emoji) count as a single code point.

### hammingDistanceBits(x, y)
- Computes bit-level Hamming distance between two non-negative integers.
- Accepts Number or BigInt inputs.
- Throws TypeError for non-integer arguments.
- Throws RangeError for negative integers.

Example:

```js
import { hammingDistanceBits } from './src/lib/main.js';
console.log(hammingDistanceBits(1, 4));
// 2
```

## Website

Open `src/web/index.html` to see a live demo that imports the library. The demo shows example comparisons and a JSON output under the "Live Demo Output" section.

## Tests

Run unit tests with:

```
npm test
```

Run behaviour (E2E) tests with Playwright:

```
npm run test:behaviour
```

## Mission

See MISSION.md for goals and acceptance criteria.
