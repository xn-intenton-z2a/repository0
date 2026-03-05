# Hamming Library Usage Report

This brief report demonstrates usage and sample outputs from the hamming distance library.

Examples executed manually or via the test harness are captured in `docs/examples/hamming_examples.txt` and machine-readable results are in `docs/evidence/results.json`.

Key checks (acceptance criteria):

- hammingDistance("karolin", "kathrin") => 3
- hammingDistance("", "") => 0
- hammingDistance("a", "bb") => RangeError thrown
- hammingDistanceBits(1, 4) => 2
- hammingDistanceBits(0, 0) => 0

Run `npm test` to execute the unit tests and reproduce the output recorded here.
