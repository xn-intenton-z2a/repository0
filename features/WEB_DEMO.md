# WEB_DEMO

Summary

Provide a small interactive demo page under src/web/ demonstrating the library in the browser so reviewers can visually verify behaviour.

Specification

- Add a compact demo that accepts a numeric input and shows the fizzbuzz result for 1..n in a scrollable area.
- The demo must be accessible and update results on user action without a full page reload.
- The demo should reuse the library code where possible (for example by importing the library bundle or by mirroring the same logic in a tiny adapter).

Acceptance Criteria

- The repository contains a web demo under src/web or docs that allows manual entry of n and displays the expected sequence.
- The demo is reachable via the repository start script (npm run start) and is linked from the README.

Implementation Notes

- Keep the UI minimal; the goal is a visible, interactive verification instrument rather than a polished product.
