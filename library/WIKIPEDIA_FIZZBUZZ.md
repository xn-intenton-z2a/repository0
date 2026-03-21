Title: WIKIPEDIA_FIZZBUZZ

Table of contents:
- Definition and game rules
- Expected outputs and canonical examples
- Edge-case behaviours and historical notes
- Digest and retrieval metadata
- Attribution and data size

Definition and game rules:
FizzBuzz is a counting game with the following deterministic replacement rules applied to each positive integer i:
1. If i is divisible by 3 and not 5, output the string Fizz.
2. If i is divisible by 5 and not 3, output the string Buzz.
3. If i is divisible by both 3 and 5 (i.e., divisible by 15), output FizzBuzz.
4. Otherwise output the decimal representation of i.

Expected outputs and canonical examples:
- Sequence from 1..15 yields: 1,2,Fizz,4,Buzz,Fizz,7,8,Fizz,Buzz,11,Fizz,13,14,FizzBuzz
- The canonical example demonstrates replacement precedence: FizzBuzz takes priority over Fizz and Buzz.

Edge-case behaviours and historical notes:
- The standard definition applies to positive integers only. Implementations may define behaviour for 0, negatives, or non-integers; for strict correctness use the positive-integer domain.

Digest and retrieval metadata:
- Retrieved: 2026-03-21
- Source: https://en.wikipedia.org/wiki/Fizz_buzz
- Extract size (first chunk fetched): approx 16 KB

Attribution:
- Source: Wikipedia (Creative Commons Attribution-ShareAlike)
- URL: https://en.wikipedia.org/wiki/Fizz_buzz
- Retrieved on 2026-03-21
