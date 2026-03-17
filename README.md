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

Open `src/web/index.html` to see a live demo that imports the library.

## Tests

Run unit tests with:

```
npm test
```

## Mission

See MISSION.md for goals and acceptance criteria.
