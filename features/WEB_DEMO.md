# WEB_DEMO

Summary

Provide an interactive demonstrator page under src/web/ (or the docs site) that uses the library to show FizzBuzz results for user input and demonstrates both single-value and range behaviours.

Motivation

A visible, interactive demo helps users and reviewers verify behaviour quickly and supports the repository mission to export usable FizzBuzz functions.

Specification

- UI elements
  - Numeric input for n (positive integer)
  - Buttons: "Show Single" and "Show Range"
  - Output area that displays either a single string or a formatted list/JSON for range results

- Behaviour
  - Input validation mirrors library errors and shows friendly messages in the UI
  - "Show Single" calls fizzBuzzSingle and displays the returned string
  - "Show Range" calls fizzBuzz and displays the resulting array as a human-readable list

Tests and Acceptance Criteria

- Playwright behaviour test visits the demo page, sets n=15, clicks Show Range, and asserts the output contains "FizzBuzz" as the last item
- Demo is built with existing docs build pipeline and requires no new dependencies

Notes

- Implement purely as a small client-side script that imports the library module and manipulates the DOM so it fits into the existing site build.

