#!/usr/bin/env node
import minimist from "minimist";
import http from "http";
import { URL } from "url";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { evaluate } from "mathjs";

/**
 * Choose a random house, optionally using a seed for deterministic output.
 * @param {string[]} houses - Array of house names
 * @param {number} [seed] - Optional numeric seed for reproducibility
 * @returns {string} - Selected house
 */
function chooseHouse(houses, seed) {
  if (!Array.isArray(houses) || houses.length === 0) {
    throw new Error("Houses must be a non-empty array");
  }
  let random = Math.random;
  if (seed !== undefined) {
    const m = 0x80000000; // 2^31
    const a = 1103515245;
    const c = 12345;
    let state = seed % m;
    random = function () {
      state = (a * state + c) % m;
      return state / m;
    };
  }
  const index = Math.floor(random() * houses.length);
  return houses[index];
}

/**
 * Generate SVG markup for a quadratic curve y = a*x^2 + b*x + c
 * over the domain [-10, 10].
 */
function generateQuadraticSVG(a, b, c, width, height) {
  const xMin = -10;
  const xMax = 10;
  const N = 100;
  const points = [];
  for (let i = 0; i < N; i++) {
    const x = xMin + (i * (xMax - xMin)) / (N - 1);
    const y = a * x * x + b * x + c;
    points.push({ x, y });
  }
  const yValues = points.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const svgPoints = points
    .map((p) => {
      const xPixel = ((p.x - xMin) / (xMax - xMin)) * width;
      const yPixel = height - ((p.y - yMin) / (yMax - yMin)) * height;
      return `${xPixel},${yPixel}`;
    })
    .join(" ");
  const y0Pixel = height - ((0 - yMin) / (yMax - yMin)) * height;
  const x0Pixel = ((0 - xMin) / (xMax - xMin)) * width;
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="${y0Pixel}" x2="${width}" y2="${y0Pixel}" stroke="grey"/>
  <line x1="${x0Pixel}" y1="0" x2="${x0Pixel}" y2="${height}" stroke="grey"/>
  <polyline fill="none" stroke="black" points="${svgPoints}"/>
</svg>`;
}

/**
 * Generate SVG markup for a sine wave y = amplitude * sin(frequency * x)
 * over the domain [-10, 10].
 */
function generateSineSVG(frequency, amplitude, width, height) {
  const xMin = -10;
  const xMax = 10;
  const N = 100;
  const points = [];
  for (let i = 0; i < N; i++) {
    const x = xMin + (i * (xMax - xMin)) / (N - 1);
    const y = amplitude * Math.sin(frequency * x);
    points.push({ x, y });
  }
  const yMin = -amplitude;
  const yMax = amplitude;
  const svgPoints = points
    .map((p) => {
      const xPixel = ((p.x - xMin) / (xMax - xMin)) * width;
      const yPixel = height - ((p.y - yMin) / (yMax - yMin)) * height;
      return `${xPixel},${yPixel}`;
    })
    .join(" ");
  const y0Pixel = height - ((0 - yMin) / (yMax - yMin)) * height;
  const x0Pixel = ((0 - xMin) / (xMax - xMin)) * width;
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="${y0Pixel}" x2="${width}" y2="${y0Pixel}" stroke="grey"/>
  <line x1="${x0Pixel}" y1="0" x2="${x0Pixel}" y2="${height}" stroke="grey"/>
  <polyline fill="none" stroke="black" points="${svgPoints}"/>
</svg>`;
}

/**
 * Generate SVG markup for an arbitrary expression y = f(x)
 * over a specified domain.
 */
