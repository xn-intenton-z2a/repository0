#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { create, all } from "mathjs";

const math = create(all);

const emotions = {
  happy: ":-)",
  sad: ":-(",
  angry: ">:-(",
  surprised: ":-O",
};

function printUsage() {
  console.log("Usage: --emotion <name>");
  console.log(
    `Supported emotions: ${Object.keys(emotions).join(", ")}`
  );
}

export function main(args = []) {
  const emotionIndex = args.indexOf("--emotion");
  const plotIndex = args.indexOf("--plot");
  const serveIndex = args.indexOf("--serve");

  // Console plotting mode
  if (plotIndex >= 0) {
    // Conflict with other modes
    if (emotionIndex >= 0 || serveIndex >= 0) {
      console.error("Conflicting options: --plot cannot be used with --emotion or --serve.");
      console.error("Usage:");
      console.error("  --emotion <name>");
      console.error("  --plot <equation>");
      return 1;
    }
    const equation = args[plotIndex + 1];
    if (!equation) {
      console.error("No equation specified.");
      console.error("Usage: --plot <equation>");
      return 1;
    }
    let compiled;
    try {
      const expr = math.parse(equation);
      compiled = expr.compile();
    } catch (err) {
      console.error(`Invalid equation: ${err.message}`);
      console.error("Usage: --plot <equation>");
      return 1;
    }

    const samples = 80;
    const rows = 20;
    const xMin = -10;
    const xMax = 10;
    const xs = [];
    const ys = [];
    const step = (xMax - xMin) / (samples - 1);

    for (let i = 0; i < samples; i++) {
      const x = xMin + step * i;
      xs.push(x);
      try {
        const y = compiled.evaluate({ x });
        if (typeof y !== "number" || Number.isNaN(y) || !isFinite(y)) {
          throw new Error("Non-finite result");
        }
        ys.push(y);
      } catch (err) {
        console.error(`Invalid equation: ${err.message}`);
        console.error("Usage: --plot <equation>");
        return 1;
      }
    }

    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const grid = Array.from({ length: rows }, () => Array(samples).fill(" "));

    if (maxY === minY) {
      // Constant function: plot middle row
      const rowIndex = Math.floor(rows / 2);
      for (let i = 0; i < samples; i++) {
        grid[rowIndex][i] = "*";
      }
    } else {
      let rowZero = null;
      let colZero = null;
      // Draw horizontal axis
      if (minY <= 0 && maxY >= 0) {
        rowZero = Math.round((1 - (0 - minY) / (maxY - minY)) * (rows - 1));
        for (let c = 0; c < samples; c++) {
          grid[rowZero][c] = "-";
        }
      }
      // Draw vertical axis
      if (xMin <= 0 && xMax >= 0) {
        colZero = Math.round((0 - xMin) / (xMax - xMin) * (samples - 1));
        for (let r = 0; r < rows; r++) {
          grid[r][colZero] = "|";
        }
      }
      // Intersection
      if (rowZero !== null && colZero !== null) {
        grid[rowZero][colZero] = "+";
      }
      // Plot data points
      for (let i = 0; i < samples; i++) {
        const y = ys[i];
        const norm = (y - minY) / (maxY - minY);
        const rowIndex = Math.round((1 - norm) * (rows - 1));
        const colIndex = i;
        if (rowIndex === rowZero && colIndex === colZero) {
          grid[rowIndex][colIndex] = "+";
        } else {
          grid[rowIndex][colIndex] = "*";
        }
      }
    }

    // Print grid
    for (const row of grid) {
      console.log(row.join(""));
    }
    return 0;
  }

  // Emotion mode
  if (emotionIndex === -1) {
    printUsage();
    return 0;
  }
  const emotion = args[emotionIndex + 1];
  if (!emotion) {
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
