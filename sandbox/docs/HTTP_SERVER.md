# HTTP Server Data Export API

**Note:** The CLI `--features` command now includes `MISSION` and `MISSION-FULL` at the top of the feature list.

This tool can spin up an HTTP server to expose endpoints for exporting plot and polar data, as well as retrieving metadata, help, and SVG or HTML interactive pages.

## Starting the Server

```bash
node sandbox/source/main.js --serve [port]
```

- Default port: `4000`

## Endpoints

### GET /plot-data

Generate and retrieve plot data for `quadratic` or `sine` functions.

**Query parameters:**

- `function`: `quadratic` or `sine` (required)
- `range`: `<start,end>` range for X-axis (e.g., `0,10`) (required)
- `format`: `csv` or `json` (required)
- `output`: Optional filename to save the data on the server

**Response:**

- **200 OK** with `Content-Type: text/csv` for CSV or `application/json` for JSON
- Body contains the exported data

### GET /polar-data

Generate and retrieve polar plot data for `spiral` or `rose` functions.

**Query parameters:**

- `function`: `spiral` or `rose` (required)
- `radius-range`: `<rStart,rEnd>` e.g., `0,5` (required)
- `angle-range`: `<thetaStart,thetaEnd>` e.g., `0,6.28` (required)
- `format`: `csv` or `json` (required)
- `output`: Optional filename to save the data on the server

**Response:**

- **200 OK** with `Content-Type: text/csv` for CSV or `application/json` for JSON
- Body contains the exported data

### GET /plot

Generate and retrieve an SVG image or interactive HTML for `quadratic`, `sine`, or multiple functions with customization options.

**Query parameters:**

- `function`: `quadratic` or `sine` (required unless `plots` is used)
- `plots`: `<fn1,fn2,...>` Comma-separated list of functions to plot in one SVG (e.g., `quadratic,sine`) (optional; overrides `function`)
- `range`: `<start,end>` X-axis range (e.g., `0,10`) (required)
- `format`: `csv`, `json`, or `html` (optional; default SVG)
- `html`: shorthand alias for `format=html` (optional)
- `embedMission`: `true` to embed mission statement (optional)
- `embed-mission`: alias for `embedMission=true`
- `logScale`: `<x|y|both>` Apply base-10 log scaling on X axis, Y axis, or both (requires strictly positive range values) (optional)
- `width`: SVG width in pixels (default: `800`) (optional)
- `height`: SVG height in pixels (default: `600`) (optional)
- `resolution`: Number of sample points (default: `100`)
- `strokeColor`: Stroke color (default: `black`)
- `strokeWidth`: Stroke width (default: `1`)
- `fillColor`: Fill color for the polyline (default: `none`)
- `backgroundColor`: Background color for SVG (optional)
- `title`: Add title annotation to SVG (optional)
- `xlabel`: X-axis label at bottom center (optional)
- `ylabel`: Y-axis label along left side (optional)
- `output`: Optional filename to save the SVG or HTML on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml` for SVG or `text/html` for HTML
- Body contains the SVG markup with one or more `<polyline>` elements, or a complete HTML document when `format=html`

**Errors:**

- **400 Bad Request** if required parameters are missing, `format/html` options conflict, `logScale` has an invalid value, any range values are non-positive when `logScale` is used, or if any function name is unsupported.
- **400 Bad Request** if `width` or `height` parameters are non-positive or non-integer.

**Example HTML request:**
```bash
curl "http://localhost:4000/plot?function=quadratic&range=0,10&format=html&embedMission=true"
```

### GET /polar

Generate and retrieve an SVG image or interactive HTML for `spiral` or `rose` functions with customization options.

**Query parameters:**

- `function`: `spiral` or `rose` (required)
- `radius-range`: `<rStart,rEnd>` (required)
- `angle-range`: `<thetaStart,thetaEnd>` (required)
- `format`: `svg` or `html` (optional)
- `html`: shorthand alias for `format=html` (optional)
- `embedMission`: `true` to embed mission statement (optional)
- `embed-mission`: alias for `embedMission=true`
- `width`: SVG width in pixels (default: `800`) (optional)
- `height`: SVG height in pixels (default: `600`) (optional)
- `resolution`: Number of sample points (default: `100`)
- `strokeColor`: Stroke color (default: `black`)
- `strokeWidth`: Stroke width (default: `1`)
- `fillColor`: Fill color for the polyline (default: `none`)
- `backgroundColor`: Background color for SVG (optional)
- `title`: Add title annotation (optional)
- `xlabel`: X-axis label (optional)
- `ylabel`: Y-axis label (optional)
- `output`: Optional filename to save the SVG or HTML on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml` for SVG or `text/html` for HTML
- Body contains the SVG markup or a complete HTML document with appropriate `<polyline>` and `<script>` elements.

**Errors:**

- **400 Bad Request** if `width` or `height` parameters are non-positive or non-integer.
