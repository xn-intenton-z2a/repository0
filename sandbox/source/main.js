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

function handlePlot() {
  const fnName = argv.plot;
  const range = parsePair(argv.range, [0, 10]);
  const resolution = argv.resolution ? parseInt(argv.resolution, 10) : 100;
  const data = generatePlotData(fnName, range, resolution);
  if (argv['export-data']) {
    const out = argv['export-data'];
    let content;
    if (out.endsWith('.csv')) {
      content = makeCSV(data);
    } else {
      content = JSON.stringify(data, null, 2);
    }
    fs.writeFileSync(out, content, 'utf8');
  } else {
    const width = argv.width ? parseInt(argv.width, 10) : 800;
    const height = argv.height ? parseInt(argv.height, 10) : 600;
    const ys = data.map((d) => d.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const points = data.map((d) => `${d.x},${d.y}`).join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${range[0]} ${minY} ${range[1] - range[0]} ${maxY - minY}"><polyline points="${points}" stroke="black" fill="none"/></svg>`;
    const outFile = argv.output || 'plot.svg';
    fs.writeFileSync(outFile, svg, 'utf8');
  }
  process.exit(0);
}

function handlePolar() {
  const fnName = argv.polar;
  const radiusRange = parsePair(argv['radius-range'], [0, 5]);
  const angleRange = parsePair(argv['angle-range'], [0, 6.28]);
  const resolution = argv.resolution ? parseInt(argv.resolution, 10) : 100;
  const data = generatePolarData(fnName, radiusRange, angleRange, resolution);
  if (argv['export-data']) {
    const out = argv['export-data'];
    let content;
    if (out.endsWith('.csv')) {
      content = makeCSV(data);
    } else {
      content = JSON.stringify(data, null, 2);
    }
    fs.writeFileSync(out, content, 'utf8');
  } else {
    const width = argv.width ? parseInt(argv.width, 10) : 800;
    const height = argv.height ? parseInt(argv.height, 10) : 600;
    const xs = data.map((d) => d.x);
    const ys = data.map((d) => d.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
    const points = data.map((d) => `${d.x},${d.y}`).join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}"><polyline points="${points}" stroke="black" fill="none"/></svg>`;
    const outFile = argv.output || 'polar.svg';
    fs.writeFileSync(outFile, svg, 'utf8');
  }
  process.exit(0);
}

function startServer() {
  const port = argv.serve ? parseInt(argv.serve, 10) : 4000;
  const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const pathname = urlObj.pathname;
    const params = urlObj.searchParams;

    if (pathname === '/plot-data') {
      const fn = params.get('function');
      const rangeParam = params.get('range');
      const format = params.get('format');
      if (!fn || !rangeParam || !format) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const range = parsePair(rangeParam, [0, 10]);
      const resolution = params.get('resolution') ? parseInt(params.get('resolution'), 10) : 100;
      const data = generatePlotData(fn, range, resolution);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.end(makeCSV(data));
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } else {
        res.statusCode = 400;
        res.end();
      }
    } else if (pathname === '/polar-data') {
      const fn = params.get('function');
      const rParam = params.get('radius-range');
      const aParam = params.get('angle-range');
      const format = params.get('format');
      if (!fn || !rParam || !aParam || !format) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const radiusRange = parsePair(rParam, [0, 5]);
      const angleRange = parsePair(aParam, [0, 6.28]);
      const resolution = params.get('resolution') ? parseInt(params.get('resolution'), 10) : 100;
      const data = generatePolarData(fn, radiusRange, angleRange, resolution);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.end(makeCSV(data));
      } else if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } else {
        res.statusCode = 400;
        res.end();
      }
    } else if (pathname === '/mission') {
      try {
        const content = fs.readFileSync(path.resolve(__dirname, '../../MISSION.md'), 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.end(content);
      } catch {
        res.statusCode = 500;
        res.end();
      }
    } else if (pathname === '/version') {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
        res.setHeader('Content-Type', 'text/plain');
        res.end(pkg.version);
      } catch {
        res.statusCode = 500;
        res.end();
      }
    } else if (pathname === '/help') {
      res.setHeader('Content-Type', 'text/plain');
      res.end(getHelpText());
    } else if (pathname === '/plot') {
      const fn = params.get('function');
      const rangeParam = params.get('range');
      const logScale = params.get('logScale');
      const wParam = params.get('width');
      const hParam = params.get('height');
      const resolution = params.get('resolution') ? parseInt(params.get('resolution'), 10) : 100;
      if (!fn || !rangeParam) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const range = parsePair(rangeParam, [0, 10]);
      // width/height validation
      let width = 800;
      let height = 600;
      if (wParam !== null) {
        width = Number(wParam);
        if (!Number.isInteger(width) || width <= 0) {
          res.statusCode = 400;
          res.end();
          return;
        }
      }
      if (hParam !== null) {
        height = Number(hParam);
        if (!Number.isInteger(height) || height <= 0) {
          res.statusCode = 400;
          res.end();
          return;
        }
      }
      // logScale validation
      if (logScale) {
        if (!['x', 'y', 'both'].includes(logScale)) {
          res.statusCode = 400;
          res.end('invalid logScale');
          return;
        }
        if (range[0] <= 0 || range[1] <= 0) {
          res.statusCode = 400;
          res.end('log-scale values must be positive');
          return;
        }
      }
      let data = generatePlotData(fn, range, resolution);
      if (logScale) {
        data = data.map((d) => {
          let x = d.x;
          let y = d.y;
          if (logScale === 'x' || logScale === 'both') {
            x = Math.log10(d.x);
          }
          if (logScale === 'y' || logScale === 'both') {
            y = Math.log10(d.y);
          }
          return { x, y };
        });
      }
      const xs = data.map((d) => d.x);
      const ys = data.map((d) => d.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
      const points = data.map((d) => `${d.x},${d.y}`).join(' ');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}"><polyline points="${points}" stroke="black" fill="none"/></svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.end(svg);
    } else if (pathname === '/polar') {
      const fn = params.get('function');
      const rParam = params.get('radius-range');
      const aParam = params.get('angle-range');
      const wParam = params.get('width');
      const hParam = params.get('height');
      const resolution = params.get('resolution') ? parseInt(params.get('resolution'), 10) : 100;
      if (!fn || !rParam || !aParam) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const radiusRange = parsePair(rParam, [0, 5]);
      const angleRange = parsePair(aParam, [0, 6.28]);
      let width = 800;
      let height = 600;
      if (wParam !== null) {
        width = Number(wParam);
        if (!Number.isInteger(width) || width <= 0) { res.statusCode = 400; res.end(); return; }
      }
      if (hParam !== null) {
        height = Number(hParam);
        if (!Number.isInteger(height) || height <= 0) { res.statusCode = 400; res.end(); return; }
      }
      let data;
      try {
        data = generatePolarData(fn, radiusRange, angleRange, resolution);
      } catch (err) {
        res.statusCode = 400;
        res.end();
        return;
      }
      const xs = data.map((d) => d.x);
      const ys = data.map((d) => d.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
      const points = data.map((d) => `${d.x},${d.y}`).join(' ');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}"><polyline points="${points}" stroke="black" fill="none"/></svg>`;
      res.setHeader('Content-Type', 'image/svg+xml');
      res.end(svg);
    } else {
      res.statusCode = 404;
      res.end();
    }
  });
  server.listen(port);
  return server;
}

export { startServer };
