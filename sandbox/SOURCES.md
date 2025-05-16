# Node.js HTTP Module
## https://nodejs.org/api/http.html
The official Node.js documentation for the built-in `http` module covers creating and managing HTTP servers, handling requests and responses, streaming data, managing headers and status codes, and error handling. It provides essential technical specifications for building lightweight HTTP endpoints like `/plot`, `/polar`, `/plot-data`, and `/polar-data` as implemented in this repository’s CLI HTTP server. Last known update: April 18 2023. Authoritative: official Node.js docs.
## License
MIT (Node.js Project)

# Node.js FS Module
## https://nodejs.org/api/fs.html
Comprehensive guide to the built-in file system module for synchronous and asynchronous file operations: reading, writing, existence checks, and file descriptor handling. Critical for implementing commands that read/write SVG files, CSV/JSON exports, and reading mission and package files in CLI entrypoints. Last known update: April 18 2023.
## License
MIT (Node.js Project)

# Node.js Path Module
## https://nodejs.org/api/path.html
Utilities for filesystem path resolution, normalization, parsing, and joining. Fundamental for constructing and resolving file paths (`package.json`, `MISSION.md`, output files) across different platforms. Last known update: April 18 2023.
## License
MIT (Node.js Project)

# Node.js URL Module
## https://nodejs.org/api/url.html
Detailed reference for the WHATWG `URL` class in Node.js, covering URL parsing, formatting, and the integration with `URLSearchParams`. Enables robust query parameter handling for HTTP endpoints in the server implementation. Last known update: April 18 2023.
## License
MIT (Node.js Project)

# minimist
## https://www.npmjs.com/package/minimist
Lightweight command-line argument parser used to handle boolean and string flags, aliases, and default values. Understanding its API and option configuration is critical for extending or debugging command parsing (`--plot`, `--polar`, `--serve`, etc.). Latest version: 1.2.8 (Mar 2020).
## License
MIT

# MDN URL API
## https://developer.mozilla.org/en-US/docs/Web/API/URL
In-depth description of the browser and Node.js `URL` Web API: properties such as `pathname`, `searchParams`, and methods for URL manipulation. Useful for designing consistent request-parsing logic in server endpoints. Last reviewed: 2024.
## License
Creative Commons Attribution-ShareAlike 2.5 (CC BY-SA)

# MDN URLSearchParams
## https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
Documentation of the `URLSearchParams` interface for parsing, iterating, and serializing URL query parameters. Critical to correctly implement HTTP query parsing (`range`, `radius-range`, `angle-range`, etc.) in the server code. Last reviewed: 2024.
## License
Creative Commons Attribution-ShareAlike 2.5 (CC BY-SA)

# MDN SVG <svg> Element
## https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg
Reference for the root SVG element, covering attributes such as `xmlns`, `viewBox`, and layout properties. Essential for generating valid `<svg>` containers in both CLI and HTTP output. Last reviewed: 2024.
## License
Creative Commons Attribution-ShareAlike 2.5 (CC BY-SA)

# MDN SVG <polyline> Element
## https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline
Details on using the `<polyline>` element to render connected line sequences, including `points`, `stroke`, `stroke-width`, and `fill` attributes. Core to the repository’s SVG output implementation. Last reviewed: 2024.
## License
Creative Commons Attribution-ShareAlike 2.5 (CC BY-SA)

# Polar Coordinate System (Wikipedia)
## https://en.wikipedia.org/wiki/Polar_coordinate_system
Explains the mathematical principles behind polar coordinates, including conversion formulas (r, θ ➔ x, y). Provides the theoretical basis for generating polar data (`spiral`, `rose`) in code. License: CC BY-SA 3.0.
## License
Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA)

# RFC 4180 (CSV Format)
## https://tools.ietf.org/html/rfc4180
The IETF specification for CSV (Comma-Separated Values) file format, covering record layouts, escaping rules, and header rows. Ensures compliance when exporting data to `.csv` in both CLI and HTTP endpoints. Last updated: October 2005.
## License
IETF Trust License

# d3-shape: Line Generator
## https://github.com/d3/d3-shape#lines
Part of the D3.js library, the `d3-shape` module provides advanced line and curve generators with interpolation, tension, and path construction. Offers patterns for more sophisticated SVG path creation compared to manual `<polyline>` implementation. License: ISC.
## License
ISC

# Chart.js Documentation
## https://www.chartjs.org/docs/latest/
Comprehensive documentation for Chart.js, a popular client-side charting library supporting line, polar area, and more. Highlights best practices for data binding, responsive rendering, and customization that can inform future enhancements. Last release: 4.3.0 (2024).
## License
MIT

# Vega-Lite Documentation
## https://vega.github.io/vega-lite/docs/
High-level grammar for creating interactive visualizations, including line and polar area charts. Defines JSON schemas for chart specifications, encoding channels, and data transforms that can guide richer feature development. Last update: 2024.
## License
BSD-3-Clause