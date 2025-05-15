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
    "serve"
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
    `  --serve [port]      Start HTTP server (default: 3000)\n` +
    `  --plot              Generate SVG plot (quadratic or sine)\n` +
    `  --polar             Generate SVG polar plot (spiral or rose)\n` +
    `  --export-data       Export data as CSV or JSON (takes precedence)\n` +
    `  --range             Specify x-axis range for plot <start,end> (default: 0,10)\n` +
    `  --radius-range      Specify radius range for polar plot <rStart,rEnd> (default: 0,5)\n` +
    `  --angle-range       Specify angle range for polar plot <thetaStart,thetaEnd> (default: 0,6.28)\n` +
    `  --resolution        Specify number of sample points (default: 100)\n` +
    `  --output            Specify output filename for SVG (default: plot.svg or polar.svg)\n` +
    `  --export-data       Specify output filename for data export (.csv or .json)\n` +
    `\nExamples:\n` +
    `  $ node ${script} --help\n` +
    `  $ node ${script} --version\n` +
    `  $ node ${script} --mission\n` +
    `  $ node ${script} --mission-full\n` +
    `  $ node ${script} --serve 4000\n` +
    `  $ node ${script} --plot quadratic --range 0,10 --export-data data.csv\n` +
    `  $ node ${script} --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 100 --export-data data.json\n` +
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

// Data generation helpers
function generatePlotData(funcName, start, end, samples) {
  const xs = [];
  const ys = [];
  for (let i = 0; i < samples; i++) {
    const x = start + ((end - start) * i) / (samples - 1);
    xs.push(x);
    ys.push(funcName === "quadratic" ? x * x : Math.sin(x));
  }
  return xs.map((x, i) => ({ x, y: ys[i] }));
}

function generatePolarData(funcName, rStart, rEnd, thetaStart, thetaEnd, resolution) {
  const data = [];
  for (let i = 0; i < resolution; i++) {
    const t = thetaStart + ((thetaEnd - thetaStart) * i) / (resolution - 1);
    let r = funcName === "spiral" ? t : Math.sin(2 * t);
    r = Math.max(rStart, Math.min(r, rEnd));
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    data.push({ x, y });
  }
  return data;
}

