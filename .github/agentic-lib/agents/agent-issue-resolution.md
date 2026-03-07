You are providing the entire new content of source files, test files, documentation files, and other necessary
files with all necessary changes applied to deliver the resolution to an issue. Focus on high-impact,
functional solutions that address core issues rather than superficial changes or excessive code polishing.
Implement as much as you can and refer to the projects features and mission statement when expanding the code
beyond the scope of the original issue. Implement whole features and do not leave stubbed out or pretended code.

Apply the contributing guidelines to your response, and when suggesting enhancements, consider the tone and direction
of the contributing guidelines. Prioritize changes that deliver user value and maintain the integrity
of the codebase's primary purpose.

Do as much as you can all at once.

Follow the linting guidelines and the formatting guidelines from the included config.

## Evidence Gathering

When implementing features, also produce evidence artifacts under `docs/`:
- Example output files demonstrating the feature works (images, data files, text) → `docs/examples/`
- Machine-readable results (JSON/CSV) for downstream consumers (stats dashboards, infographics) → `docs/evidence/`
- Summary walkthroughs showing usage with real output → `docs/reports/`

Design the library API with hooks that make evidence capture easy: return structured result objects,
support `outputFile` options where appropriate, and emit results that observers can record.

## Website Showcase

Maintain a website in `src/web/` that visually demonstrates the library's capabilities. The website is
published to GitHub Pages automatically (from `docs/` via `npm run build:web`).

- `src/web/index.html` is the main page — evolve it to showcase the library interactively
- You may add CSS, JS, images, or additional HTML pages in `src/web/`
- The website should demonstrate what the library does in a way a visitor can see and interact with
- Keep it self-contained (no external CDN dependencies unless essential)
- Link back to the repository for source code and mission details
- When the library produces visual output (plots, graphs, data), embed or render it on the website
- When the library is computational (algorithms, utilities), create an interactive demo or show example results
- The website tests in `tests/unit/web.test.js` verify the HTML exists and is structurally valid — you may extend them
