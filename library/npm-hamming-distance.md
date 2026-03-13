Title: npm: hamming-distance

Summary

`hamming-distance` is a small npm package that calculates the Hamming distance between two hex strings or two Buffers.

Package metadata

- Name: hamming-distance
- Latest version: 1.0.0
- Description: Calculate the hamming distance of two hex strings or buffers
- License: MIT
- Repository: https://github.com/math-utils/hamming-distance
- Homepage: https://github.com/math-utils/hamming-distance

Install

npm install hamming-distance

Usage

```js
const compare = require('hamming-distance');

// compare two Buffers containing hexadecimal data
const distance = compare(Buffer.from('0000', 'hex'), Buffer.from('000F', 'hex'));
// distance is an integer (number of differing bits/positions)
```

Notes

- The package accepts Buffers or hex strings (see upstream README) and returns a numeric Hamming distance.
- Source and issues are on GitHub: https://github.com/math-utils/hamming-distance

Sources

- npm registry: https://registry.npmjs.org/hamming-distance
- GitHub repository: https://github.com/math-utils/hamming-distance
