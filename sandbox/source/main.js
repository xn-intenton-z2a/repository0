#!/usr/bin/env node
// sandbox/source/main.js
// CLI entrypoint with support for --help, --version, --mission, --plot, and --polar commands
import minimist from "minimist";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { main as echoMain } from "../../src/lib/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const argv = minimist(args, {
  boolean: ["help", "version", "mission"],
  string: ["plot", "range", "output", "polar", "radius-range", "angle-range", "resolution"],
  alias: { h: "help", v: "version", m: "mission" }
});

// Precedence: help > version > mission > polar > plot
if (argv.help) {
  showHelp();
} else if (argv.version) {
  showVersion();
} else if (argv.mission) {
  showMission();
} else if (argv.polar !== undefined) {
  handlePolar();
} else if (argv.plot !== undefined) {
  handlePlot();
} else {
  echoMain(args);
}

function showHelp() {
  const script = path.basename(process.argv[1]);
  console.log(
    `Usage: node ${script} [options]\n\nOptions:\n  --help              Show help information\n  --version           Show version number\n  --mission           Show mission statement\n  --plot              Generate SVG plot (quadratic or sine)\n  --polar             Generate SVG polar plot (spiral or rose)\n` +
    `  --range             Specify x-axis range for plot <start,end> (default: 0,10)\n` +
    `  --radius-range      Specify radius range for polar plot <rStart,rEnd> (default: 0,5)\n` +
    `  --angle-range       Specify angle range for polar plot <thetaStart,thetaEnd> (default: 0,6.28)\n` +
    `  --resolution        Specify number of sample points (default: 100)\n` +
    `  --output            Specify output filename for SVG (default: plot.svg or polar.svg)\n\nExamples:\n` +
    `  $ node ${script} --help\n` +
    `  $ node ${script} --version\n` +
    `  $ node ${script} --mission\n` +
    `  $ node ${script} --plot quadratic --range 0,10 --output plot.svg\n` +
    `  $ node ${script} --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 100 --output polar.svg\n` +
    `\nFor full mission statement see MISSION.md`
  );
}

function showVersion() {
  const pkgPath = path.resolve(__dirname, "../../package.json");
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(pkg.version);
  } catch (err) {
    console.error("Error reading version:", err);
    process.exit(1);
  }
}

function showMission() {
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = fs.readFileSync(missionPath, "utf8");
    const lines = content.split(/\r?\n/);
    // find first header
    const headerLine = lines.find((l) => l.startsWith("# "));
    // find first non-empty paragraph after header
    let paragraph = "";
    if (headerLine) {
      const startIdx = lines.indexOf(headerLine) + 1;
      for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          paragraph = lines[i];
          break;
        }
      }
    }
    if (headerLine && paragraph) {
      console.log(`${headerLine}\n\n${paragraph}`);
    } else {
      console.log(content);
    }
  } catch (err) {
    console.error("Error reading mission statement:", err);
    process.exit(1);
  }
}

