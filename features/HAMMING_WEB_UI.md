# HAMMING_WEB_UI

Purpose
Improve the repository website demo to include an interactive Hamming calculator so visitors can experiment with the library in the browser.

Scope
- Update src/web/index.html and src/web/lib.js to expose the Hamming functions and wire a small UI.
- UI requirements:
  - A mode toggle (string / bits) with id hamming-mode.
  - Two inputs for values a and b with ids hamming-input-a and hamming-input-b.
  - A result area with id hamming-result that displays the numeric distance.
  - For string mode, a visual highlight area with id hamming-highlight showing differing positions.
- Progressive enhancement: the page should render and function without JavaScript showing identity information; the interactive calculator is enabled when lib.js loads.

Testing
- Add Playwright behaviour tests that load src/web/index.html, fill the inputs, toggle the mode, and assert the result updates (e.g., karolin vs kathrin => 3) and highlight elements are present.

Acceptance Criteria
- index.html contains elements with ids hamming-mode, hamming-input-a, hamming-input-b, and hamming-result.
- Behaviour tests confirm the calculator computes correct results and highlights differences for strings in the browser.
