# FIZZBUZZ_EXAMPLES

# Summary

Provide a small, focused examples feature that demonstrates canonical library usage and adds two thin, testable helper exports: fizzBuzzStats and fizzBuzzGenerator. The feature provides a minimal examples script and README examples that rely exclusively on the named exports from src/lib/main.js and are suitable for unit and behaviour tests.

# Specification

Deliverables

- Named exports in src/lib/main.js: fizzBuzzStats(n) and fizzBuzzGenerator(n). fizzBuzzStats returns an object { fizz, buzz, fizzBuzz, numbers, total } counting occurrences in 1..n. fizzBuzzGenerator is a synchronous generator yielding canonical strings for 1..n in order.
- examples/simple-run.js: a tiny Node script that imports the library named exports, runs fizzBuzz(15) and fizzBuzzSingle(3), prints the fizzBuzz array as JSON and prints fizzBuzzStats(15) as JSON, and exits with code 0 on success.
- README additions: two short usage examples displayed as prose: one showing fizzBuzzSingle for 3 returning Fizz, and another showing fizzBuzz producing a 15-element sequence ending with FizzBuzz plus a short note about the stats helper and generator and how to run the examples script.

Constraints and behaviour

- All new behaviour must be additive: never change fizzBuzz or fizzBuzzSingle canonical behaviour or signatures. The new helpers must reuse the canonical validation and logic by delegating to existent functions.
- fizzBuzzStats(0) must return zeroed counts and total 0. fizzBuzzStats(15) must return exactly { fizz: 4, buzz: 2, fizzBuzz: 1, numbers: 8, total: 15 }.
- Array.from(fizzBuzzGenerator(5)) must equal fizzBuzz(5).
- examples/simple-run.js must produce deterministic JSON output that unit tests can assert against and must rely on the library's named exports only.

# Testing guidance

Unit tests must import named exports from src/lib/main.js and assert exact outputs and thrown errors for invalid inputs:

- fizzBuzzStats(15) equals the expected counts and fizzBuzzStats(0) returns zeros with total 0.
- Array.from(fizzBuzzGenerator(5)) equals fizzBuzz(5).
- Passing invalid n to helper functions must throw the same error types and substrings used by the canonical validation.
- Spawn examples/simple-run.js in a unit test and assert it exits with code 0 and that stdout contains JSON matching JSON.stringify(fizzBuzz(15)) and the printed stats match fizzBuzzStats(15).

# Acceptance criteria

- The repository exports fizzBuzzStats and fizzBuzzGenerator from src/lib/main.js and both behave as specified.
- examples/simple-run.js exists, uses only the exported library functions, prints JSON for fizzBuzz(15) and the stats object, and exits 0.
- README contains two concise examples as prose demonstrating fizzBuzzSingle and fizzBuzz usage and references the stats helper and generator.
- Unit tests cover the helper functions, generator equivalence, examples script output, and validation behaviour for invalid inputs.
