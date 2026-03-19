# API_EXPORTS

Overview

Define and publish a clear public API as named exports from src/lib/main.js so other modules and tests can import specific functions.

Description

All core capabilities must be available as named exports. Consumers should be able to import parseExpression, evaluateExpressionOverRange, loadCsvTimeSeries, renderSvg, renderPng, savePlot, and cliMain directly from src/lib/main.js.

Acceptance Criteria

- src/lib/main.js exports the following named symbols: parseExpression, evaluateExpressionOverRange, loadCsvTimeSeries, renderSvg, renderPng, savePlot, cliMain.
- Unit tests import a subset of those symbols and assert they are functions.
- README documents the public API and shows minimal usage examples for both library and CLI usage.

Implementation Notes

- Update tests/unit/main.test.js to import named exports rather than relying on default or side-effect imports.
- Keep exported function names stable; avoid breaking changes without updating tests and README.