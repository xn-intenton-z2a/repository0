# WEB_DEMO

Summary
Require the demo website to display the library output so behaviour tests and reviewers can assert rendered values.

Behavior
- The site root must include a preformatted block showing a JSON object that contains identity, fizzBuzz15 and fizzBuzzSingle15. The fizzBuzz15 array must contain 15 items and its last element must be FizzBuzz. The fizzBuzzSingle15 value must equal FizzBuzz. The page content must be produced by the build:web script and be visible in the built docs after running the start script.

Acceptance criteria
- [ ] Running npm run build and opening docs/index.html shows a JSON pre block where fizzBuzz15's last element equals FizzBuzz and fizzBuzzSingle15 equals FizzBuzz
- [ ] The built site root contains an output block that matches the library output format used in README examples
