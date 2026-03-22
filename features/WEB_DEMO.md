# WEB_DEMO

Summary
A minimal interactive web demo page under src/web that lets users input a positive integer N and renders the fizzBuzz(N) results.

Motivation
Makes library behaviour visible in the browser and provides an accessible manual test and demo for users and automated behaviour tests.

Specification
- Create or update src/web/index.html to include a labelled numeric input, a submit button, and a results container.
- The page should import the library module and call fizzBuzz for the provided integer N.
- Input validation: if input is missing, negative, or non-integer show a visible validation message and do not call the library.
- For N equal to 0 show an empty results area.
- Keep the demo minimal, self-contained and compatible with the existing project web build tooling.

Acceptance criteria
- Visiting the web demo and entering 15 produces a list of 15 items with the last item equal to FizzBuzz.
- Entering 0 produces no list items.
- Entering a non-integer or negative value shows a validation message and no results.
- The demo is reachable at src/web/index.html and referenced from README.
