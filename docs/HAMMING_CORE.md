# Hamming Core

This document describes the computeHamming function implemented in src/lib/main.js.

Behaviour
- computeHamming(a, b): both inputs must be strings representing sequences of user-perceived characters.
- Returns the integer Hamming distance: the number of positions where corresponding characters differ.
- For identical strings returns 0.
- For empty strings returns 0.
- If either input is not a string, a TypeError is thrown with the exact message: "Inputs must be strings".
- If inputs have unequal length (measured in user-perceived characters), a RangeError is thrown with the exact message: "Inputs must have same length".

Unicode handling
- The function prefers to measure length in user-perceived characters (grapheme clusters).
- When the runtime provides Intl.Segmenter, it is used with granularity: 'grapheme' to correctly iterate emoji sequences and other grapheme clusters.
- If Intl.Segmenter is not available or fails, the function falls back to Array.from(str), which iterates by Unicode code points. This is a reasonable fallback but may treat some grapheme sequences as multiple units on older runtimes.

Examples
- computeHamming('karolin', 'kathrin') => 3
- computeHamming('1011101','1001001') => 2
- computeHamming('','') => 0
- computeHamming('a','a') => 0
- computeHamming('a','b') => 1
- computeHamming('👩‍👩‍👧', '👩‍👩‍👦') => 1  (when Intl.Segmenter is available)

Notes
- The decision to prefer Intl.Segmenter ensures correct behaviour for user-perceived characters; the fallback keeps the function usable in environments without the API.
- See src/lib/main.js for the implementation details.
