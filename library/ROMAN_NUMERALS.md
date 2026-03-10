DOCUMENT: ROMAN_NUMERALS

1) NORMALISED EXTRACT

TABLE OF CONTENTS
- Symbol-to-value mapping
- Standard notation rules (additive and subtractive forms)
- Valid range and representational limits
- Validation regular expression (strict classical form)
- Integer -> Roman conversion algorithm (greedy mapping)
- Roman -> Integer parsing algorithm (left-to-right add/subtract)
- Minimalization rule (canonical minimal form)
- Non-standard/historical variants and optional acceptance

SYMBOL-TO-VALUE MAPPING
M  = 1000
CM = 900
D  = 500
CD = 400
C  = 100
XC = 90
L  = 50
XL = 40
X  = 10
IX = 9
V  = 5
IV = 4
I  = 1

STANDARD NOTATION RULES (IMPLEMENTATION-FOCUSED)
- Build numerals by concatenating place-value representations from highest to lowest (thousands, hundreds, tens, units).
- Use subtractive notation only for these pairs: IV (4), IX (9), XL (40), XC (90), CD (400), CM (900).
- Only powers-of-ten symbols (I, X, C) may be used as the subtractive prefix; they may only precede the next two higher symbols (I before V or X; X before L or C; C before D or M).
- Repeat rules: I, X, C, M may appear consecutively at most three times (e.g., III, XXX, CCC, MMM). V, L, D must never be repeated consecutively.
- Omit any zero-value place (no placeholder symbol).
- Canonical maximal representable number in this standard form is 3999 (MMMCMXCIX) when using M for 1000 without overline notation.

VALID RANGE AND REPRESENTATIONAL LIMITS
- Valid input integer range for canonical conversion: 1..3999 inclusive.
- Handling outside range: either reject (throw error) or support extended notation (overline, parentheses, or additive repeats) if explicitly configured.

VALIDATION REGULAR EXPRESSION (STRICT CLASSICAL FORM)
- Strict classical/modern canonical regex:
  ^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$
- Use this regex for validating inputs that must be in minimal/standard form. Uppercase only; trim whitespace before testing.

INTEGER -> ROMAN CONVERSION ALGORITHM (GREEDY MAPPING)
- Data: an ordered list of value-symbol pairs descending by value:
  (1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"), (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I").
- Preconditions: integer n; assert 1 <= n <= 3999 (unless extended mode enabled).
- Steps:
  1. Initialize result = empty string.
  2. For each (value, symbol) in the ordered list:
     a. While n >= value:
        i. Append symbol to result.
        ii. Subtract value from n.
  3. Return result.
- Complexity: O(k) where k is the number of symbol insertions (<= constant bound proportional to n but practically <= 15 for 1..3999), effectively constant for bounded range.
- Deterministic guarantee: produces the canonical minimal form for valid integer ranges.

ROMAN -> INTEGER PARSING ALGORITHM (LEFT-TO-RIGHT ADD/SUBTRACT)
- Preconditions: input string s; normalize: uppercase, trim whitespace.
- Steps:
  1. Map single-symbol values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000.
  2. Initialize total = 0.
  3. Iterate index i from 0 to length(s)-1:
     a. If value(s[i]) < value(s[i+1]) then total -= value(s[i]) else total += value(s[i]).
     b. At last character, always add its value.
  4. After iteration, optionally validate the computed integer by re-encoding with Integer->Roman and comparing to a canonical form if strictness is required.
- Validation notes:
  - To detect invalid subtractive usage, enforce that only I, X, C are subtracted and only from the permitted next-two-higher symbols (apply explicit checks during parse).
  - Also check repeats: if a symbol appears 4 times consecutively and is in the {I,X,C,M} set, it's invalid in strict mode.
- Complexity: O(n) where n is length of the input string (usually small).

MINIMALIZATION RULE (CANONICAL MINIMAL FORM)
- To transform any valid Roman numeral (possibly non-minimal) into its canonical minimal form:
  1. Parse input Roman string into integer using the Roman->Integer parsing algorithm (with permissive acceptance of additive forms if configured).
  2. Convert the integer back to Roman using the Integer->Roman conversion algorithm (greedy mapping above).
- For Project Euler Problem 89: characters saved = original_length - minimal_form_length.

NON-STANDARD / HISTORICAL VARIANTS (IMPLEMENTATION OPTIONS)
- Additive variants: IIII vs IV, VIIII vs IX, XXXX vs XL, CCCC vs CD, etc. Clocks frequently use IIII; monumental inscriptions may use MDCCCCX for 1910.
- Alternative subtractive forms historically seen: IIX for 8, IIIC for 97, IC for 99 — these are non-standard and should be rejected by strict validators.
- Microsoft Excel ROMAN function supports multiple forms controlled by a "Form" parameter; if implementing compatibility, provide an option to select form: classical/minimal, additive, or Excel-style compact forms.

2) SUPPLEMENTARY DETAILS

IMPLEMENTATION CONFIGURATION OPTIONS
- allow_nonstandard_additive (boolean): if true, accept additive variants like IIII and convert them to canonical minimal on output; default false.
- allow_lowercase_input (boolean): if true, lowercase letters are accepted and normalized to uppercase; default true for convenience.
- extended_range_mode (boolean): if true, accept and emit forms for values >3999 using overline or parentheses notation; default false.
- validation_mode (enum): {"strict", "permissive"}. "strict" uses regex and rejects non-standard; "permissive" accepts common historic variants then minimalizes.

EDGE CASES AND HANDLING
- Zero: Roman numerals have no standard zero; treat input "N" as zero only in specialized contexts; canonical conversion should reject 0.
- Negative numbers: Reject; Roman numerals do not represent negatives.
- Invalid characters: Reject and return parse error with position index.
- Long repeated symbols: If stricter rules required, detect and reject sequences exceeding allowed repetitions.

