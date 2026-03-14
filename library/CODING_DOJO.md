TITLE: CODING_DOJO_FIZZBUZZ

TABLE OF CONTENTS:
- Kata description
- Teaching-focused variants
- Stage-based extension rules
- Best practice guidance for TDD
- Digest and attribution

NORMALISED EXTRACT:
Kata: Print 1..100 replacing multiples of 3 with Fizz and multiples of 5 with Buzz; multiples of both produce FizzBuzz. The kata is used to teach TDD and incremental development.
Stage-based extensions: Stage 2 example extends rules to include digit containment: number is fizz if divisible by 3 OR contains digit '3'; buzz if divisible by 5 OR contains digit '5'.
TDD guidance: start with simplest passing case, apply baby-steps, add tests for combinations (3,5,15 and containment), refactor for clarity.

SUPPLEMENTARY DETAILS:
- Use small incremental tests: single-number behaviour, small ranges, boundary tests (1, 100), and negative/zero inputs handling.
- Encourage separation: pure function that maps integer to token; separate runner that prints sequence.

DETAILED DIGEST (CodingDojo page snapshot ~12 KB, retrieved 2026-03-14):
- Content includes kata narrative, sample output, stage-2 requirements and community comments on teaching practice. Retrieved 2026-03-14.

ATTRIBUTION:
Source: codingdojo.org/kata/FizzBuzz/. Data size: ~12 KB. Retrieved: 2026-03-14.
