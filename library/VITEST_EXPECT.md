NORMALISED EXTRACT

Table of contents:
- CORE EXPECT SIGNATURE
- KEY MATCHERS (synchronous)
- ASYNC MATCHERS
- ERROR / THROW MATCHERS
- USAGE PATTERNS FOR UNIT TESTS (fizzBuzz examples)

CORE EXPECT SIGNATURE
expect(received) -> matcher object with assertion methods. On assertion failure the matcher throws an exception causing the test to fail.

KEY MATCHERS (synchronous)
- toBe(expected): strict equality using Object.is semantics. Use for primitive exact matches.
- toEqual(expected): deep equality comparison for objects and arrays (value-based comparison). Use to assert arrays or structured results.
- toStrictEqual(expected): stricter deep equality, comparing object types and prototypes.
- toBeNull(), toBeUndefined(), toBeTruthy(), toBeFalsy(): convenience checks for those states.
- toHaveLength(number): asserts length property equals number (useful for arrays returned by fizzBuzz).
- toContain(item): asserts array contains item.

ERROR / THROW MATCHERS
- toThrow([expected]): used with a function under test: expect(() => fn()).toThrow() checks that calling the function throws; optional expected may be a string or regex to match message or an Error constructor.

ASYNC MATCHERS
- resolves/rejects chains are supported for promise assertions: await expect(promise).resolves.toEqual(value) and await expect(promise).rejects.toThrow().

USAGE PATTERNS FOR THIS MISSION
- Use expect(fizzBuzz(15)).toEqual(["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]) to assert full array output.
- Use expect(fizzBuzzSingle(3)).toBe("Fizz") and expect(fizzBuzzSingle(7)).toBe("7") for single-value assertions.
- Validate thrown errors: expect(() => fizzBuzz(-1)).toThrow(RangeError) or expect(() => fizzBuzz("a")).toThrow(TypeError).

DETAILED DIGEST
Source: Vitest expect API documentation retrieved 2026-03-21.
Data size fetched during crawl: approximately 502.2 KB.
Source URL: https://vitest.dev/api/expect.html

ATTRIBUTION
Content adapted from the Vitest API documentation. Retrieved 2026-03-21.
