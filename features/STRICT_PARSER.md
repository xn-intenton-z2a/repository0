# STRICT_PARSER

# Summary
Add an explicit parseRoman API with an opt-in strict parsing mode and make fromRoman strict by default. Expose a --strict CLI flag so consumers and deterministic tests can require canonical Roman numeral validation while allowing permissive parsing via parseRoman when needed.

# Motivation
The mission permits either rejecting or accepting non-canonical inputs. Making strictness explicit removes ambiguity, ensures deterministic CLI and test behaviour, and gives library consumers a clear opt-in path for permissive parsing when necessary.

# Specification
- Library API (src/lib/main.js)
  - Export three named functions: toRoman(n), fromRoman(s), parseRoman(s, options).
  - toRoman(n): unchanged behaviour and signature; converts integers 1..3999 to canonical Roman strings and throws RangeError for out-of-range values.
  - parseRoman(s, options): parse a Roman string to an integer. options is optional and may include strict (boolean). If options.strict === true, parseRoman enforces canonical rules and throws TypeError on invalid input; if strict === false, parseRoman accepts permissive/non-canonical forms and returns their integer value when unambiguous.
  - fromRoman(s): alias for parseRoman(s, {strict:true}) to preserve a strict default and deterministic behaviour for callers and tests.

- Strict validation rules
  - Only allow standard subtractive pairs: IV, IX, XL, XC, CD, CM.
  - Do not allow more than three consecutive repeats of I, X, C, or M.
  - Reject invalid subtractive sequences (IIV, VX, IL, IC, etc.).
  - Enforce overall ordering so that fromRoman(toRoman(n)) === n for all n in 1..3999.

- CLI behaviour (inside src/lib/main.js guarded by ESM main check)
  - Arguments: to-roman <number>, from-roman <roman>, and --strict flag for from-roman and no-arg auto-detection.
  - to-roman: uses toRoman; on success prints exact Roman string with a single trailing newline and exits 0; for invalid input prints a single-line error starting with RangeError: and exits with code 2.
  - from-roman: by default uses strict parsing (same as fromRoman); when --strict is provided it is explicit; a --permissive flag may be accepted to call parseRoman(..., {strict:false}). On success prints integer with single trailing newline and exits 0; on invalid input prints a single-line error starting with TypeError: and exits 2.
  - No-arg mode: read one trimmed line synchronously from stdin; auto-detect digits-only versus letters; apply strict parsing for from-roman by default unless --permissive is passed.
  - I/O stability: successful stdout must be exactly the conversion result plus a single newline and no extra logging; error lines must be single-line and deterministic beginning with TypeError: or RangeError: as appropriate.

# Tests
- Unit tests must cover:
  - parseRoman(..., {strict:true}) rejects non-canonical forms IIII, VX, IIV with TypeError.
  - parseRoman(..., {strict:false}) accepts permissive forms and returns their integer equivalents where unambiguous.
  - fromRoman is strict: fromRoman("IIII") throws TypeError.
  - toRoman and fromRoman round-trip: fromRoman(toRoman(n)) === n for boundary values 1 and 3999 and a sample range.
  - CLI deterministic behaviour: spawn node src/lib/main.js with arguments and assert exact stdout, stderr, and exit codes for examples (to-roman 1994, from-roman MCMXCIV, to-roman 0 error, from-roman IIII error).

# Acceptance Criteria
- src/lib/main.js exports named functions toRoman, parseRoman, and fromRoman.
- fromRoman behaves as strict parsing and throws TypeError for non-canonical input such as IIII.
- parseRoman(s, {strict:false}) accepts permissive inputs when reasonable and returns their integer value.
- CLI supports --strict and --permissive flags and by default treats explicit from-roman as strict; errors begin with TypeError: or RangeError: and exit 2.
- Unit tests assert strict and permissive behaviours and CLI I/O and pass under npm test.

# Notes
- Keep all implementation inside src/lib/main.js and tests in tests/unit/. Do not add new files outside the allowed sets.
- Update README.md to document parseRoman and the strictness choices, and to show CLI examples that demonstrate strict rejection of IIII and permissive acceptance via parseRoman when requested.

