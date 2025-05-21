# ASCII Face CLI and HTTP Service

A simple CLI application and HTTP server that renders ASCII art faces representing emotions. Supports custom configurations, listing available emotions, random face selection, Prometheus-compatible metrics, and a diagnostics mode for runtime metadata.

## Mission

Creates a CLI app and HTTP service that depicts emotion using facial expressions in ASCII art. See [MISSION.md](MISSION.md) for full mission details.

## Features

- CLI rendering of predefined emotions: **happy**, **sad**, **surprised**, **angry**, **neutral**
- Custom configuration via JSON or YAML to define additional emotion mappings
- List available emotions in CLI mode
- Random face selection in CLI and HTTP modes
- HTTP server mode to serve faces over HTTP
- Prometheus-compatible metrics exposed at `/metrics` in HTTP server mode
- Diagnostics mode outputs runtime metadata as JSON and exits
- Merges custom and default emotions across all modes

## Installation

```bash
git clone <repository_url>
cd repository0
npm install
```

## CLI Usage

Render an emotion:

```bash
npm run start -- --emotion happy
# or shorthand form
npm run start -- happy
```

List available emotions:

```bash
npm run start -- --list-emotions
npm run start -- --list
```

Select a random face:

```bash
npm run start -- --random
```

Use a custom configuration file:

```bash
npm run start -- --config custom.json confused
```

Diagnostics mode (outputs JSON and exits):

```bash
npm run start -- --diagnostics
```

### CLI Examples

```bash
$ npm run start -- happy
  ^_^

$ npm run start -- --config custom.json surprised
  O_O

$ npm run start -- --list
["happy","sad","surprised","angry","neutral","confused"]

$ npm run start -- --random
  >:(

$ npm run start -- --diagnostics
{
  "version": "1.2.0-0",
  "defaultEmotions": ["happy","sad","surprised","angry","neutral"],
  "loadedConfigPath": null,
  "customEmotionsCount": 0,
  "serveMode": false,
  "listMode": false
}
```

## HTTP Server Mode

Start the HTTP server (default port 3000):

```bash
npm run serve
```

Specify a custom port or configuration:

```bash
npm run serve -- --port 5000
npm run serve -- --config custom.json --port 4000
# or via start script:
npm run start -- --serve --config custom.json --port 4000
```

### HTTP Endpoints

- **GET /** or **GET /face?emotion=<emotion>**: returns the ASCII art face as plain text (`Content-Type: text/plain; charset=utf-8`)
- **GET /emotions**: returns a JSON array of supported emotion keywords (`Content-Type: application/json; charset=utf-8`)
- **GET /random**: returns a random ASCII art face as plain text (`Content-Type: text/plain; charset=utf-8`)
- **GET /metrics**: returns Prometheus-compatible metrics including `faces_served_total` and `http_requests_total{endpoint,emotion}` (`Content-Type: text/plain; charset=utf-8`)

### Example Metrics Output

```bash
curl -i http://localhost:3000/metrics
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

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Agentic-Lib repository](https://github.com/xn-intenton-z2a/agentic-lib) for guidelines.

## License

This project is licensed under the Apache-2.0 License. See [LICENSE.md](LICENSE.md) for details.
