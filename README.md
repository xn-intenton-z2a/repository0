# ASCII Face CLI and HTTP Service

A simple CLI application and HTTP server that renders ASCII art faces representing emotions. Supports custom configurations, listing available emotions, a diagnostics mode for runtime metadata, and a browsable HTML endpoint.

## Mission

Creates a CLI app and HTTP service that depicts emotion using facial expressions in ASCII art. See [MISSION.md](MISSION.md) for full mission details.

## Features

- CLI rendering of predefined emotions: **happy**, **sad**, **surprised**, **angry**, **neutral**
- Custom configuration via JSON or YAML to define additional emotion mappings
- List available emotions in CLI mode
- HTTP server mode to serve faces over HTTP
- `/html` endpoint to view faces in a browser
- Diagnostics mode outputs runtime metadata as JSON and exits

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

- **GET /** or **GET /face?emotion=<emotion>**: returns the ASCII art face as plain text
- **GET /emotions**: returns a JSON array of supported emotion keywords
- **GET /html** or **GET /html?emotion=<emotion>**: returns an HTML page embedding the ASCII art face inside a `<pre>` block; Content-Type `text/html; charset=utf-8`; falls back to neutral

#### HTML Endpoint Example

```bash
curl -i "http://localhost:3000/html?emotion=happy"
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) and the [Agentic-Lib repository](https://github.com/xn-intenton-z2a/agentic-lib) for guidelines.

## License

This project is licensed under the Apache-2.0 License. See [LICENSE.md](LICENSE.md) for details.
