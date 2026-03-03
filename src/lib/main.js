#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { Command } from "commander";
import { ExpressionPlotter } from "./plotter.js";
import { parseExpression } from "./expression-parser.js";
import { parseRange } from "./range-parser.js";

export function main(args = []) {
  const program = new Command();

  program
    .name("plot-code-lib")
    .description("Transform mathematical expressions into beautiful plots")
    .version("0.1.0");

  program
    .option("-e, --expression <expr>", "Mathematical expression to plot (e.g., 'y=sin(x)')", "y=sin(x)")
    .option("-r, --range <range>", "Range for variables (e.g., 'x=-2π:2π,y=-2:2')", "x=-10:10,y=-10:10")
    .option("-f, --file <path>", "Output file path (supports .svg, .png)", "output.svg")
    .option("-w, --width <pixels>", "Plot width in pixels", "800")
    .option("-h, --height <pixels>", "Plot height in pixels", "600")
    .option("--points <number>", "Number of data points to generate", "1000")
    .option("--format <format>", "Output format (svg|png)", "svg")
    .option("--title <title>", "Plot title")
    .option("--dry-run", "Show what would be done without generating files")
    .action(async (options) => {
      try {
        // Parse the expression
        const expression = parseExpression(options.expression);
        console.log(`📐 Expression: ${expression.formula}`);
        
        // Parse the range
        const ranges = parseRange(options.range);
        
        // Display ranges appropriately based on expression type
        const rangeKeys = Object.keys(ranges);
        const rangeDisplay = rangeKeys.map(key => 
          `${key}=[${ranges[key].min}, ${ranges[key].max}]`
        ).join(', ');
        console.log(`📊 Range: ${rangeDisplay}`);
        
        if (options.dryRun) {
          console.log(`🔍 Dry run mode - would generate ${options.points} points`);
          console.log(`📁 Would save to: ${options.file}`);
          console.log(`📏 Dimensions: ${options.width}x${options.height}px`);
          return;
        }

        // Create the plotter
        const plotter = new ExpressionPlotter({
          width: parseInt(options.width),
          height: parseInt(options.height),
          title: options.title
        });

        // Generate the plot
        console.log("🔢 Generating data points...");
        await plotter.plot(expression, ranges, {
          points: parseInt(options.points),
          format: options.format,
          outputFile: options.file
        });

        console.log(`✅ Plot saved to: ${options.file}`);
        
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
    });

  // Add example command
  program
    .command("examples")
    .description("Show example commands")
    .action(() => {
      console.log("📚 Example commands:");
      console.log("");
      console.log("🌊 Basic sine wave:");
      console.log("  plot-code-lib -e 'y=sin(x)' -r 'x=-2π:2π,y=-2:2' -f sine.svg");
      console.log("");
      console.log("📈 Quadratic function:");
      console.log("  plot-code-lib -e 'y=x^2' -r 'x=-5:5,y=0:25' -f parabola.png");
      console.log("");
      console.log("🌀 Parametric spiral:");
      console.log("  plot-code-lib -e 'x=t*cos(t),y=t*sin(t)' -r 't=0:10π' -f spiral.svg");
      console.log("");
      console.log("📊 Multiple functions:");
      console.log("  plot-code-lib -e 'y=sin(x),y=cos(x)' -r 'x=-π:π,y=-1.5:1.5' -f trig.svg");
    });

  if (args.length === 0 && process.argv.length <= 2) {
    program.help();
    return;
  }

  return program.parse(args.length > 0 ? ["node", "main.js", ...args] : process.argv);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}