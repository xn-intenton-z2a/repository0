# HTTP Server Data Export API

This tool can spin up an HTTP server to expose endpoints for exporting plot and polar data.

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

### Error Handling

- **400 Bad Request** if required parameters are missing or invalid
- **404 Not Found** for other endpoints