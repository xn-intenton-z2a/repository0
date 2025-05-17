#!/usr/bin/env node
// sandbox/source/main.js

import minimist from "minimist";
import fs from "fs";
import path from "path";
import process from "process";

// Parse CLI arguments
const rawArgs = process.argv.slice(2);
const argv = minimist(rawArgs, {
  string: ["xmin", "xmax", "output"],
  boolean: ["help", "h", "version", "v", "mission"],
  alias: { help: "h", version: "v" },
  default: { xmin: -10, xmax: 10, samples: 100 }
});

// Global flags
if (argv.help) {
  const usage = [
    "Usage: node sandbox/source/main.js [options] [arguments]",
    "",
    "Options:",
    "  --help (alias -h)      Show help",
    "  --version (alias -v)   Print version",
    "  --mission              Print mission statement",
    "",
    "Commands:",
    "  plot <function>        Plot function 'quadratic' or 'sine'",
    "",
    "Plot Options:",
    "  --xmin <number>        Lower bound of x-axis (default -10)",
    "  --xmax <number>        Upper bound of x-axis (default 10)",
    "  --samples <number>     Number of samples (default 100)",
    "  --output <filepath>    Output SVG file path",
    "",
    "Default behavior:",
    "  Echo arbitrary arguments"
  ].join("\n");
  console.log(usage);
  process.exit(0);
}

if (argv.version) {
  // read version from package.json
  try {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(pkg.version);
    process.exit(0);
  } catch (err) {
    console.error(`Error reading version: ${err.message}`);
    process.exit(1);
  }
}

if (argv.mission) {
  try {
    const mission = fs.readFileSync(path.resolve(process.cwd(), "MISSION.md"), "utf8");
    console.log(mission);
    process.exit(0);
  } catch (err) {
    console.error(`Error reading mission: ${err.message}`);
    process.exit(1);
  }
}

// Handle plot subcommand
const [command, functionName] = argv._;
if (command === "plot") {
  if (!functionName) {
    console.error("Function name is required for plot subcommand.");
    process.exit(1);
  }

  const supported = ["quadratic", "sine"];
  if (!supported.includes(functionName)) {
    console.error(`Unsupported function: ${functionName}`);
    process.exit(1);
  }

  const xMin = Number(argv.xmin);
  const xMax = Number(argv.xmax);
  const samples = Number(argv.samples);
  const output = argv.output;

  // Generate data points
  const raw = [];
  for (let i = 0; i <= samples; i++) {
    const x = xMin + (i * (xMax - xMin)) / samples;
    let y;
    if (functionName === "quadratic") {
      y = x * x;
    } else {
      y = Math.sin(x);
    }
    raw.push({ x, y });
  }

  // Determine y range
  const yValues = raw.map((p) => p.y);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  // SVG parameters
  const width = 400;
  const height = 200;
  const margin = 20;

  // Map points to SVG coordinates
  const svgPoints = raw
    .map((p) => {
      const xSvg = ((p.x - xMin) / (xMax - xMin)) * (width - 2 * margin) + margin;
      const ySvg =
        height -
        margin -
        ((p.y - yMin) / (yMax - yMin || 1)) * (height - 2 * margin);
      return `${xSvg},${ySvg}`;
    })
    .join(" ");

  // Build SVG markup
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<polyline id="${functionName}" fill="none" stroke="black" points="${svgPoints}" />` +
    `</svg>`;

  if (output) {
    try {
      fs.writeFileSync(output, svg, "utf8");
      process.exit(0);
    } catch (err) {
      console.error(`Error writing file: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(svg);
    process.exit(0);
  }
}

// Default echo behavior
console.log(`Run with: ${JSON.stringify(argv._)}`);
