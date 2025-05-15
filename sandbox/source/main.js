#!/usr/bin/env node
// sandbox/source/main.js
// CLI entrypoint with support for --help, --version, --mission, --mission-full, --plot, --polar, --export-data, and --serve commands

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
  boolean: ["help", "version", "mission", "mission-full"],
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
    "ylabel"
  ],
  alias: { h: "help", v: "version", m: "mission" }
});

// Precedence: help > version > mission-full > mission > serve > polar > plot
if (argv.help) {
  showHelp();
} else if (argv.version) {
  showVersion();
} else if (argv["mission-full"]) {
  showFullMission();
} else if (argv.mission) {
  showMission();
} else if (argv.serve !== undefined) {
  startServer();
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
    `Usage: node ${script} [options]\n\nOptions:\n` +
      `  --help              Show help information\n` +
      `  --version           Show version number\n` +
      `  --mission           Show mission statement\n` +
      `  --mission-full      Show full mission statement\n` +
      `  --serve [port]      Start HTTP server (default: 4000)\n` +
      `  --plot              Generate SVG plot (quadratic or sine)\n` +
      `  --polar             Generate SVG polar plot (spiral or rose)\n` +
      `  --export-data       Export data as CSV or JSON (takes precedence)\n` +
      `  --range             Specify x-axis range for plot <start,end> (default: 0,10)\n` +
      `  --radius-range      Specify radius range for polar plot <rStart,rEnd> (default: 0,5)\n` +
      `  --angle-range       Specify angle range for polar plot <thetaStart,thetaEnd> (default: 0,6.28)\n` +
      `  --resolution        Specify number of sample points (default: 100)\n` +
      `  --stroke-color      Set stroke color for plot (default: black)\n` +
      `  --stroke-width      Set stroke width for plot (default: 1)\n` +
      `  --fill-color        Set fill color for plot (default: none)\n` +
      `  --background-color  Set background color for SVG (optional)\n` +
      `  --title             Add title annotation to SVG\n` +
      `  --xlabel            Add X-axis label (CLI and HTTP only)\n` +
      `  --ylabel            Add Y-axis label (CLI and HTTP only)\n` +
      `  --output            Specify output filename for SVG (default: plot.svg or polar.svg)\n` +
      `  --export-data       Specify output filename for data export (.csv or .json)\n` +
      `\nExamples:\n` +
      `  $ node ${script} --help\n` +
      `  $ node ${script} --version\n` +
      `  $ node ${script} --mission\n` +
      `  $ node ${script} --mission-full\n` +
      `  $ node ${script} --serve 4000\n` +
      `  $ node ${script} --plot quadratic --range 0,10 --resolution 50 --stroke-color red --background-color yellow --title MyPlot --xlabel X --ylabel Y --output plot.svg\n` +
      `  $ node ${script} --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 75 --stroke-color blue --fill-color cyan --title SpiralPlot --output polar.svg\n` +
      `\nFor full mission statement see MISSION.md`
  );
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

// Data generation helpers ... (rest of file unchanged)
