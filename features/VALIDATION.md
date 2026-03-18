# VALIDATION

Purpose
Describe validation rules, thrown exceptions and error messages for both string and integer APIs.

Rules
- For string API: both arguments must be of type string. Otherwise throw TypeError.
- For string API: after Unicode normalization to NFC and code point splitting, if lengths differ throw RangeError.
- For integer API: arguments must be either BigInt or Number. If a Number, it must pass the integer test. Otherwise throw TypeError.
- For integer API: negative integers are invalid and must cause RangeError.
- All errors must be deterministic and documented in the README and tests.

Acceptance criteria
- Passing non-strings to string API causes TypeError.
- Passing non-integer numbers to integer API causes TypeError.
- Passing negative integers to integer API causes RangeError.
- Error messages should be specific and stable for testing.