function handlePlot() {
  const funcName = argv.plot;
  const supported = ["quadratic", "sine"];
  if (!supported.includes(funcName)) {
    console.error(`Unsupported function: ${funcName}`);
    process.exit(1);
  }

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

  // Data export
  if (argv["export-data"]) {
    const exportFile = argv["export-data"];
    if (!exportFile.endsWith(".csv") && !exportFile.endsWith(".json")) {
      console.error(`Invalid export file extension: ${exportFile}`);
      process.exit(1);
    }
    const data = generatePlotData(funcName, start, end, 100);
    const outputPath = path.resolve(process.cwd(), exportFile);
    try {
      if (exportFile.endsWith(".csv")) {
        const csv =
          "x,y\n" +
          data.map((pt) => `${pt.x},${pt.y}`).join("\n");
        fs.writeFileSync(outputPath, csv, "utf8");
      } else {
        fs.writeFileSync(outputPath, JSON.stringify(data), "utf8");
      }
    } catch (err) {
      console.error("Error writing data file:", err);
      process.exit(1);
    }
    process.exit(0);
  }

  const outputFile = argv.output || "plot.svg";
  const samples = 100;
  const data = generatePlotData(funcName, start, end, samples);
  const ys = data.map((d) => d.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = end - start;
  const height = maxY - minY;
  const points = data.map((d) => `${d.x},${d.y}`).join(" ");

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

function handlePolar() {
  const funcName = argv.polar;
  const supported = ["spiral", "rose"];
  if (!supported.includes(funcName)) {
    console.error(`Unsupported polar function: ${funcName}`);
    process.exit(1);
  }

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

  let resolution = 100;
  const resIndex = args.indexOf("--resolution");
  if (resIndex !== -1 && args[resIndex + 1] !== undefined) {
    resolution = parseInt(args[resIndex + 1], 10);
  } else if (argv.resolution) {
    resolution = parseInt(argv.resolution, 10);
  }
  if (isNaN(resolution) || resolution <= 0) {
    console.error(`Invalid resolution: ${argv.resolution}`);
    process.exit(1);
  }

  // Data export
  if (argv["export-data"]) {
    const exportFile = argv["export-data"];
    if (!exportFile.endsWith(".csv") && !exportFile.endsWith(".json")) {
      console.error(`Invalid export file extension: ${exportFile}`);
      process.exit(1);
    }
    const data = generatePolarData(funcName, rStart, rEnd, thetaStart, thetaEnd, resolution);
    const outputPath = path.resolve(process.cwd(), exportFile);
    try {
      if (exportFile.endsWith(".csv")) {
        const csv =
          "x,y\n" +
          data.map((pt) => `${pt.x},${pt.y}`).join("\n");
        fs.writeFileSync(outputPath, csv, "utf8");
      } else {
        fs.writeFileSync(outputPath, JSON.stringify(data), "utf8");
      }
    } catch (err) {
      console.error("Error writing data file:", err);
      process.exit(1);
    }
    process.exit(0);
  }

  const outputFile = argv.output || "polar.svg";
  const data = generatePolarData(funcName, rStart, rEnd, thetaStart, thetaEnd, resolution);
  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const points = data.map((d) => `${d.x},${d.y}`).join(" ");

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

function startServer() {
  const portNum = parseInt(argv.serve, 10);
  const port = !isNaN(portNum) ? portNum : 4000;
  const server = http.createServer((req, res) => {
    handleRequest(req, res);
  });
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  return server;
}

function handleRequest(req, res) {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;
  const params = reqUrl.searchParams;

  if (pathname === "/mission") {
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
      const body = headerLine && paragraph ? `${headerLine}\n\n${paragraph}` : content;
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(body);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`Error reading mission statement: ${err.message}`);
    }
  } else if (pathname === "/version") {
    const pkgPath = path.resolve(__dirname, "../../package.json");
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(pkg.version);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`Error reading version: ${err.message}`);
    }
  } else if (pathname === "/help") {
    const script = path.basename(process.argv[1]);
    const helpText =
      `Usage: node ${script} [options]\n\nOptions:\n` +
      `  --help              Show help information\n` +
      `  --version           Show version number\n` +
      `  --mission           Show mission statement\n` +
      `  --mission-full      Show full mission statement\n` +
      `  --serve [port]      Start HTTP server (default: 3000)\n` +
      `  --plot              Generate SVG plot (quadratic or sine)\n` +
      `  --polar             Generate SVG polar plot (spiral or rose)\n` +
      `  --export-data       Export data as CSV or JSON (takes precedence)\n` +
      `  --range             Specify x-axis range for plot <start,end> (default: 0,10)\n` +
      `  --radius-range      Specify radius range for polar plot <rStart,rEnd> (default: 0,5)\n` +
      `  --angle-range       Specify angle range for polar plot <thetaStart,thetaEnd> (default: 0,6.28)\n` +
      `  --resolution        Specify number of sample points (default: 100)\n` +
      `  --output            Specify output filename for SVG (default:(plot.svg or polar.svg))\n` +
      `  --export-data       Specify output filename for data export (.csv or .json)\n` +
      `\nExamples:\n` +
      `  $ node ${script} --help\n` +
      `  $ node ${script} --version\n` +
      `  $ node ${script} --mission\n` +
      `  $ node ${script} --mission-full\n` +
      `  $ node ${script} --serve 4000\n` +
      `  $ node ${script} --plot quadratic --range 0,10 --export-data data.csv\n` +
      `  $ node ${script} --polar spiral --radius-range 0,5 --angle-range 0,6.28 --resolution 100 --export-data data.json\n` +
      `\nFor full mission statement see MISSION.md`;
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(helpText);
  } else if (pathname === "/plot-data") {
    const funcName = params.get("function");
    if (!["quadratic", "sine"].includes(funcName)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid function: ${funcName}`);
      return;
    }
    const rangeStr = params.get("range");
    if (!rangeStr) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing range parameter");
      return;
    }
    const parts = rangeStr.split(",");
    if (parts.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid range: ${rangeStr}`);
      return;
    }
    const start = parseFloat(parts[0]);
    const end = parseFloat(parts[1]);
    if (isNaN(start) || isNaN(end)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid range numbers: ${rangeStr}`);
      return;
    }
    const format = params.get("format");
    if (!["csv", "json"].includes(format)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid format: ${format}`);
      return;
    }
    const outputFile = params.get("output");
    const data = generatePlotData(funcName, start, end, 100);
    if (outputFile) {
      try {
        if (format === "csv") {
          const csv = "x,y\n" + data.map((pt) => `${pt.x},${pt.y}`).join("\n");
          fs.writeFileSync(path.resolve(process.cwd(), outputFile), csv, "utf8");
        } else {
          fs.writeFileSync(path.resolve(process.cwd(), outputFile), JSON.stringify(data), "utf8");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Error writing file: ${err.message}`);
        return;
      }
    }
    if (format === "csv") {
      const csv = "x,y\n" + data.map((pt) => `${pt.x},${pt.y}`).join("\n");
      res.writeHead(200, { "Content-Type": "text/csv" });
      res.end(csv);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    }
  } else if (pathname === "/polar-data") {
    const funcName = params.get("function");
    if (!["spiral", "rose"].includes(funcName)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid function: ${funcName}`);
      return;
    }
    const radiusRange = params.get("radius-range");
    if (!radiusRange) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing radius-range parameter");
      return;
    }
    const rrParts2 = radiusRange.split(",");
    if (rrParts2.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid radius range: ${radiusRange}`);
      return;
    }
    const rStart2 = parseFloat(rrParts2[0]);
    const rEnd2 = parseFloat(rrParts2[1]);
    if (isNaN(rStart2) || isNaN(rEnd2)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid radius range numbers: ${radiusRange}`);
      return;
    }
    const angleRange2 = params.get("angle-range");
    if (!angleRange2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing angle-range parameter");
      return;
    }
    const arParts2 = angleRange2.split(",");
    if (arParts2.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid angle range: ${angleRange2}`);
      return;
    }
    const thetaStart2 = parseFloat(arParts2[0]);
    const thetaEnd2 = parseFloat(arParts2[1]);
    if (isNaN(thetaStart2) || isNaN(thetaEnd2)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid angle range numbers: ${angleRange2}`);
      return;
    }
    const format2 = params.get("format");
    if (!["csv", "json"].includes(format2)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid format: ${format2}`);
      return;
    }
    const outputFile2 = params.get("output");
    const data2 = generatePolarData(funcName, rStart2, rEnd2, thetaStart2, thetaEnd2, 100);
    if (outputFile2) {
      try {
        if (format2 === "csv") {
          const csv = "x,y\n" + data2.map((pt) => `${pt.x},${pt.y}`).join("\n");
          fs.writeFileSync(path.resolve(process.cwd(), outputFile2), csv, "utf8");
        } else {
          fs.writeFileSync(path.resolve(process.cwd(), outputFile2), JSON.stringify(data2), "utf8");
        }
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Error writing file: ${err.message}`);
        return;
      }
    }
    if (format2 === "csv") {
      const csv = "x,y\n" + data2.map((pt) => `${pt.x},${pt.y}`).join("\n");
      res.writeHead(200, { "Content-Type": "text/csv" });
      res.end(csv);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data2));
    }
  } else if (pathname === "/plot") {
    const funcName = params.get("function");
    if (!["quadratic", "sine"].includes(funcName)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid function: ${funcName}`);
      return;
    }
    const rangeStr = params.get("range");
    if (!rangeStr) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing range parameter");
      return;
    }
    const parts2 = rangeStr.split(",");
    if (parts2.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid range: ${rangeStr}`);
      return;
    }
    const start2 = parseFloat(parts2[0]);
    const end2 = parseFloat(parts2[1]);
    if (isNaN(start2) || isNaN(end2)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid range numbers: ${rangeStr}`);
      return;
    }
    let resolution2 = parseInt(params.get("resolution") || "100", 10);
    if (isNaN(resolution2) || resolution2 <= 0) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid resolution: ${params.get("resolution")}`);
      return;
    }
    const outputFile3 = params.get("output");
    const data3 = generatePlotData(funcName, start2, end2, resolution2);
    const ys3 = data3.map((d) => d.y);
    const minY3 = Math.min(...ys3);
    const maxY3 = Math.max(...ys3);
    const width3 = end2 - start2;
    const height3 = maxY3 - minY3;
    const points3 = data3.map((d) => `${d.x},${d.y}`).join(" ");
    const svg3 =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${start2} ${minY3} ${width3} ${height3}">\n` +
      `  <polyline fill="none" stroke="black" points="${points3}" />\n` +
      `</svg>`;
    if (outputFile3) {
      try {
        fs.writeFileSync(path.resolve(process.cwd(), outputFile3), svg3, "utf8");
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Error writing SVG: ${err.message}`);
        return;
      }
    }
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(svg3);
  } else if (pathname === "/polar") {
    const funcName = params.get("function");
    if (!["spiral", "rose"].includes(funcName)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid function: ${funcName}`);
      return;
    }
    const radiusRange3 = params.get("radius-range");
    if (!radiusRange3) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing radius-range parameter");
      return;
    }
    const rrParts3 = radiusRange3.split(",");
    if (rrParts3.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid radius range: ${radiusRange3}`);
      return;
    }
    const rStart3 = parseFloat(rrParts3[0]);
    const rEnd3 = parseFloat(rrParts3[1]);
    if (isNaN(rStart3) || isNaN(rEnd3)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid radius range numbers: ${radiusRange3}`);
      return;
    }
    const angleRange3 = params.get("angle-range");
    if (!angleRange3) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing angle-range parameter");
      return;
    }
    const arParts3 = angleRange3.split(",");
    if (arParts3.length !== 2) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid angle range: ${angleRange3}`);
      return;
    }
    const thetaStart3 = parseFloat(arParts3[0]);
    const thetaEnd3 = parseFloat(arParts3[1]);
    if (isNaN(thetaStart3) || isNaN(thetaEnd3)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid angle range numbers: ${angleRange3}`);
      return;
    }
    let res3 = parseInt(params.get("resolution") || "100", 10);
    if (isNaN(res3) || res3 <= 0) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end(`Invalid resolution: ${params.get("resolution")}`);
      return;
    }
    const outputFile4 = params.get("output");
    const data4 = generatePolarData(funcName, rStart3, rEnd3, thetaStart3, thetaEnd3, res3);
    const xs4 = data4.map((d) => d.x);
    const ys4 = data4.map((d) => d.y);
    const minX4 = Math.min(...xs4);
    const maxX4 = Math.max(...xs4);
    const minY4 = Math.min(...ys4);
    const maxY4 = Math.max(...ys4);
    const width4 = maxX4 - minX4;
    const height4 = maxY4 - minY4;
    const points4 = data4.map((d) => `${d.x},${d.y}`).join(" ");
    const svg4 =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX4} ${minY4} ${width4} ${height4}">\n` +
      `  <polyline fill="none" stroke="black" points="${points4}" />\n` +
      `</svg>`;
    if (outputFile4) {
      try {
        fs.writeFileSync(path.resolve(process.cwd(), outputFile4), svg4, "utf8");
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Error writing SVG: ${err.message}`);
        return;
      }
    }
    res.writeHead(200, { "Content-Type": "image/svg+xml" });
    res.end(svg4);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
}

// Export for testing HTTP server
export { startServer };