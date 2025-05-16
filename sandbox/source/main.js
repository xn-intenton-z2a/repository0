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
    "  --features          Show mission statement and list all available sandbox features",
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
    `  $ node ${script} --plot sine --range 0,1 --width 500 --height 400`,
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

// New feature listing handler
function handleFeatures() {
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = fs.readFileSync(missionPath, "utf8");
    const lines = content.split(/\r?\n/);
    const headerLine = lines.find((l) => l.startsWith("# "));
    if (headerLine) console.log(headerLine);
  } catch (err) {
    console.error("Error reading mission statement:", err);
    process.exit(1);
  }
  // List sandbox feature files
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

// ... existing data generation and HTTP handlers remain unchanged except for viewBox support ...

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

function generatePlotSVG(fnName, range, resolution, style, logScale, width = 800, height = 600) {
  let data = generatePlotData(fnName, range, resolution);
  if (logScale) {
    data = data.map((d) => {
      let x = d.x;
      let y = d.y;
      if (logScale === 'x' || logScale === 'both') {
        x = Math.log10(x);
      }
      if (logScale === 'y' || logScale === 'both') {
        y = Math.log10(y);
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
  const vbWidth = maxX - minX;
  const vbHeight = maxY - minY;
  const points = data.map((d) => `${d.x},${d.y}`).join(' ');
  const bg = style.backgroundColor ? `<rect width="100%" height="100%" fill="${style.backgroundColor}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}">
  ${bg}
  <polyline fill="none" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" points="${points}" />
</svg>`;
}

function generatePolarSVG(fnName, radiusRange, angleRange, resolution, style, width = 800, height = 600) {
  const data = generatePolarData(fnName, radiusRange, angleRange, resolution);
  const xs = data.map((d) => d.x);
  const ys = data.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const vbWidth = maxX - minX;
  const vbHeight = maxY - minY;
  const points = data.map((d) => `${d.x},${d.y}`).join(' ');
  const bg = style.backgroundColor ? `<rect width="100%" height="100%" fill="${style.backgroundColor}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${vbWidth} ${vbHeight}">
  ${bg}
  <polyline fill="none" stroke="${style.strokeColor}" stroke-width="${style.strokeWidth}" points="${points}" />
</svg>`;
}

function handlePlot() {
  const fn = argv.plot;
  const logScale = argv['log-scale'];
  if (logScale !== undefined && !['x', 'y', 'both'].includes(logScale)) {
    console.error('invalid logScale');
    process.exit(1);
  }
  try {
    let rangeStr;
    const idx = args.indexOf('--range');
    if (idx !== -1 && idx < args.length - 1) {
      rangeStr = args[idx + 1];
    } else {
      rangeStr = argv.range;
    }
    const range = parsePair(rangeStr, [0, 10]);
    if (logScale && (range[0] <= 0 || range[1] <= 0)) {
      console.error('log-scale values must be positive');
      process.exit(1);
    }
    const resolution = parseInt(argv.resolution || '100', 10);
    const style = {
      strokeColor: argv['stroke-color'] || argv.strokeColor || 'black',
      strokeWidth: argv['stroke-width'] || argv.strokeWidth || '1',
      backgroundColor: argv['background-color'] || argv.backgroundColor || ''
    };
    // width and height
    const width = argv.width !== undefined ? parseInt(argv.width, 10) : 800;
    if (argv.width !== undefined && (isNaN(width) || width <= 0)) {
      console.error('width must be a positive integer');
      process.exit(1);
    }
    const height = argv.height !== undefined ? parseInt(argv.height, 10) : 600;
    if (argv.height !== undefined && (isNaN(height) || height <= 0)) {
      console.error('height must be a positive integer');
      process.exit(1);
    }
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
      const svg = generatePlotSVG(fn, range, resolution, style, logScale, width, height);
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
    // width and height
    const width = argv.width !== undefined ? parseInt(argv.width, 10) : 800;
    if (argv.width !== undefined && (isNaN(width) || width <= 0)) {
      console.error('width must be a positive integer');
      process.exit(1);
    }
    const height = argv.height !== undefined ? parseInt(argv.height, 10) : 600;
    if (argv.height !== undefined && (isNaN(height) || height <= 0)) {
      console.error('height must be a positive integer');
      process.exit(1);
    }
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
      const svg = generatePolarSVG(fn, radiusRange, angleRange, resolution, style, width, height);
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
        const logScaleParam = params.get('logScale');
        if (logScaleParam) {
          if (!['x', 'y', 'both'].includes(logScaleParam)) {
            res.statusCode = 400;
            return res.end('invalid logScale');
          }
          if (range[0] <= 0 || range[1] <= 0) {
            res.statusCode = 400;
            return res.end('log-scale values must be positive');
          }
        }
        // width and height parameters
        let widthParam = 800;
        let heightParam = 600;
        if (params.has('width')) {
          widthParam = parseInt(params.get('width'), 10);
          if (isNaN(widthParam) || widthParam <= 0) {
            res.statusCode = 400;
            return res.end('width must be positive integer');
          }
        }
        if (params.has('height')) {
          heightParam = parseInt(params.get('height'), 10);
          if (isNaN(heightParam) || heightParam <= 0) {
            res.statusCode = 400;
            return res.end('height must be positive integer');
          }
        }
        const svg = generatePlotSVG(fn, range, resolution, style, logScaleParam, widthParam, heightParam);
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
        // width and height parameters
        let widthParam = 800;
        let heightParam = 600;
        if (params.has('width')) {
          widthParam = parseInt(params.get('width'), 10);
          if (isNaN(widthParam) || widthParam <= 0) {
            res.statusCode = 400;
            return res.end('width must be positive integer');
          }
        }
        if (params.has('height')) {
          heightParam = parseInt(params.get('height'), 10);
          if (isNaN(heightParam) || heightParam <= 0) {
            res.statusCode = 400;
            return res.end('height must be positive integer');
          }
        }
        const svg = generatePolarSVG(fn, radiusRange, angleRange, resolution, style, widthParam, heightParam);
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