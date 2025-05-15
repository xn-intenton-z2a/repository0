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

Generate and retrieve an SVG image for `quadratic` or `sine` functions.

**Query parameters:**

- `function`: `quadratic` or `sine` (required)
- `range`: `<start,end>` X-axis range (e.g., `0,10`) (required)
- `resolution`: Number of sample points (default: `100`)
- `output`: Optional filename to save the SVG on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml`
- Body contains the SVG markup with a `<polyline>` element

### GET /polar

Generate and retrieve an SVG image for `spiral` or `rose` functions.

**Query parameters:**

- `function`: `spiral` or `rose` (required)
- `radius-range`: `<rStart,rEnd>` (required)
- `angle-range`: `<thetaStart,thetaEnd>` (required)
- `resolution`: Number of sample points (default: `100`)
- `output`: Optional filename to save the SVG on the server

**Response:**

- **200 OK** with `Content-Type: image/svg+xml`
- Body contains the SVG markup with a `<polyline>` element

### GET /mission

Retrieve the brief mission statement (header and first paragraph) from the project.

**Query parameters:** None

**Response:**

- **200 OK** with `Content-Type: text/plain`
- Body contains the mission header and first paragraph

**Example:**
```bash
curl "http://localhost:4000/mission"
```

### GET /version

Retrieve the current version number from `package.json`.

**Query parameters:** None

**Response:**

- **200 OK** with `Content-Type: text/plain`
- Body contains the version string

**Example:**
```bash
curl "http://localhost:4000/version"
```

### GET /help

Retrieve the CLI usage guide (same text as the `--help` command).

**Query parameters:** None

**Response:**

- **200 OK** with `Content-Type: text/plain`
- Body contains the usage instructions

**Example:**
```bash
curl "http://localhost:4000/help"
```

### Error Handling

- **400 Bad Request** if required parameters are missing or invalid
- **404 Not Found** for unsupported endpoints
