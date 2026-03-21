# WEB_DEMO

Summary

Provide a minimal interactive demo page in the project's web content that uses the library to render FizzBuzz results for a user-provided input. The demo helps reviewers and users verify the behaviour manually and is useful for end-to-end checks.

Requirements

- A simple page under src/web or docs that includes an input for a positive integer, a submit control, and a results area.
- On submit, the page uses the library API to compute results and renders the list of strings line by line so the last element can be visually confirmed as FizzBuzz for canonical inputs.
- The page must be reachable by running the repository start script that builds and serves docs.

Acceptance criteria

- The web demo renders correct output for a sample input of 15 and shows FizzBuzz as the final item.
- The demo is wired to the library API and does not duplicate the algorithm in page script files.
- The demo is documented in README so reviewers know how to open it locally.
