# HTTP Server Data Export API

The CLI tool can run an HTTP server to expose data export endpoints.

## Starting the Server

```bash
node sandbox/source/main.js --serve [port]
```
default port: `3000`.

## Endpoints

### GET /plot-data

Exports plot data for `quadratic` or `sine` functions.

**Query parameters:**
- `function`: `quadratic` or `sine` (required)
- `range`: `<start,end>` range for x-axis (e.g., `0,10`) (required)
- `format`: `csv` or `json` (required)
- `output`: optional filename to save the data server-side.

**Response:**
- HTTP 200 with `Content-Type: text/csv` for CSV or `application/json` for JSON.
- Body contains exported data.

**Example:**
```bash
curl "http://localhost:3000/plot-data?function=sine&range=0,6.28&format=json"
```

### GET /polar-data

Exports polar plot data for `spiral` or `rose` functions.

**Query parameters:**
- `function`: `spiral` or `rose` (required)
- `radius-range`: `<rStart,rEnd>` e.g., `0,5` (required)
- `angle-range`: `<thetaStart,thetaEnd>` e.g., `0,6.28` (required)
- `format`: `csv` or `json` (required)
- `output`: optional filename to save the data server-side.

**Example:**
```bash
curl "http://localhost:3000/polar-data?function=rose&radius-range=0,1&angle-range=0,6.28&format=csv"
```

**Error Handling:**
- Returns 400 if required parameters are missing or invalid.
