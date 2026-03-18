# STRING_HAMMING

Purpose
Specify the hammingString API and behaviour for Unicode-aware comparisons measured in Unicode code points.

Specification
- Provide a named export called hammingString that accepts two JavaScript strings and returns a non-negative integer equal to the number of code point positions that differ.

Behavior
- Both inputs must be strings. If either is not a string, hammingString must throw TypeError.
- To iterate Unicode code points correctly use an iterator such as Array.from(string) so surrogate pairs count as a single code point.
- If the two code point sequences have different lengths, hammingString must throw RangeError.
- Iterate corresponding code points and count positions where the code points are not strictly equal; return that count as a Number.

Notes on normalization
- The library compares code points as they are provided; canonical normalization (NFC) is out of scope for the library core but may be performed by callers when required by higher-level applications.

Acceptance criteria (testable)
- hammingString("karolin", "kathrin") returns 3.
- hammingString("", "") returns 0.
- Passing strings whose code point lengths differ results in a RangeError.
- Surrogate pairs and astral code points are treated as single code points: a string containing a single emoji between two characters compares as length 3 in code points and differences are counted per code point.
- Passing non-string arguments causes TypeError.
