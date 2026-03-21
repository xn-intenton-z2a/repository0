MDN_ERRORS

Table of contents:
1. RangeError
2. TypeError
3. Usage patterns and throwing

1. RangeError
- Construct: new RangeError([message])
- Semantics: throw when a numeric value is outside an allowed range (e.g., negative where only positives allowed).
- For mission: throw RangeError for negative integers passed to fizzBuzz or fizzBuzzSingle.

2. TypeError
- Construct: new TypeError([message])
- Semantics: throw when an argument is of the wrong type (e.g., non-integer passed where integer required).
- For mission: throw TypeError for non-number or non-integer inputs.

3. Usage patterns and throwing
- Validation examples:
  - if (typeof n !== 'number' || !Number.isInteger(n)) throw new TypeError('n must be integer');
  - if (n < 0) throw new RangeError('n must be non-negative');

Reference digest: MDN RangeError and TypeError pages retrieved 2026-03-21
Attribution: MDN content (retrieved HTML). Size: ~157KB combined (fetched)
