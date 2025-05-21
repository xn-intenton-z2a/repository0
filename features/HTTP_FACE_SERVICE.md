# HTTP Face Service

## Overview
Extend the existing HTTP Face Service to include a browsable HTML endpoint. Clients can now retrieve ASCII art faces wrapped in a minimal HTML page, making it easier to view faces in a browser.

## CLI Interface
- Preserve all existing `--serve` and `--port` usage for starting the HTTP server.
- No changes to invocation; HTML endpoint is exposed alongside plain-text endpoints when the server is running.

## HTTP Interface
- Existing endpoints remain:
  - GET `/` or `/face?emotion=<emotion>` returns ASCII face as plain text
  - GET `/emotions` returns a JSON array of supported emotion keywords
- New endpoint:
  - GET `/html` or `/html?emotion=<emotion>` returns an HTML page embedding the ASCII art face inside a `<pre>` element
  - If `emotion` parameter is missing or unknown, the neutral face is used
  - Response headers: `Content-Type: text/html; charset=utf-8`

## Source Modifications
- Import and configure EJS (already a dependency) in `src/lib/main.js`
- Add a route handler in the HTTP server block for path `/html`:
  - Render a simple EJS template string that inserts the selected face into a `<pre>` tag
  - Example template:
    ```ejs
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><title>ASCII Face</title></head>
    <body><pre><%= face %></pre></body>
    </html>
    ```
- Ensure both `/html` and `/html?emotion=<emotion>` paths route correctly
- No changes to CLI or list modes

## Tests
- Add a new test suite "HTML Interface" in `tests/unit/main.test.js`
- Start server on an ephemeral port using `main(["--serve","--port","0"])`
- For emotion test cases (happy, sad, angry, etc.):
  - Send HTTP GET to `/html?emotion=<emotion>`
  - Assert status 200, `content-type` matches `text/html`, and response body contains `<pre>` with the correct ASCII face
- Test fallback:
  - GET `/html` without emotion returns neutral face
  - GET `/html?emotion=unknown` returns neutral face

## Documentation
- Update `README.md` under HTTP Server Mode to document the new `/html` endpoint with curl examples:
  ```bash
  curl -i "http://localhost:3000/html?emotion=happy"
  ```
- Update `docs/HTTP_FACE_SERVICE.md`:
  - Add section for HTML endpoint
  - Show sample HTML response snippet and usage examples