BEST PRACTICES
- Always normalize input: trim and uppercase before validation/parsing.
- Prefer re-encoding validation: after parsing, produce canonical representation and compare to a strict regex to confirm minimal/standard input when needed.
- Use the greedy mapping for conversion to guarantee minimal symbol count under standard rules.
- For library APIs, keep conversion and parsing functions separate and provide a utility that minimalizes arbitrary input by combining them.

3) REFERENCE DETAILS (API SPECIFICATIONS, SIGNATURES, PATTERNS)

API: toRoman
Signature: toRoman(n: integer, opts?: {extended?: boolean}) -> string
Parameters:
- n: integer input to convert. Required. Valid range: 1..3999 when opts.extended is false.
- opts.extended (optional boolean): when true, allow emitting extended notations for n>=4000 (implementer-defined: overline or parentheses). Default false.
Returns:
- string: canonical Roman numeral representation (uppercase) for n.
Errors:
- Throws RangeError if n < 1 or n > 3999 unless extended mode enabled.

API: fromRoman
Signature: fromRoman(s: string, opts?: {permissive?: boolean}) -> integer
Parameters:
- s: Roman numeral string (required). Input is normalized (trimmed and uppercased automatically by implementation).
- opts.permissive (optional boolean): if true, accept common non-standard/additive forms (e.g., IIII) and still parse; default false.
Returns:
- integer: numeric value of the Roman numeral.
Errors:
- Throws SyntaxError with position information if invalid characters or invalid subtractive patterns are encountered in strict mode.

API: minimalizeRoman
Signature: minimalizeRoman(s: string, opts?: {permissive?: boolean}) -> {value: integer, minimal: string, saved: integer}
Parameters:
- s: Roman numeral string to minimalize.
- opts.permissive: pass-through to fromRoman.
Returns:
- value: integer produced by parsing s.
- minimal: canonical minimal Roman string produced by toRoman(value).
- saved: original_length - minimal.length
Errors:
- Propagates errors from fromRoman and toRoman.

VALIDATION REGEX (REPEATED)
- Canonical strict regex for minimal modern form:
  ^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$

COMMON IMPLEMENTATION PATTERNS
- Conversion mapping array (ordered descending): [ (1000,'M'), (900,'CM'), ..., (1,'I') ]. Iterate and subtract repeatedly until n==0.
- Parsing loop: for i in 0..len-1: lookahead value; if current < next: subtract current; else add current.
- Post-parse canonical check: re-encode value and compare to input for strict acceptance.
- Minimalization: minimal = toRoman(fromRoman(input, permissive=true))

TROUBLESHOOTING
- Problem: Input "IL" parsed as 49 by naive subtract algorithm. Cause: IL is non-standard subtractive usage (I cannot be subtracted from L). Fix: add check disallowing subtractive pairs that are not in the permitted set.
- Problem: Input has lowercase letters and validation fails. Fix: normalize to uppercase before regex testing.
- Problem: Conversion produces non-minimal output when using naive repeated-symbol mapping that doesn't include subtractive pair entries. Fix: include subtractive pairs (900,400,90,40,9,4) in the greedy mapping list.
- Problem: Counting characters saved returns negative number. Cause: input already minimal or canonical; compute absolute or clamp at zero depending on use-case.

4) DETAILED DIGEST

SOURCE: https://en.wikipedia.org/wiki/Roman_numerals
Retrieved: 2026-03-10
Extracted content: symbol table, standard subtractive rules, repeat rules, examples of modern canonical forms (e.g., 39=XXXIX, 246=CCXLVI, 789=DCCLXXXIX), historical additive variants (IIII), limits (max canonical 3999), fractional notations, and examples of non-standard subtractive forms.

SOURCE: https://rosettacode.org/wiki/Roman_numerals
Retrieved: 2026-03-10
Extracted content: tasks for encoding and decoding; community-provided algorithms and multiple language implementations; emphasis on two discrete tasks: encode (integer to roman) and decode (roman to integer).

SOURCE: https://stackoverflow.com/questions/4965335/how-to-convert-a-number-to-roman-numerals
Retrieved: 2026-03-10
Extracted content: community code examples and discussion of flexible implementations, tree/printer code unrelated to core algorithm but indicates typical forum solutions; reinforces common conversion techniques.

SOURCE: https://projecteuler.net/problem=89
Retrieved: 2026-03-10
Extracted content: definitive rules for minimal form as used in Euler Problem 89; example demonstrating multiple non-minimal representations and instruction to compute characters saved by converting to minimal form using canonical rules.

SOURCE: https://www.npmjs.com/package/roman-numerals
Retrieved: 2026-03-10
Extracted content: package metadata and implementation notes could not be fetched due to HTTP 403; npm page known to host a small JS package providing toRoman/fromRoman; recommend inspecting package locally if available. (Note: fetch returned 403 access denied.)

DATA SIZE OBTAINED DURING CRAWL
- Wikipedia page chunk retrieved: approximately 20,000 characters (initial fetch truncated at 20k; full page larger).
- Rosetta Code page retrieved: approximately 2,000 characters.
- StackOverflow thread retrieved: approximately 3,000 characters (example code included).
- Project Euler problem page retrieved: approximately 1,200 characters.
- npmjs package page attempted: 403 error, no content retrieved.

ATTRIBUTION
- Content sourced from: Wikipedia (Roman numerals), Rosetta Code (Roman numerals), StackOverflow question id 4965335, Project Euler problem 89, npm package roman-numerals page (metadata access denied).
- Retrieval date: 2026-03-10

SIZE OF DOCUMENT STORED
- This document text length: approximately 6,500 characters (approximation).

END OF DOCUMENT