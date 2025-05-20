# HTTP Face Service

Add an HTTP API to serve ASCII faces alongside the existing CLI.

## CLI Usage

Start the HTTP server (default port 3000):
```bash
npm run serve
```
Or with explicit flags:
```bash
npm run start -- --serve
npm run start -- --serve --port 4000
# or
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

Responses are served with header `Content-Type: text/plain` and include the ASCII art face:

| Emotion   | Response Body  |
| --------- | -------------- |
| happy     |  ^_^           |
| sad       |  T_T           |
| surprised |  O_O           |
| angry     |  >:(           |
| neutral*  |  -_-           |

*When `emotion` is missing or unrecognized, the neutral face is returned.

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

# Custom port
curl "http://localhost:4000?emotion=surprised"

  O_O
```