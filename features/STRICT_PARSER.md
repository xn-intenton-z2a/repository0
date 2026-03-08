# STRICT_PARSER

# Summary
Introduce a clear parsing API and explicit strictness options so callers and deterministic tests get predictable behaviour. Add a parseRoman function with an opt-in permissive mode and make fromRoman strict by default; expose --strict and --permissive CLI flags to control parsing behaviour in the command-line harness.

# Motivation
The mission allows either rejecting or accepting non-canonical Roman numerals; making strictness explicit avoids ambiguity for library consumers and test suites. This feature enables exact CLI semantics for tests and gives library users flexibility when they must accept legacy or permissive inputs.

# Specification
- Library API (src/lib/main.js)
  - Export three named functions: toRoman(n), fromRoman(s), parseRoman(s, options).
  - toRoman(n): unchanged signature and behaviour. Converts integers 1..3999 to canonical Roman numerals using standard subtractive notation (IV, IX, XL, XC, CD, CM) and throws RangeError for inputs outside 1..3999.
  - parseRoman(s, options): parse Roman string s into an integer. options is optional; supported option: strict (boolean).
    - When options.strict === true, parseRoman enforces canonical Roman rules and throws TypeError for invalid or non-canonical strings.
    - When options.strict === false, parseRoman operates permissively: it accepts common non-canonical forms (for example consecutive I repeats) and returns the integer value when the interpretation is unambiguous; it still throws TypeError for clearly invalid characters or ambiguous cases.
  - fromRoman(s): convenience alias for parseRoman(s, {strict: true}) so the library's default programmatic behaviour is strict and deterministic.

- Canonical validation rules (applied when strict: true)
  - Allow only digits M, D, C, L, X, V, I and the standard subtractive pairs IV, IX, XL, XC, CD, CM.
  - Disallow more than three consecutive repeats of I, X, C, or M.
  - Disallow invalid subtractive combinations such as IIV, VX, IL, IC, XM, etc.
  - Require numerals to appear in non-increasing value order except where valid subtractive pairs occur.
  - These rules ensure fromRoman(toRoman(n)) === n for all 1..3999.

- Permissive parsing behaviour (applied when strict: false)
  - Accept longer repeats (e.g., IIII) and interpret them additively unless the sequence is ambiguous.
  - Accept some non-standard ordering if the numeric interpretation is unambiguous and sensible.
  - Still reject inputs containing non-roman characters or clearly malformed sequences that cannot be reasonably interpreted.
  - Document examples of accepted permissive inputs in README.

- CLI behaviour (inside src/lib/main.js behind ESM main guard)
  - Commands: to-roman <number>, from-roman <roman>
  - Flags: --strict and --permissive. Behavior:
    - to-roman <number>: calls toRoman; on success writes the Roman string followed by a single trailing newline to stdout and exits with code 0. For invalid numeric input or out-of-range values write a single-line error to stderr beginning with RangeError: and exit with code 2.
    - from-roman <roman>:
      - Default: calls fromRoman (strict mode). On success writes the integer followed by a single trailing newline to stdout and exits 0. On invalid input write a single-line error beginning with TypeError: and exit 2.
      - With --permissive: call parseRoman(roman, {strict:false}) and behave the same on success or TypeError on failure.
      - With --strict: explicitly use strict parsing (same as default) to make tests explicit.
    - No-arg mode: when invoked with no extra args, read one trimmed line synchronously from stdin. Auto-detect digits-only input (treat as to-roman) vs letters (treat as from-roman). Respect --permissive and --strict flags; default to strict parsing when interpreting as from-roman.
  - I/O stability requirements:
    - Successful stdout must be exactly the conversion result plus a single newline and no extra logging.
    - Error output must be a single line, deterministic, and begin with either RangeError: or TypeError: to allow exact assertions in tests.

# Tests
- Unit tests to add/update in tests/unit/
  - parseRoman(..., {strict:true}) throws TypeError for non-canonical examples: IIII, VX, IIV.
  - parseRoman(..., {strict:false}) returns integers for permissive inputs such as IIII -> 4 and other examples where interpretation is unambiguous.
  - fromRoman is strict: fromRoman("IIII") throws TypeError.
  - Round-trip property: for boundary values and a representative sample, fromRoman(toRoman(n)) === n for n in 1 and 3999 and several intermediate values (e.g., 4, 9, 40, 90, 400, 900, 1994).
  - CLI deterministic tests: spawn node src/lib/main.js with arguments and assert exact stdout, stderr, and exit codes for these cases:
    - node src/lib/main.js to-roman 1994 -> stdout exactly MCMXCIV\n and exit 0
    - node src/lib/main.js from-roman MCMXCIV -> stdout exactly 1994\n and exit 0
    - node src/lib/main.js to-roman 0 -> stderr begins with RangeError: and exit 2
    - node src/lib/main.js from-roman IIII -> default (strict) stderr begins with TypeError: and exit 2
    - node src/lib/main.js --permissive from-roman IIII -> stdout 4\n and exit 0

# Acceptance Criteria
- src/lib/main.js exports named functions toRoman, parseRoman, and fromRoman.
- fromRoman behaves strictly and throws TypeError for non-canonical input such as IIII.
- parseRoman(s, {strict:false}) accepts permissive inputs where reasonable and returns their integer value.
- CLI supports --strict and --permissive; default from-roman is strict; errors begin with TypeError: or RangeError: and exit with code 2.
- Unit tests assert strict and permissive behaviours and CLI I/O and pass under npm test.

# Implementation notes and constraints
- Implement all logic inside src/lib/main.js; do not add new files for the library core or CLI harness.
- Tests stay under tests/unit/ and must exercise the CLI via spawning node src/lib/main.js to assert exact stdout/stderr/exit codes.
- Update README.md with documentation for parseRoman, strict vs permissive semantics, and CLI examples demonstrating both strict rejection and permissive acceptance.
- Keep changes minimal and focus on correctness and deterministic behaviour; avoid adding external dependencies.

# Examples for README (to be added to README.md)
- Using strict parsing (default): fromRoman("IIII") throws TypeError.
- Using permissive parsing: parseRoman("IIII", {strict:false}) returns 4.
- CLI: node src/lib/main.js from-roman MCMXCIV -> 1994
- CLI permissive: node src/lib/main.js --permissive from-roman IIII -> 4
