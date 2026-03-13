Title: npm: hamming-distance

Summary

`hamming-distance` is a small npm package that calculates the Hamming distance between two hex strings or two Buffers.

Package metadata (summary)

- Name: hamming-distance
- Description: Calculate the hamming distance of two hex strings or buffers
- License: MIT
- Repository: https://github.com/math-utils/hamming-distance

Install

npm install hamming-distance

Usage

const compare = require('hamming-distance');

// compare two Buffers containing hexadecimal data
const distance = compare(Buffer.from('0000', 'hex'), Buffer.from('000F', 'hex'));
// distance is an integer (number of differing bits/positions)

Notes

- The package accepts Buffers or hex strings and returns a numeric Hamming distance.
- Source and issues are on GitHub: https://github.com/math-utils/hamming-distance

Source: https://www.npmjs.com/package/hamming-distance (package registry) and repository README
