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

Both endpoints honor the optional `emotion` query parameter. If missing or unrecognized, the **neutral** face is returned.

### `/emotions` Endpoint

Returns a JSON array of supported emotion keywords:

```bash
curl -i http://localhost:3000/emotions
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

["happy","sad","surprised","angry","neutral"]
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

## Examples

```bash
# Default neutral face
curl "http://localhost:3000"
  -_-

# Specified emotion
curl "http://localhost:3000?emotion=happy"
  ^_^

# Using /face path
curl "http://localhost:3000/face?emotion=angry"
  >:(

# With custom config and custom emotion
# (server must be started with --config custom.json)
curl "http://localhost:3000?emotion=confused"
  o_O

# List emotions
curl -i "http://localhost:3000/emotions"
  ["happy","sad","surprised","angry","neutral"]
```