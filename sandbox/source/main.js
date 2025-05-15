#!/usr/bin/env node
// sandbox/source/main.js
// CLI entrypoint with support for --help, --version, --mission, and --plot commands
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
  string: ["plot", "range", "output"],
  alias: { h: "help", v: "version", m: "mission" }
});

// Precedence: help > version > mission > plot
if (argv.help) {
  showHelp();
} else if (argv.version) {
  showVersion();
} else if (argv.mission) {
  showMission();
} else if (argv.plot !== undefined) {
  handlePlot();
} else {
  echoMain(args);
}

function showHelp() {
  const script = path.basename(process.argv[1]);
  console.log(
    `Usage: node ${script} [options]\n\nOptions:\n  --help      Show help information\n  --version   Show version number\n  --mission   Show mission statement\n  --plot      Generate SVG plot (quadratic or sine)\n  --range     Specify x-axis range for plot <start,end> (default: 0,10)\n  --output    Specify output filename for SVG (default: plot.svg)\n\nExamples:\n  $ node ${script} --help\n  $ node ${script} --version\n  $ node ${script} --mission\n  $ node ${script} --plot quadratic --range 0,10 --output plot.svg\n` +
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
