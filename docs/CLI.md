# Hello World CLI

The `repository0` command-line tool supports three modes: default, diagnostics, and serve.

## Default Mode

Usage:
```bash
npm run start
# or
node src/lib/main.js
```

Output:
```
Hello World
```

---

## Diagnostics Mode

Usage:
```bash
npm run diagnostics
# or
node src/lib/main.js --diagnostics [args...]
```

Example output:
```
Hello World
Node version: vX.Y.Z
Platform: <your-platform>
Args: ["arg1","arg2"]
```

---

## Serve Mode

Usage:
```bash
npm run serve
# or
node src/lib/main.js --serve
```

This starts an HTTP server on port `3000`. Send an HTTP GET request to `/`:

```bash
curl http://localhost:3000/
# Hello World
```

The server can be stopped programmatically by calling the returned server’s `close()` method.

---

## Programmatic Usage

You can import and call `main(args)` directly in your application:

```js
import { main } from "./src/lib/main.js";

// Start the server
const server = main(["--serve"]);
// ...
// Stop the server when done
server.close();
```
