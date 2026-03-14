# LIBRARY_API

Purpose

Define the public API surface and README requirements so the library is easily consumable and demonstrable on the website.

Exports

- src/lib/main.js must export the following named exports:
  - hammingString: function to compute Hamming distance between two strings (see HAMMING_STRINGS).
  - hammingBits: function to compute Hamming distance between two non-negative integers (see HAMMING_BITS).

Documentation and README

- README must include usage examples showing both hammingString and hammingBits usage and the expected return values for the acceptance examples.
- Provide at least one plain usage example that can be copied into a unit test or run via node when start:cli is used.

Testing

- Unit tests must cover examples in the mission acceptance criteria and those in feature descriptions.

Acceptance criteria

- The two named exports exist and are described in the README.
- README usage examples include hammingString("karolin", "kathrin") -> 3 and hammingBits(1, 4) -> 2.
