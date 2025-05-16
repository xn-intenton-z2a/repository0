# HTTP Server Data Export API

This tool can spin up an HTTP server to expose endpoints for exporting plot and polar data, as well as retrieving metadata, help, and SVG images.

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

Generate and retrieve an SVG image for `quadratic` or `sine` functions with customization options.

**Query parameters:**

- `function`: `quadratic` or `sine` (required)
- `range`: `<start,end>` X-axis range (e.g., `0,10`) (required)
- `logScale`: `<x|y|both>` Apply base-10 log scaling on X axis, Y axis, or both (requires strictly positive range values) (optional)
- `resolution`: Number of sample_points (default: `100`)
- `strokeColor`: Stroke color (default: `black`)
- `strokeWidth`: Stroke width (default: `1`)
- `fillColor`: Fill color for the polyline (default: `none`)
- `backgroundColor`: Background color for SVG (optional)
- `title`: Add title annotation to SVG (optional)
- `xlabel`: X-axis label at bottom center (optional)
- `ylabel`: Y-axis label along left side (optional)
- `output`: Optional filename to save the SVG on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml`
- Body contains the SVG markup with customization applied

**Errors:**

- **400 Bad Request** if `logScale` has an invalid value or if any range values are non-positive when `logScale` is used.

**Example:**
```bash
curl "http://localhost:4000/plot?function=quadratic&range=0,5&resolution=25&strokeColor=green&strokeWidth=3&fillColor=none&backgroundColor=black&title=Title&xlabel=X&ylabel=Y&logScale=x"
```

### GET /polar

Generate and retrieve an SVG image for `spiral` or `rose` functions with customization options.

**Query parameters:**

- `function`: `spiral` or `rose` (required)
- `radius-range`: `<rStart,rEnd>` (required)
- `angle-range`: `<thetaStart,thetaEnd>` (required)
- `resolution`: Number of sample points (default: `100`)
- `strokeColor`: Stroke color (default: `black`)
- `strokeWidth`: Stroke width (default: `1`)
- `fillColor`: Fill color for the polyline (default: `none`)
- `backgroundColor`: Background color for SVG (optional)
- `title`: Add title annotation to SVG (optional)
- `xlabel`: X-axis label at bottom center (optional)
- `ylabel`: Y-axis label along left side (optional)
- `output`: Optional filename to save the SVG on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml`
- Body contains the SVG markup with customization applied

**Example:**
```bash
curl "http://localhost:4000/polar?function=rose&radius-range=0,1&angle-range=0,6.28&resolution=30&strokeColor=purple&strokeWidth=1.5&fillColor=cyan&backgroundColor=white&title=PolarTitle"
```