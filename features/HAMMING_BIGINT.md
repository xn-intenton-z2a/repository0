# HAMMING_BIGINT

Status: MERGED — moved into HAMMING_DISTANCE.md

Summary
This feature was merged into HAMMING_DISTANCE.md and is no longer an active standalone feature file. BigInt support for integer Hamming is implemented in src/lib/main.js and covered by unit tests (see tests/unit/ and issue #3105).

Acceptance Criteria
- Bit-level Hamming distance between 1n and 4n is 2.
- Bit-level Hamming distance between 0n and 0n is 0.
- Mixing Number and BigInt inputs yields identical numeric results (for example, hammingDistanceInt(3, 3n) => 0).
- Large BigInt values beyond Number.MAX_SAFE_INTEGER are supported (for example, 2n**53 vs 2n**53 + 1n returns 1).
- Invalid values (negative BigInt) throw RangeError; non-integer or unsupported types throw TypeError.

Action
Refer to HAMMING_DISTANCE.md for the authoritative specification and canonical acceptance criteria; this file is kept as an index/redirect.
