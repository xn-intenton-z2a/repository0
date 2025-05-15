# Library API

# Purpose
Expose core plotting and data generation functions as a programmatic JavaScript API so users can integrate plotting capabilities directly into their applications without invoking the CLI or HTTP server.

# API Exports
- Export functions from `src/lib/main.js`:
  - `generatePlotData(functionName, start, end, samples)`
  - `generatePolarData(functionName, rStart, rEnd, thetaStart, thetaEnd, resolution)`
  - `renderPlotSVG(data, options)` to produce SVG markup from data points with optional styling
  - `renderPolarSVG(data, options)` to produce SVG markup for polar plots with styling
- Provide type definitions or JSDoc comments for all exports including parameter types and return values.

# Implementation Details
- In `src/lib/main.js`, replace the placeholder main function with exports of the core helper functions currently embedded in `sandbox/source/main.js`:
  - Move `generatePlotData` and `generatePolarData` into library exports.
  - Implement `renderPlotSVG` and `renderPolarSVG` that accept data arrays and an options object containing range or viewBox and style keys, returning SVG strings.
- Update `package.json` to ensure `src/lib/main.js` is the module entrypoint for consumers.
- Ensure backward compatibility by preserving CLI behavior; consumers using `import { generatePlotData } from '@xn-intenton-z2a/repository0'` can call functions directly.

# Testing
- Add or update `tests/unit/lib-api.test.js`:
  - Test `generatePlotData` for known ranges and sample counts, asserting first and last points.
  - Test `generatePolarData` for both spiral and rose functions, verifying array length and point coordinates.
  - Test `renderPlotSVG` and `renderPolarSVG` return valid SVG strings containing `<svg>` and `<polyline>` or `<path>` elements based on the options provided.

# Documentation
- Update `README.md` to include a "Library API" section explaining how to import and use the exported functions, including example usage and parameter descriptions.
- Update `CONTRIBUTING.md` to remind contributors to add API exports to documentation.
- No changes to existing CLI or HTTP feature specs required.