# INPUT_VALIDATION

Summary

Define precise input validation rules and testable behaviour for invalid inputs so consumers and tests have deterministic expectations.

Validation rules

- Type check: if the input is not a number or if Number.isInteger(input) is false then throw a TypeError.
- Range check: if the input is a number but less than zero then throw a RangeError.
- Zero handling: input value zero is valid for fizzBuzz and returns an empty array; for fizzBuzzSingle zero may be allowed or tested depending on API decision, but tests should assert expected behaviour. Prefer treating fizzBuzzSingle(0) as returning 0 as string or throw; for clarity require tests to assert that fizzBuzzSingle only accepts positive integers greater than zero and will throw RangeError for 0 or negative if that behaviour is chosen. The core mission requires fizzBuzz(0) returns empty array; tests must verify that case.

Test cases (explicit)

- Non-number input such as a string should cause TypeError.
- Non-integer numeric input such as 4.5 should cause TypeError.
- Negative integers such as -1 should cause RangeError.
- Zero passed to fizzBuzz returns empty array.

Acceptance criteria

- There are unit tests asserting TypeError is thrown for non-number and non-integer inputs.
- There are unit tests asserting RangeError is thrown for negative inputs.
- There is a unit test asserting fizzBuzz(0) returns an empty array.
- The project uses Number.isInteger for integer checks and typeof for number checks as observed in implementation.
