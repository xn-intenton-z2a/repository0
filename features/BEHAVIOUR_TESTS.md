# BEHAVIOUR_TESTS

Summary
Add Playwright behaviour tests that exercise the web demo and verify fizzBuzz output end-to-end.

Motivation
Behaviour tests ensure the web demo integrates with the library and provide an automated acceptance test for the mission.

Specification
- Add tests in tests/behaviour/web.test.js that start the local docs server or use the configured test server, navigate to src/web/index.html, enter 15 in the demo input, submit and assert the last result equals FizzBuzz.
- Add a test that enters 0 and asserts no results are shown.
- Add a test that enters a non-integer and asserts a validation message is displayed.
- Use the playwright test runner configured in the repository.

Acceptance criteria
- Playwright test suite contains tests that pass asserting the demo's behaviour for inputs 15, 0 and invalid input.
- The behaviour tests are runnable with npm run test:behaviour.
