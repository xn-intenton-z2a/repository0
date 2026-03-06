# BIGINT_SUPPORT

# Overview

DEPRECATED — BigInt support has been merged into the canonical HAMMING_DISTANCE feature. This document remains for historical context. See features/HAMMING_DISTANCE.md for the authoritative specification that includes BigInt, Number, and buffer-based handling for hammingDistanceBits.

# Rationale

- Prior work added explicit BigInt handling for hammingDistanceBits to support values beyond Number.MAX_SAFE_INTEGER while preserving Number performance for safe integers.
- The merged HAMMING_DISTANCE spec centralizes behavior for integer and buffer inputs, including mixed Number/BigInt coercion rules and error semantics.

# Back-compat Notes

- Existing tests and implementations that referenced this feature should continue to work because the merged spec preserves the same validation and behavior for BigInt and mixed Number/BigInt calls.
- New development should reference features/HAMMING_DISTANCE.md for requirements and acceptance criteria.

# Acceptance Criteria (maintained)

- hammingDistanceBits(1n, 4n) returns 2
- hammingDistanceBits(1, 4n) returns 2
- hammingDistanceBits(0n, 0n) returns 0
- Passing Number > Number.MAX_SAFE_INTEGER without BigInt usage throws RangeError
- Negative inputs throw RangeError
- Non-numeric inputs throw TypeError

# Implementation note

No separate implementation is required beyond the single source changes described in features/HAMMING_DISTANCE.md; tests may be consolidated there.
