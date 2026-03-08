# repository0 — Hamming Distance

This repository implements a small JavaScript library providing a Hamming distance function.

Features:
- hamming(a, b): compute Hamming distance for strings (by code unit) or Uint8Array/ArrayBuffer views.

Usage:

Node:

import { hamming } from './src/lib/main.js';
console.log(hamming('karolin','kathrin'));

Browser:
- Build and open the demo: npm run build:web then open docs/index.html

See docs/HAMMING.md for more details.
