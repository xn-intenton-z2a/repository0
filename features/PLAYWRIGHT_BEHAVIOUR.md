# PLAYWRIGHT_BEHAVIOUR

Summary
Define behaviour tests using Playwright to confirm the demo site displays correct FizzBuzz output.

Behavior
- A Playwright behaviour test should visit the built site root, locate the preformatted JSON output, and assert that fizzBuzz15 contains 15 items and that the last item equals FizzBuzz. The test should also assert fizzBuzzSingle15 equals FizzBuzz. The test must be runnable via npm run test:behaviour using the repository's Playwright configuration.

Acceptance criteria
- [ ] A Playwright behaviour test exists that loads the site and asserts the pre block contains the fizzBuzz15 array with a last element FizzBuzz and fizzBuzzSingle15 equals FizzBuzz
- [ ] The behaviour test runs via npm run test:behaviour and passes in CI
