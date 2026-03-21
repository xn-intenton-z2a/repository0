# ERROR_HANDLING

Summary
Define precise validation rules and error semantics for invalid inputs to make behavior deterministic and testable.

Behavior and messages
- Non-integer inputs: if Number.isInteger(n) is false then throw a TypeError with the message n must be an integer. This includes floats, numeric strings, NaN, and Infinity.
- Negative integers: if n < 0 then throw a RangeError with the message n must be >= 0.
- Zero: if n === 0 return an empty array immediately.
- Large or unsafe integers: implementations should assume callers will use reasonable n; if a safety check is desired prefer throwing RangeError with a clear message; keep this optional unless tests require it.

Acceptance criteria
- [ ] Calls with non-integer values produce TypeError with message n must be an integer
- [ ] Calls with negative integers produce RangeError with message n must be >= 0
- [ ] fizzBuzz(0) returns an empty array exactly

Notes
- Use simple, unambiguous messages to ensure tests can assert error.message equality.
- Prefer TypeError for type/shape problems and RangeError for out-of-range numeric values.
