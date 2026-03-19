WIKIPEDIA_ROMAN

Table of contents
- Symbols and values
- Subtractive notation rules
- Canonical value table (1..1000 mappings)
- Valid range and canonical form
- Conversion algorithm (integerToRoman) — exact steps
- Parsing algorithm (romanToInteger) — exact steps
- Validation regex and rules
- API signatures and error behaviour
- Supplementary specifications
- Digest: source section and retrieval metadata
- Attribution and data size

Symbols and values
I = 1
V = 5
X = 10
L = 50
C = 100
D = 500
M = 1000

Subtractive notation rules (strict canonical form)
- A smaller-value symbol placed before a larger-value symbol denotes subtraction rather than addition.
- Only these subtractive pairs are valid in canonical subtractive notation:
  - I may precede V and X (IV = 4, IX = 9)
  - X may precede L and C (XL = 40, XC = 90)
  - C may precede D and M (CD = 400, CM = 900)
- No other preceding smaller symbols are allowed (e.g., IL, IC are invalid).
- No symbol repeats four times in a row in canonical form (IIII is non-canonical and must be rejected).

Canonical value table (descending order for conversion)
1000 -> M
900  -> CM
500  -> D
400  -> CD
100  -> C
90   -> XC
50   -> L
40   -> XL
10   -> X
9    -> IX
5    -> V
4    -> IV
1    -> I

Valid range and canonical form
- Canonical Roman numerals (following subtractive rules above) represent integers 1 through 3999 inclusive.
- Implementations must throw RangeError for integers outside 1..3999.
- Implementations must throw TypeError when parsing strings that are not canonical Roman numerals (e.g., IIII, IL, IC).

Conversion algorithm (integerToRoman) — exact steps
1. Validate input type is number (throw TypeError if not a finite integer).
2. If n < 1 or n > 3999, throw RangeError.
3. Prepare parallel arrays (values, numerals) in descending order:
   values  = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
   numerals= ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
4. Initialize result = "" and i = 0.
5. While n > 0:
   a. While n >= values[i]: append numerals[i] to result and set n -= values[i].
   b. Increment i.
6. Return result.

Parsing algorithm (romanToInteger) — exact steps
1. Validate input type is string (throw TypeError if not a string).
2. Trim and uppercase the input.
3. Validate against canonical regex (see below); if not matched, throw TypeError.
4. Use mapping for single symbols and subtractive tokens:
   map = {M:1000, D:500, C:100, L:50, X:10, V:5, I:1, CM:900, CD:400, XC:90, XL:40, IX:9, IV:4}
5. Scan left-to-right, attempting to match two-character subtractive tokens first (CM,CD,XC,XL,IX,IV). If present, add their value and advance by 2; else add the single symbol value and advance by 1.
6. After scanning, verify final integer is within 1..3999 else throw RangeError.
7. Return integer.

Validation regex and rules
- Use the strict canonical regex (matches only subtractive canonical numerals):
  ^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$
- This enforces the following:
  - Up to three leading M's (0..3000)
  - Hundreds group: CM|CD|D?C{0,3}
  - Tens group: XC|XL|L?X{0,3}
  - Ones group: IX|IV|V?I{0,3}
- Use this regex as the primary validation gate before parsing.

API signatures and error behaviour (export as named exports from src/lib/main.js)
- function integerToRoman(n: number): string
  - Throws TypeError if n is not a finite integer.
  - Throws RangeError if n < 1 or n > 3999.
- function romanToInteger(s: string): number
  - Throws TypeError if s is not a string or does not match the canonical regex.
  - Throws RangeError if the parsed integer is outside 1..3999 (defensive).

Supplementary specifications
- Performance: both algorithms run in O(1) bounded steps for required domain (max 15 token appends), suitable for synchronous JS.
- Normalisation: romanToInteger must uppercase and trim before validation; reject whitespace or embedded characters.
- Round-trip property: For all integers n in 1..3999, romanToInteger(integerToRoman(n)) === n.
- Reversibility relies on strict canonical encoding from integerToRoman.

Digest: source section and retrieval metadata
- Source: Wikipedia: Roman numerals — section covering symbols, subtractive notation, and historical usage.
- Retrieval date: 2026-03-19
- Retrieved content size: approximately 540.3 KB (HTML) saved during crawl.

Attribution and data size
- Source URL: https://en.wikipedia.org/wiki/Roman_numerals
- Retrieved: 2026-03-19
- Size: ~540.3 KB (HTML)
- License: Wikipedia content under CC BY-SA; verify terms when reusing large verbatim excerpts.