function handlePolar() {
  const funcName = argv.polar;
  const supported = ["spiral", "rose"];
  if (!supported.includes(funcName)) {
    console.error(`Unsupported polar function: ${funcName}`);
    process.exit(1);
  }

  // Radius range
  let radiusRangeStr = "0,5";
  const rrIndex = args.indexOf("--radius-range");
  if (rrIndex !== -1 && args[rrIndex + 1] !== undefined) {
    radiusRangeStr = args[rrIndex + 1];
  } else if (argv["radius-range"]) {
    radiusRangeStr = argv["radius-range"];
  }
  const rrParts = radiusRangeStr.split(",");
  if (rrParts.length !== 2) {
    console.error(`Invalid radius range: ${radiusRangeStr}`);
    process.exit(1);
  }
  const rStart = parseFloat(rrParts[0]);
  const rEnd = parseFloat(rrParts[1]);
  if (isNaN(rStart) || isNaN(rEnd)) {
    console.error(`Invalid radius range numbers: ${radiusRangeStr}`);
    process.exit(1);
  }

  // Angle range
  let angleRangeStr = "0,6.28";
  const arIndex = args.indexOf("--angle-range");
  if (arIndex !== -1 && args[arIndex + 1] !== undefined) {
    angleRangeStr = args[arIndex + 1];
  } else if (argv["angle-range"]) {
    angleRangeStr = argv["angle-range"];
  }
  const arParts = angleRangeStr.split(",");
  if (arParts.length !== 2) {
    console.error(`Invalid angle range: ${angleRangeStr}`);
    process.exit(1);
  }
  const thetaStart = parseFloat(arParts[0]);
  const thetaEnd = parseFloat(arParts[1]);
  if (isNaN(thetaStart) || isNaN(thetaEnd)) {
    console.error(`Invalid angle range numbers: ${angleRangeStr}`);
    process.exit(1);
  }

  // Resolution
  const resIndex = args.indexOf("--resolution");
  let resolution = 100;
  if (resIndex !== -1 && args[resIndex + 1] !== undefined) {
    resolution = parseInt(args[resIndex + 1], 10);
  } else if (argv.resolution) {
    resolution = parseInt(argv.resolution, 10);
  }
  if (isNaN(resolution) || resolution <= 0) {
    console.error(`Invalid resolution: ${argv.resolution}`);
    process.exit(1);
  }

  // Output file
  const outputFile = argv.output || "polar.svg";

  // Compute Cartesian points
  const xs = [];
  const ys = [];
  for (let i = 0; i < resolution; i++) {
    const t = thetaStart + ((thetaEnd - thetaStart) * i) / (resolution - 1);
    let r;
    if (funcName === "spiral") {
      r = t;
    } else {
      // rose curve r = sin(2θ)
      r = Math.sin(2 * t);
    }
    // clamp radius
    r = Math.max(rStart, Math.min(r, rEnd));
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    xs.push(x);
    ys.push(y);
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}">\n` +
    `  <polyline fill="none" stroke="black" points="${points}" />\n` +
    `</svg>\n`;

  const outputPath = path.resolve(process.cwd(), outputFile);
  try {
    fs.writeFileSync(outputPath, svg, "utf8");
  } catch (err) {
    console.error("Error writing SVG file:", err);
    process.exit(1);
  }

  process.exit(0);
}

function handlePlot() {
  const funcName = argv.plot;
  const supported = ["quadratic", "sine"];
  if (!supported.includes(funcName)) {
    console.error(`Unsupported function: ${funcName}`);
    process.exit(1);
  }

  // Determine range string, prioritizing raw args for correct parsing of negative values
  let rangeStr = "0,10";
  const rangeIndex = args.indexOf("--range");
  if (rangeIndex !== -1 && args[rangeIndex + 1] !== undefined) {
    rangeStr = args[rangeIndex + 1];
  } else if (argv.range) {
    rangeStr = argv.range;
  }

  const parts = rangeStr.split(",");
  if (parts.length !== 2) {
    console.error(`Invalid range: ${rangeStr}`);
    process.exit(1);
  }
  const start = parseFloat(parts[0]);
  const end = parseFloat(parts[1]);
  if (isNaN(start) || isNaN(end)) {
    console.error(`Invalid range numbers: ${rangeStr}`);
    process.exit(1);
  }

  const outputFile = argv.output || "plot.svg";
  const samples = 100;
  const xs = [];
  const ys = [];
  for (let i = 0; i < samples; i++) {
    const x = start + ((end - start) * i) / (samples - 1);
    xs.push(x);
    ys.push(funcName === "quadratic" ? x * x : Math.sin(x));
  }

  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = end - start;
  const height = maxY - minY;
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  const svg =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${start} ${minY} ${width} ${height}">\n` +
    `  <polyline fill="none" stroke="black" points="${points}" />\n` +
    `</svg>\n`;

  const outputPath = path.resolve(process.cwd(), outputFile);
  try {
    fs.writeFileSync(outputPath, svg, "utf8");
  } catch (err) {
    console.error("Error writing SVG file:", err);
    process.exit(1);
  }

  process.exit(0);
}
