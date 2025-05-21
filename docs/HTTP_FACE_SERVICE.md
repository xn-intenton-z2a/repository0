# HTTP Face Service

Add an HTTP API to serve ASCII faces alongside the existing CLI.

## CLI Usage

```bash
# Start HTTP server (default port 3000)
npm run serve

# Or specify a custom port
npm run serve -- --port 5000

# With custom configuration
npm run serve -- --config custom.json --port 4000

# Or via the start script:
npm run start -- --serve --config custom.json --port 4000
```

## HTTP Endpoints

- **GET /** or **GET /face?emotion=<emotion>**: returns the ASCII art face as plain text
- **GET /emotions**: returns a JSON array of supported emotion keywords
- **GET /random**: returns an ASCII art face chosen at random from default and custom emotions with header `Content-Type: text/plain; charset=utf-8`

Both endpoints honor the optional `emotion` query parameter. If missing or unrecognized, the **neutral** face is returned—except `/random`, which always selects randomly.

### `/emotions` Endpoint

Returns a JSON array of supported emotion keywords:

```bash
curl -i http://localhost:3000/emotions
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

["happy","sad","surprised","angry","neutral"]
```

### `/random` Endpoint

Returns a random ASCII face with header `Content-Type: text/plain; charset=utf-8`:

```bash
curl -i http://localhost:3000/random
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

  ^_^
```

### Face Endpoints

Responses for `/` and `/face` are served with header `Content-Type: text/plain; charset=utf-8` and include the ASCII art face:

| Emotion   | Response Body |
| --------- | ------------- |
| happy     |  ^_^          |
| sad       |  T_T          |
| surprised |  O_O          |
| angry     |  >:(          |
| neutral*  |  -_-          |

*When `emotion` is missing or unrecognized, the neutral face is returned.

## Custom Configuration

Custom JSON or YAML configuration files can be provided using the `--config <path>` flag when starting the server. Custom definitions override defaults, and defaults fill in any missing emotions.

## Invalid Paths

Any request to an unsupported path returns HTTP 404 with plain text "Not Found".

## Metrics Endpoint

The `/metrics` endpoint exposes Prometheus-compatible metrics for monitoring usage statistics in the Prometheus exposition format.

### **GET /metrics**

Returns HTTP 200 with `Content-Type: text/plain; charset=utf-8` and a body containing metrics such as:

- **faces_served_total**: Counter of total face responses served
- **http_requests_total{endpoint,emotion}**: Counter of HTTP requests labeled by endpoint path and emotion served (using `""` for non-face endpoints or `"neutral"` for unknown emotions)

### Example Metrics Output

```bash
$ curl -i http://localhost:3000/metrics
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

# HELP faces_served_total Total number of faces served
# TYPE faces_served_total counter
faces_served_total 3
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{endpoint="/",emotion="neutral"} 1
http_requests_total{endpoint="/face",emotion="happy"} 1
http_requests_total{endpoint="/random",emotion="surprised"} 1
http_requests_total{endpoint="/emotions",emotion=""} 1
http_requests_total{endpoint="/invalid",emotion="neutral"} 1
```
