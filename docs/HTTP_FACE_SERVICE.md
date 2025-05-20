# HTTP Face Service

Add an HTTP API to serve ASCII faces alongside the existing CLI.

## CLI Usage

Start the HTTP server with optional custom configuration (default port 3000):
```bash
npm run start -- --serve --config custom.json --port 3000
```

Or without custom config (defaults only):
```bash
npm run serve
npm run start -- --serve
npm run serve -- --port 5000
```

## HTTP Endpoints

- **GET /**
- **GET /face**

Both endpoints accept an optional query parameter `emotion`:
```
GET /?emotion=happy
GET /face?emotion=sad
```

Responses are served with header `Content-Type: text/plain; charset=utf-8` and include the ASCII art face:

| Emotion   | Response Body  |
| --------- | -------------- |
| happy     |  ^_^           |
| sad       |  T_T           |
| surprised |  O_O           |
| angry     |  >:(           |
| neutral*  |  -_-           |

*When `emotion` is missing or unrecognized, the neutral face is returned.

Custom configuration applies equally in server mode, merging your config file with defaults.

Invalid Paths:
Any other path returns HTTP 404 with plain text "Not Found".

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

# Invalid path
curl -i http://localhost:3000/unknown
```