import http from "http";
import { z } from "zod";

/**
 * Handles the 'start' command by logging provided arguments.
 * @param {string[]} args
 */
export function startHandler(args) {
  console.log(`Run with: ${JSON.stringify(args)}`);
}

/**
 * Handles the 'diagnostics' command by logging Node version, platform, and memory usage.
 */
export function diagnosticsHandler() {
  const version = process.version;
  const platform = process.platform;
  const memory = process.memoryUsage();
  console.log(
    `Node: ${version}, Platform: ${platform}, MemoryUsage: ${JSON.stringify(memory)}`
  );
}

/**
 * Handles the 'serve' command by starting an HTTP server on port 3000.
 * Responds to GET /health with { status: 'ok' }.
 * @returns {Promise<http.Server>}
 */
export function serveHandler() {
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: 'ok' }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  // Graceful shutdown
  const shutdown = () => {
    server.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(3000, () => resolve(server));
  });
}

/**
 * Main entrypoint for CLI.
 * @param {string[]} [args]
 */
export default async function main(args = process.argv.slice(2)) {
  const [first, ...rest] = args;
  const cmd = first || "start";

  // Validate command
  const subcommandSchema = z.enum(["start", "diagnostics", "serve"]);
  const parsed = subcommandSchema.safeParse(cmd);
  if (!parsed.success) {
    throw new Error(`Unrecognized command: ${cmd}`);
  }
  const command = parsed.data;

  switch (command) {
    case "start":
      return startHandler(rest);
    case "diagnostics":
      return diagnosticsHandler();
    case "serve":
      return serveHandler();
    default:
      // Should never reach here
      throw new Error(`Unrecognized command: ${cmd}`);
  }
}
