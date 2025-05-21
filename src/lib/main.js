#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import http from "http";

const emotions = {
  happy: ":-)",
  sad: ":-((",
  angry: ">:-(",
  surprised: ":-O",
};

function printUsage() {
  console.log("Usage: --emotion <name>");
  console.log(`Supported emotions: ${Object.keys(emotions).join(", ")}`);
}

function printPlotUsage() {
  console.log("Usage: --plot <equation>");
  console.log("Usage: --serve [--port <number>]");
  console.log("Usage: --emotion <name>");
  console.log(`Supported emotions: ${Object.keys(emotions).join(", ")}`);
}

function generateAsciiPlot(equation) {
  const width = 80;
  const height = 20;
  const xMin = -10;
  const xMax = 10;
  let f;
  try {
    f = new Function("x", `return ${equation};`);
    f(0);
  } catch (e) {
    throw new Error(`Invalid equation: ${equation}`);
  }
  const xs = Array.from({ length: width }, (_, i) =>
    xMin + (i * (xMax - xMin)) / (width - 1)
  );
  const ys = xs.map((x) => {
    const y = f(x);
    if (typeof y !== "number" || !isFinite(y)) {
      throw new Error(`Invalid equation: ${equation}`);
    }
    return y;
  });
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => " ")
  );
  const yRange = yMax - yMin || 1;
  const xRange = xMax - xMin;

  // Plot points
  ys.forEach((y, i) => {
    const row =
      height - 1 -
      Math.round(((y - yMin) / yRange) * (height - 1));
    grid[row][i] = "*";
  });

  // Axes
  const zeroCol = Math.round(((0 - xMin) / xRange) * (width - 1));
  const zeroRow =
    height - 1 - Math.round(((0 - yMin) / yRange) * (height - 1));
  if (zeroCol >= 0 && zeroCol < width) {
    for (let r = 0; r < height; r++) {
      if (grid[r][zeroCol] === " ") {
        grid[r][zeroCol] = "|";
      }
    }
  }
  if (zeroRow >= 0 && zeroRow < height) {
    for (let c = 0; c < width; c++) {
      if (grid[zeroRow][c] === " ") {
        grid[zeroRow][c] = "-";
      }
    }
  }
  if (
    zeroRow >= 0 &&
    zeroRow < height &&
    zeroCol >= 0 &&
    zeroCol < width
  ) {
    grid[zeroRow][zeroCol] = "+";
  }

  return grid.map((row) => row.join("")).join("\n");
}

function handlePlotRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname !== "/plot") {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }
    const equation = url.searchParams.get("equation");
    if (!equation) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Missing equation parameter.");
      return;
    }
    const plot = generateAsciiPlot(equation);
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Plot</title></head>
<body><pre>${plot}</pre></body>
</html>`;
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } catch (err) {
    const msg = err.message.startsWith("Invalid equation")
      ? err.message
      : `Error generating plot: ${err.message}`;
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(msg);
  }
}

export function main(args = []) {
  const hasEmotion = args.includes("--emotion");
  const hasPlot = args.includes("--plot");
  const hasServe = args.includes("--serve");
  if ([hasEmotion, hasPlot, hasServe].filter(Boolean).length > 1) {
    console.error(
      "Flags --emotion, --plot, and --serve are mutually exclusive."
    );
    printUsage();
    return 1;
  }
  if (hasPlot) {
    const i = args.indexOf("--plot");
    const equation = args[i + 1];
    if (!equation || equation.startsWith("--")) {
      console.error("No equation specified.");
      printPlotUsage();
      return 1;
    }
    try {
      const plot = generateAsciiPlot(equation);
      plot.split("\n").forEach((line) => console.log(line));
      return 0;
    } catch (err) {
      if (err.message.startsWith("Invalid equation")) {
        console.error(err.message);
      } else {
        console.error(`Error: ${err.message}`);
      }
      printPlotUsage();
      return 1;
    }
  }
  if (hasServe) {
    let port = 3000;
    const i = args.indexOf("--port");
    if (i !== -1) {
      const p = Number(args[i + 1]);
      if (!p || isNaN(p)) {
        console.error("Invalid port number.");
        printPlotUsage();
        return 1;
      }
      port = p;
    }
    const server = http.createServer(handlePlotRequest);
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
    return 0;
  }
  // emotion mode
  const i = args.indexOf("--emotion");
  if (i === -1) {
    printUsage();
    return 0;
  }
  const emotion = args[i + 1];
  if (!emotion || emotion.startsWith("--")) {
    console.error("No emotion specified.");
    printUsage();
    return 1;
  }
  const key = emotion.toLowerCase();
  if (emotions[key]) {
    console.log(emotions[key]);
    return 0;
  }
  console.error(`Unsupported emotion: ${emotion}`);
  console.error(
    `Supported emotions: ${Object.keys(emotions).join(", ")}`
  );
  return 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const code = main(args);
  process.exit(code);
}
