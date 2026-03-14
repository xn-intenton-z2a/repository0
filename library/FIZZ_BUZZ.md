TITLE: FIZZ_BUZZ

TABLE OF CONTENTS:
- Problem statement
- Canonical algorithm
- Implementation patterns
- Edge cases and variants
- Supplementary details
- Reference details
- Detailed digest
- Attribution

NORMALISED EXTRACT:
Problem statement: Print sequence 1..N; replace multiples of 3 with Fizz, multiples of 5 with Buzz, multiples of both with FizzBuzz.
Canonical algorithm: For each integer i from 1 to N, compute r3 = (i % 3 === 0), r5 = (i % 5 === 0). If r3 and r5 -> output FizzBuzz, else if r3 -> Fizz, else if r5 -> Buzz, else output decimal representation of i.
Implementation patterns: 1) Single-pass loop with if/else checking i%15 first or checking both r3 and r5. 2) Compose output by concatenation: out = ""; if r3 append 'Fizz'; if r5 append 'Buzz'; if out=='' set out = String(i).
Performance: O(N) time, O(1) extra space for streaming outputs or O(N) to collect all outputs. Division and modulus on integers is constant-time in typical runtimes.

SUPPLEMENTARY DETAILS:
- Option: extend rules (contains digit criteria) by checking string contains '3' or '5'.
- Internationalisation: output tokens are simple ASCII words; make configurable mapping table for other languages.
- Test vectors: 3->Fizz, 5->Buzz, 15->FizzBuzz, 1->1, 53->FizzBuzz when using contains-rule.

REFERENCE DETAILS:
- Input: N (positive integer)
- Output: sequence values for i in [1..N] where each entry is one of: 'Fizz', 'Buzz', 'FizzBuzz', or decimal string of i.
- Validations: N must be integer >=1; callers should throw RangeError / reject invalid values.
- Implementation pattern (signature): function fizzBuzzSequence(N) -> Array[string] or generator yielding strings. Behavior: deterministically produce N outputs in order.

DETAILED DIGEST (source: Wikipedia, RosettaCode, CodingDojo; retrieved: 2026-03-14):
- Wikipedia: canonical definition and cultural notes; algorithm as above. (retrieved 2026-03-14; ~66.7 KB HTML snapshot)
- Rosetta Code: concrete implementations in many languages; all follow the canonical loop+conditional pattern. (retrieved 2026-03-14; ~1.1 MB snapshot)
- Coding Dojo: kata description, teaching notes, variant that extends rule to digit containment and other progressive requirements. (retrieved 2026-03-14; ~12 KB snapshot)

ATTRIBUTION:
Sources: Wikipedia (Fizz_buzz), RosettaCode (FizzBuzz collection), CodingDojo (FizzBuzz kata). Data sizes: Wikipedia ~66.7 KB, RosettaCode ~1.1 MB, CodingDojo ~12 KB. Content retrieved 2026-03-14.
