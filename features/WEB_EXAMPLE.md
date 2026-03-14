# WEB_EXAMPLE

Purpose

Provide a tiny web demonstration page that uses the library in the browser so the library's behaviour is visible and testable via the site at src/web. This helps verify that the library is usable in both Node and browser contexts.

Specification

- Create a simple page or example in src/web that imports the library and renders the result of fizzBuzz(15) into the document as a list.
- The demo must clearly show the JSON output or a human-friendly list so a reviewer can confirm the fifteenth value is FizzBuzz at a glance.
- The demo should include a minimal interactive control (an input and a button) allowing the user to enter a number and recompute the list in-place; validation errors should be shown inline.

Acceptance Criteria

- The repository contains an example web page that uses the library and displays fizzBuzz(15) with the fifteenth element visible as FizzBuzz.
- The example can be built by the project's existing build:web script and the output is viewable via the documented start command.
- The web demo includes an input control that permits entering a number and recomputing the displayed list, with invalid input shown as an inline error.
