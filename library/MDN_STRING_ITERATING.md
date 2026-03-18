MDN_STRING_ITERATING

Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings
Retrieved: 2026-03-18
Bytes fetched (approx): 198.7 KB

Table of contents:
1. String length vs code point count
2. Iteration methods
3. Converting string to code point array
4. When to normalize
5. Practical comparison patterns for Hamming distance
6. Reference details
7. Detailed digest and attribution
8. Spec-aligned iterator algorithm

1. String length vs code point count
- string.length reports UTF-16 code unit count, not Unicode code points. Surrogate pairs count as two code units.

2. Iteration methods
- for-of iterates over Unicode code point strings (each iteration yields a user-perceived character or code point string).
- Array.from(str) and spread [...str] both produce arrays of code-point strings.
- charCodeAt and codeUnit-based indexing operate on 16-bit code units and can split surrogate pairs.

3. Converting string to code point array
- Prefer: const codePoints = Array.from(str) or [...str]
- Then length in code points: codePoints.length

4. When to normalize
- Use str.normalize('NFC') when you want canonical composition before comparison so that canonically equivalent strings compare equal by code point sequence.

5. Practical comparison patterns for Hamming distance
- Validate inputs are strings.
- Use code-point segmentation: const A = Array.from(a); const B = Array.from(b);
- If A.length !== B.length throw RangeError.
- Iterate indices and compare A[i] !== B[i], incrementing count for differences.

6. Reference details
- Use for-of, Array.from, or spread for correct Unicode-aware iteration.
- Use String.prototype.normalize when canonical equivalence matters.

7. Detailed digest
- MDN emphasizes that JS string iteration yields code points; use these helpers to avoid miscounting characters during algorithms like Hamming distance.

8. Spec-aligned iterator algorithm
- CreateStringIterator(S):
  1. Let s be ToString(S).
  2. Create a new String Iterator object O.
  3. Set O.[[IteratedString]] = s and O.[[NextIndex]] = 0.
  4. Return O.

- String Iterator.prototype.next (conceptual steps aligned with ECMA-262):
  1. Let O be this String Iterator object; if Type(O) is not Object throw TypeError.
  2. Let s be O.[[IteratedString]]. If s is undefined, return { value: undefined, done: true }.
  3. Let index = O.[[NextIndex]] and size = s.length.
  4. If index >= size: set O.[[IteratedString]] = undefined and return { value: undefined, done: true }.
  5. Let first = the UTF-16 code unit at position index.
  6. If first is a high-surrogate and index + 1 < size and the code unit at index + 1 is a low-surrogate:
     a. Let resultString = substring(s, index, index + 2).
     b. Set O.[[NextIndex]] = index + 2.
     c. Return { value: resultString, done: false }.
  7. Otherwise:
     a. Let resultString = substring(s, index, index + 1).
     b. Set O.[[NextIndex]] = index + 1.
     c. Return { value: resultString, done: false }.

- Effect: the iterator yields JavaScript strings representing single Unicode code points: either one UTF-16 code unit or a surrogate pair (two code units).

Attribution
Content condensed from MDN "String" docs (iterating over strings) (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#iterating_over_strings) and aligned to ECMA-262 string iterator steps (https://262.ecma-international.org/13.0/#sec-string.prototype-@@iterator), retrieved 2026-03-18. Data fetched ~198.7 KB (MDN) and ~1,105,333 bytes (ECMA spec HTML).
