# FIZZBUZZ_WEB_DEMO

Summary

Provide a small interactive web demonstration that lets a user enter a positive integer and see the fizz buzz output rendered as a list. This helps validate the library in a visible, user-friendly way and serves as an integration example for the website in src/web.

Behaviour

- Web demo presents a single numeric input control and a submit button.
- On submit, the demo calls the library function to compute results and renders the returned array as an ordered list.
- Input validation in the UI prevents submitting negative or non-integer values and shows inline validation messages; library validation still applies and must be handled gracefully.

Integration notes

- Add a minimal page or component under src/web that imports the named exports from src/lib/main.js.
- Keep styling minimal; focus on accessibility: label the input, ensure keyboard operability, and make the result list readable by screen readers.

Acceptance criteria

- The demo allows entering 15 and shows an ordered list of 15 items with FizzBuzz as the final item.
- The demo blocks invalid inputs at the UI level and displays a validation message.
- The demo uses the library exports rather than reimplementing fizz buzz logic in the web layer.