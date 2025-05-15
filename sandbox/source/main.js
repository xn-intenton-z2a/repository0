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
    "  --serve [port]      Start HTTP server (default: 4000)",
    "  --plot              Generate SVG plot (quadratic or sine)",
    "  --polar             Generate SVG polar plot (spiral or rose)",
    "  --export-data       Export data as CSV or JSON (takes precedence)",
    "  --range             Specify x-axis range for plot <start,end> (default: 0,10)",
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
    "  --export-data       Specify output filename for data export (.csv or .json)",
    "",
    "Examples:",
    `  $ node ${script} --help`,
    `  $ node ${script} --version`,
    `  $ node ${script} --mission`,
    `  $ node ${script} --mission-full`,
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

// Data generation helpers
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

function generatePlotSVG(fnName, range, resolution, style) {
  const data = generatePlotData(fnName, range, resolution);
  const points = data.map((d) => `${d.x},${d.y}`).join(' ');
  const bg = style.backgroundColor ? `<rect width="100%" height="100%" fill="${style.backgroundColor}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg">
  ${bg}
  <polyline fill="none" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" points="${points}" />
</svg>`;
}

function generatePolarSVG(fnName, radiusRange, angleRange, resolution, style) {
  const data = generatePolarData(fnName, radiusRange, angleRange, resolution);
  const points = data.map((d) => `${d.x},${d.y}`).join(' ');
  const bg = style.backgroundColor ? `<rect width="100%" height="100%" fill="${style.backgroundColor}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg">
  ${bg}
  <polyline fill="none" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" points="${points}" />
</svg>`;
}