function generateExpressionSVG(expr, xMin, xMax, samples, width, height) {
  const points = [];
  for (let i = 0; i < samples; i++) {
    const x = xMin + (i * (xMax - xMin)) / (samples - 1);
    let y;
    try {
      y = evaluate(expr, { x });
    } catch (err) {
      throw new Error(`Invalid expression: ${err.message}`);
    }
    points.push({ x, y });
  }
  const yValues = points.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const svgPoints = points
    .map((p) => {
      const xPixel = ((p.x - xMin) / (xMax - xMin)) * width;
      const yPixel = height - ((p.y - yMin) / (yMax - yMin)) * height;
      return `${xPixel},${yPixel}`;
    })
    .join(" ");
  const y0Pixel = height - ((0 - yMin) / (yMax - yMin)) * height;
  const x0Pixel = ((0 - xMin) / (xMax - xMin)) * width;
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <line x1="0" y1="${y0Pixel}" x2="${width}" y2="${y0Pixel}" stroke="grey"/>
  <line x1="${x0Pixel}" y1="0" x2="${x0Pixel}" y2="${height}" stroke="grey"/>
  <polyline fill="none" stroke="black" points="${svgPoints}"/>
</svg>`;
}

/**
 * Main entrypoint for CLI commands.
 * Accepts an optional array of args for testing.
 * @param {string[]} [inputArgs] - Arguments to parse (default: process.argv.slice(2))
 */
async function main(inputArgs) {
  const argv = minimist(
    inputArgs !== undefined ? inputArgs : process.argv.slice(2),
    { boolean: ["list"], alias: { l: "list" } }
  );
  const [command, ...args] = argv._;

  switch (command) {
    case "help":
    case undefined:
      printHelp();
      break;
    case "mission":
      await printMission();
      break;
    case "version":
      await printVersion();
      break;
    case "echo":
      printEcho(args);
      break;
    case "house-choice": {
      const houses = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];
      if (argv.list) {
        console.log(houses.join("\n"));
      } else {
        const seed = argv.seed !== undefined ? Number(argv.seed) : undefined;
        const chosen = chooseHouse(houses, seed);
        console.log(chosen);
      }
      break;
    }
    case "plot-quadratic": {
      const a = argv.a !== undefined ? Number(argv.a) : 1;
      const b = argv.b !== undefined ? Number(argv.b) : 0;
      const c = argv.c !== undefined ? Number(argv.c) : 0;
      const output = argv.output || "plot.svg";
      const svg = generateQuadraticSVG(a, b, c, 500, 500);
      try {
        await writeFile(output, svg, "utf-8");
        console.log(`Plot written to ${output}`);
      } catch (err) {
        console.error(`Error writing file: ${err.message}`);
        process.exit(1);
      }
      break;
    }
    case "plot-sine": {
      const frequency = argv.frequency !== undefined ? Number(argv.frequency) : 1;
      const amplitude = argv.amplitude !== undefined ? Number(argv.amplitude) : 1;
      const output = argv.output || "plot.svg";
      const svg = generateSineSVG(frequency, amplitude, 500, 500);
      try {
        await writeFile(output, svg, "utf-8");
        console.log(`Plot written to ${output}`);
      } catch (err) {
        console.error(`Error writing file: ${err.message}`);
        process.exit(1);
      }
      break;
    }
    case "plot-server": {
      const port = argv.port !== undefined ? Number(argv.port) : 3000;
      const host = argv.host || "localhost";
      const server = http.createServer(async (req, res) => {
        try {
          const reqUrl = new URL(req.url, `http://${host}:${port}`);
          if (req.method !== "GET" || reqUrl.pathname !== "/plot") {
            res.statusCode = 404;
            res.end("Not Found");
            return;
          }
          const params = reqUrl.searchParams;
          const type = params.get("type");
          if (!type) throw new Error("Missing required parameter: type");
          let svg;
          const width = params.has("width") ? Number(params.get("width")) : 500;
          const height = params.has("height") ? Number(params.get("height")) : 500;
          if (type === "quadratic") {
            const a = params.has("a") ? Number(params.get("a")) : undefined;
            const b = params.has("b") ? Number(params.get("b")) : undefined;
            const c = params.has("c") ? Number(params.get("c")) : undefined;
            if (a === undefined || b === undefined || c === undefined) throw new Error("Missing quadratic parameters a, b, c");
            svg = generateQuadraticSVG(a, b, c, width, height);
          } else if (type === "sine") {
            const frequency = params.has("frequency") ? Number(params.get("frequency")) : undefined;
            const amplitude = params.has("amplitude") ? Number(params.get("amplitude")) : undefined;
            if (frequency === undefined || amplitude === undefined) throw new Error("Missing sine parameters frequency, amplitude");
            svg = generateSineSVG(frequency, amplitude, width, height);
          } else if (type === "expression") {
            const expr = params.get("expr");
            const domain = params.get("domain");
            const samples = params.has("samples") ? Number(params.get("samples")) : undefined;
            if (!expr || !domain || samples === undefined) throw new Error("Missing expression parameters expr, domain, samples");
            const [xMin, xMax] = domain.split(",").map(Number);
            if (isNaN(xMin) || isNaN(xMax)) throw new Error("Invalid domain parameter");
            svg = generateExpressionSVG(expr, xMin, xMax, samples, width, height);
          } else {
            throw new Error(`Unsupported type: ${type}`);
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "image/svg+xml");
          res.end(svg);
        } catch (err) {
          res.statusCode = 400;
          res.end(`Error: ${err.message}`);
        }
      });
      // Await server listening
      await new Promise((resolve, reject) => {
        server.listen(port, host, () => {
          const actualPort = server.address().port;
          console.log(`Server running at http://${host}:${actualPort}`);
          resolve();
        });
        server.on("error", reject);
      });
      if (inputArgs !== undefined) {
        return server;
      } else {
        // Keep server running indefinitely
        await new Promise(() => {});
      }
      break;
    }
    default:
      console.log(`Unknown command: ${command}`);
      printHelp();
      break;
  }
}

/**
 * Print help text for available commands.
 */
function printHelp() {
  const scriptName = path.basename(process.argv[1]);
  console.log(`Usage: ${scriptName} <command> [arguments]`);
  console.log(`Commands:`);
  console.log(`  help             Show this help message`);
  console.log(`  mission          Print the mission statement`);
  console.log(`  version          Print the version from package.json`);
  console.log(`  echo             Echo the provided arguments`);
  console.log(`  house-choice     Randomly choose a house or list all houses`);
  console.log(`  plot-quadratic   Generate a quadratic plot as SVG`);
  console.log(`  plot-sine        Generate a sine wave plot as SVG`);
  console.log(`  plot-server      Start HTTP server to serve SVG plots`);
}

/**
 * Read and print the mission statement.
 */
async function printMission() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = await readFile(missionPath, "utf-8");
    console.log(content.trim());
  } catch (err) {
    console.error(`Error reading mission: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Read and print the package version.
 */
async function printVersion() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const pkgPath = path.resolve(__dirname, "../../package.json");
  try {
    const content = await readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(content);
    console.log(pkg.version);
  } catch (err) {
    console.error(`Error reading version: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Echo provided arguments.
 * @param {string[]} args
 */
function printEcho(args) {
  console.log(args.join(" "));}

// If run directly, execute main
if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { main, chooseHouse };