# STRING_HAMMING

Summary
Compute the Hamming distance between two strings of equal length by comparing Unicode code points (not UTF-16 code units). This is the core string-level operation required by the mission.

Motivation
Accurate string Hamming distances must treat each user-perceived character as a single position. Libraries that compare UTF-16 code units split surrogate pairs and report incorrect distances for emoji and other astral-plane characters.

Specification
- Public API: named export hammingString(a, b)
- Inputs: both a and b must be strings; otherwise throw TypeError.
- Comparison model: compare sequences of Unicode code points. If the number of code points differs, throw RangeError.
- Result: return the count of positions at which corresponding code points differ (non-negative integer).
- Edge cases: empty strings return 0, identical strings return 0.

API contract
hammingString(a, b) -> number

Acceptance criteria
- Hamming distance between "karolin" and "kathrin" is 3
- Hamming distance between "" and "" is 0
- Comparing "a😊b" and "a😢b" returns 1 (emoji count as single code points)
- Passing two strings with unequal code point lengths throws RangeError
- Passing non-string arguments throws TypeError

Notes
Implementations should iterate over code points (for-of or Array.from) rather than using string indexing or length on UTF-16 code units.