function handlePlot() {
  const fn = argv.plot;
  try {
    // Determine raw range argument to support negative values correctly
    let rangeStr;
    const idx = args.indexOf('--range');
    if (idx !== -1 && idx < args.length - 1) {
      rangeStr = args[idx + 1];
    } else {
      rangeStr = argv.range;
    }
    const range = parsePair(rangeStr, [0, 10]);
    const resolution = parseInt(argv.resolution || '100', 10);
    const style = {
      strokeColor: argv['stroke-color'] || argv.strokeColor || 'black',
      strokeWidth: argv['stroke-width'] || argv.strokeWidth || '1',
      backgroundColor: argv['background-color'] || argv.backgroundColor || ''
    };
    if (argv['export-data']) {
      const out = argv['export-data'];
      const data = generatePlotData(fn, range, resolution);
      const ext = path.extname(out).toLowerCase();
      if (ext === '.csv') {
        fs.writeFileSync(out, makeCSV(data));
      } else if (ext === '.json') {
        fs.writeFileSync(out, JSON.stringify(data, null, 2));
      } else {
        console.error(`Unsupported export format: ${ext}`);
        process.exit(1);
      }
      process.exit(0);
    } else {
      const out = argv.output || 'plot.svg';
      const svg = generatePlotSVG(fn, range, resolution, style);
      fs.writeFileSync(out, svg);
      process.exit(0);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

function handlePolar() {
  const fn = argv.polar;
  try {
    const radiusRange = parsePair(argv['radius-range'], [0, 5]);
    const angleRange = parsePair(argv['angle-range'], [0, 6.28]);
    const resolution = parseInt(argv.resolution || '100', 10);
    const style = {
      strokeColor: argv['stroke-color'] || argv.strokeColor || 'black',
      strokeWidth: argv['stroke-width'] || argv.strokeWidth || '1',
      backgroundColor: argv['background-color'] || argv.backgroundColor || ''
    };
    if (argv['export-data']) {
      const out = argv['export-data'];
      const data = generatePolarData(fn, radiusRange, angleRange, resolution);
      const ext = path.extname(out).toLowerCase();
      if (ext === '.csv') {
        fs.writeFileSync(out, makeCSV(data));
      } else if (ext === '.json') {
        fs.writeFileSync(out, JSON.stringify(data, null, 2));
      } else {
        console.error(`Unsupported export format: ${ext}`);
        process.exit(1);
      }
      process.exit(0);
    } else {
      const out = argv.output || 'polar.svg';
      const svg = generatePolarSVG(fn, radiusRange, angleRange, resolution, style);
      fs.writeFileSync(out, svg);
      process.exit(0);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

function startServer() {
  const port = parseInt(argv.serve, 10) || 4000;
  const server = http.createServer((req, res) => {
    const base = `http://${req.headers.host}`;
    const url = new URL(req.url, base);
    const params = url.searchParams;
    try {
      if (url.pathname === '/plot-data') {
        const fn = params.get('function');
        const range = parsePair(params.get('range'), null);
        const fmt = params.get('format');
        if (!fn || !params.get('range') || !fmt) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        const data = generatePlotData(fn, range, parseInt(params.get('resolution') || '100', 10));
        if (fmt === 'csv') {
          res.setHeader('Content-Type', 'text/csv');
          return res.end(makeCSV(data));
        } else if (fmt === 'json') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(data));
        }
        res.statusCode = 400; return res.end('Bad Request');
      } else if (url.pathname === '/polar-data') {
        const fn = params.get('function');
        const radiusRange = parsePair(params.get('radius-range'), null);
        const angleRange = parsePair(params.get('angle-range'), null);
        const fmt = params.get('format');
        if (!fn || !params.get('radius-range') || !params.get('angle-range') || !fmt) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        const data = generatePolarData(fn, radiusRange, angleRange, parseInt(params.get('resolution') || '100', 10));
        if (fmt === 'csv') {
          res.setHeader('Content-Type', 'text/csv');
          return res.end(makeCSV(data));
        } else if (fmt === 'json') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(data));
        }
        res.statusCode = 400; return res.end('Bad Request');
      } else if (url.pathname === '/plot') {
        const fn = params.get('function');
        const range = parsePair(params.get('range'), null);
        if (!fn || !params.get('range')) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        // reject unsupported plot functions
        if (!['quadratic', 'sine'].includes(fn)) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        const resolution = parseInt(params.get('resolution') || '100', 10);
        const style = {
          strokeColor: params.get('strokeColor') || 'black',
          strokeWidth: params.get('strokeWidth') || '1',
          backgroundColor: params.get('backgroundColor') || ''
        };
        const svg = generatePlotSVG(fn, range, resolution, style);
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.end(svg);
      } else if (url.pathname === '/polar') {
        const fn = params.get('function');
        const radiusRange = parsePair(params.get('radius-range'), null);
        const angleRange = parsePair(params.get('angle-range'), null);
        if (!fn || !params.get('radius-range') || !params.get('angle-range')) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        // reject unsupported polar functions
        if (!['spiral', 'rose'].includes(fn)) {
          res.statusCode = 400;
          return res.end('Bad Request');
        }
        const resolution = parseInt(params.get('resolution') || '100', 10);
        const style = {
          strokeColor: params.get('strokeColor') || 'black',
          strokeWidth: params.get('strokeWidth') || '1',
          backgroundColor: params.get('backgroundColor') || ''
        };
        const svg = generatePolarSVG(fn, radiusRange, angleRange, resolution, style);
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.end(svg);
      } else if (url.pathname === '/mission') {
        const missionPath = path.resolve(__dirname, "../../MISSION.md");
        res.setHeader('Content-Type', 'text/plain');
        const content = fs.readFileSync(missionPath, 'utf8');
        return res.end(content);
      } else if (url.pathname === '/version') {
        const pkgPath = path.resolve(__dirname, "../../package.json");
        res.setHeader('Content-Type', 'text/plain');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return res.end(pkg.version);
      } else if (url.pathname === '/help') {
        res.setHeader('Content-Type', 'text/plain');
        return res.end(getHelpText());
      }
      res.statusCode = 404;
      res.end('Not Found');
    } catch (err) {
      res.statusCode = 500;
      res.end(String(err));
    }
  });
  server.listen(port);
  console.log(`Server listening on port ${port}`);
  return server;
}

export { startServer };