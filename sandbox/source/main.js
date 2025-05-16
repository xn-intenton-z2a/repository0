#!/usr/bin/env node
// sandbox/source/main.js
// CLI entrypoint with support for --help, --version, --mission, --mission-full, --features, --plot, --polar, --export-data, --serve commands and log-scale option

import minimist from "minimist";
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { main as echoMain } from "../../src/lib/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const argv = minimist(args, {
  boolean: ["help", "version", "mission", "mission-full", "features"],
  string: [
    "plot",
    "range",
    "output",
    "polar",
    "radius-range",
    "angle-range",
    "resolution",
    "export-data",
    "serve",
    "stroke-color",
    "strokeColor",
    "stroke-width",
    "strokeWidth",
    "fill-color",
    "fillColor",
    "background-color",
    "backgroundColor",
    "title",
    "xlabel",
    "ylabel",
    "log-scale",
    "width",
    "height"
  ],
  alias: { h: "help", v: "version", m: "mission" }
});

// Precedence: help > version > mission-full > mission > features > serve > polar > plot
if (argv.help) {
  showHelp();
} else if (argv.version) {
  showVersion();
} else if (argv["mission-full"]) {
  showFullMission();
} else if (argv.mission) {
  showMission();
} else if (argv.features) {
  handleFeatures();
} else if (argv.serve !== undefined) {
  startServer();
} else if (argv.polar !== undefined) {
  handlePolar();
} else if (argv.plot !== undefined) {
  handlePlot();
} else {
  echoMain(args);
}

function getHelpText() {
  const script = path.basename(process.argv[1]);
  return [
    `Usage: node ${script} [options]`,
    "",
    "Options:",
    "  --help              Show help information",
    "  --version           Show version number",
    "  --mission           Show mission statement",
    "    --mission-full      Show full mission statement",
    "  --features          Show list of all available sandbox features",
    "  --serve [port]      Start HTTP server (default: 4000)",
    "  --plot              Generate SVG plot (quadratic or sine)",
    "  --range             Specify x-axis range for plot <start,end> (default: 0,10)",
    "  --log-scale         Apply base-10 log scaling on X axis, Y axis, or both (requires strictly positive range values)",
    "  --width             Specify SVG width in pixels (default: 800)",
    "  --height            Specify SVG height in pixels (default: 600)",
    "  --polar             Generate SVG polar plot (spiral or rose)",
    "  --radius-range      Specify radius range for polar plot <rStart,rEnd> (default: 0,5)",
    "  --angle-range       Specify angle range for polar plot <thetaStart,thetaEnd> (default: 0,6.28)",
    "  --resolution        Specify number of sample points (default: 100)",
    "  --stroke-color      Set stroke color for plot (default: black)",
    "  --stroke-width      Set stroke width for plot (default: 1)",
    "  --fill-color        Set fill color for plot (default: none)",
    "  --background-color  Set background color for SVG (optional)",
    "  --title             Add title annotation to SVG",
    "  --xlabel            Add X-axis label (CLI and HTTP only)",
    "  --ylabel            Add Y-axis label (CLI and HTTP only)",
    "  --output            Specify output filename for SVG (default: plot.svg or polar.svg)",
    "  --export-data       Export data as CSV or JSON (takes precedence)",
    "",
    "Examples:",
    `  $ node ${script} --help`,
    `  $ node ${script} --version`,
    `  $ node ${script} --mission`,
    `  $ node ${script} --mission-full`,
    `  $ node ${script} --features`,
    `  $ node ${script} --serve 4000`,
    `  $ node ${script} --plot quadratic --range 0,10 --resolution 50 --stroke-color red --background-color yellow --title MyPlot --xlabel X --ylabel Y --output plot.svg`,
    `  $ node ${script} --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 75 --stroke-color blue --fill-color cyan --title SpiralPlot --output polar.svg`,
    "",
    "For full mission statement see MISSION.md"
  ].join("\n");
}

function showHelp() {
  console.log(getHelpText());
  process.exit(0);
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
  process.exit(0);
}

function showMission() {
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = fs.readFileSync(missionPath, "utf8");
    const lines = content.split(/\r?\n/);
    const headerLine = lines.find((l) => l.startsWith("# "));
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
  process.exit(0);
}

function showFullMission() {
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = fs.readFileSync(missionPath, "utf8");
    console.log(content);
  } catch (err) {
    console.error("Error reading full mission statement:", err);
    process.exit(1);
  }
  process.exit(0);
}

function handleFeatures() {
  // List sandbox feature files only
  const featuresDir = path.resolve(__dirname, "../../sandbox/features");
  let files = [];
  try {
    files = fs.readdirSync(featuresDir);
  } catch {
    files = [];
  }
  files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '').toUpperCase())
    .forEach((name) => console.log(name));
  process.exit(0);
}

// ... other existing code unchanged ...

function parsePair(str, def) {
  if (!str) return def;
  const parts = str.split(",").map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return def;
  return parts;
}

function linspace(start, end, num) {
  const arr = [];
  if (num === 1) return [start];
  const step = (end - start) / (num - 1);
  for (let i = 0; i < num; i++) {
    arr.push(start + step * i);
  }
  return arr;
}

function generatePlotData(fnName, range, resolution) {
  const [start, end] = range;
  const xs = linspace(start, end, resolution);
  const data = xs.map((x) => {
    let y;
    if (fnName === 'quadratic') {
      y = x * x;
    } else if (fnName === 'sine') {
      y = Math.sin(x);
    } else {
      throw new Error(`Unsupported function: ${fnName}`);
    }
    return { x, y };
  });
  return data;
}

function generatePolarData(fnName, radiusRange, angleRange, resolution) {
  const [rStart, rEnd] = radiusRange;
  const [aStart, aEnd] = angleRange;
  const thetas = linspace(aStart, aEnd, resolution);
  const data = thetas.map((theta, i) => {
    let r;
    if (fnName === 'spiral') {
      r = rStart + (rEnd - rStart) * (i / (resolution - 1));
    } else if (fnName === 'rose') {
      r = Math.cos(theta);
    } else {
      throw new Error(`Unsupported polar function: ${fnName}`);
    }
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x, y };
  });
  return data;
}

function makeCSV(data) {
  const header = 'x,y';
  const rows = data.map((d) => `${d.x},${d.y}`);
  return [header, ...rows].join('\n');
}

// ... rest of code unchanged ...
