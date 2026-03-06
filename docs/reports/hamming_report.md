Hamming bits support report

This report demonstrates BigInt and Number support for hammingDistanceBits.

Highlights:
- Numeric inputs accept Number and BigInt. Mixed Number/BigInt coerces safe Numbers to BigInt.
- Fast Number path preserved for two safe Numbers using 32-bit chunk popcounts.
- BigInt path uses Kernighan's algorithm for arbitrary-size integers.

See docs/examples/hamming_examples.txt and docs/evidence/hamming_results.json for concrete outputs.
