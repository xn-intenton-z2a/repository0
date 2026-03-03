#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/demo.js - Comprehensive demonstration of plot-code-lib capabilities

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "demo-output";
const CLI_PATH = "node src/lib/main.js";

/**
 * Demo runner that showcases all plot-code-lib capabilities
 */
class PlotCodeLibDemo {
  constructor() {
    this.examples = [];
    this.currentSection = "";
    
    // Ensure output directory exists
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }
  }

  /**
   * Add a section header
   */
  section(title) {
    this.currentSection = title;
    console.log(`\n=== ${title} ===`);
  }

  /**
   * Execute a command and track it as an example
   */
  run(command, description) {
    const fullCommand = `${CLI_PATH} ${command}`;
    console.log(`\n${description}`);
    console.log(`Command: ${fullCommand}`);
    
    try {
      const output = execSync(fullCommand, { encoding: 'utf8', cwd: '.' });
      console.log(`Output: ${output.trim()}`);
      
      this.examples.push({
        section: this.currentSection,
        description,
        command: fullCommand,
        output: output.trim()
      });
      
      return true;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return false;
    }
  }

  /**
   * Run all demonstration examples
   */
  async runAll() {
    console.log("🎯 plot-code-lib Comprehensive Demonstration");
    console.log("============================================");
    console.log("This demo showcases all features of the mathematical plotting library.");
    
    // Basic Function Plotting
    this.section("Basic Function Plotting");
    this.run(`plot -e "sin(x)" -r "x=0:2*pi" -o ${OUTPUT_DIR}/sine-wave.svg --title "Sine Wave"`, 
             "Generate a basic sine wave");
    this.run(`plot -e "x^2" -r "x=-3:3" -o ${OUTPUT_DIR}/parabola.svg --title "Quadratic Function"`, 
             "Plot a quadratic parabola");
    this.run(`plot -e "exp(-x)" -r "x=0:5" -o ${OUTPUT_DIR}/exponential-decay.svg --title "Exponential Decay"`, 
             "Show exponential decay function");

    // Multi-Expression Plotting
    this.section("Multi-Expression Plotting");
    this.run(`plot -e "sin(x),cos(x),tan(x)" -r "x=-pi:pi" -o ${OUTPUT_DIR}/trigonometric-comparison.svg --title "Trigonometric Functions"`, 
             "Compare trigonometric functions with automatic legend");
    this.run(`plot -e "Linear:x,Quadratic:x^2,Cubic:x^3" -r "x=-2:2" -o ${OUTPUT_DIR}/polynomial-comparison.png --title "Polynomial Functions"`, 
             "Compare polynomial functions with custom labels");
    this.run(`plot -e "Growth:exp(x),Decay:exp(-x)" -r "x=-2:2" -o ${OUTPUT_DIR}/exponential-comparison.svg --title "Exponential Growth vs Decay"`, 
             "Contrast exponential growth and decay");

    // High-Resolution PNG Output
    this.section("High-Resolution PNG Output");
    this.run(`plot -e "sin(5*x) * exp(-x/3)" -r "x=0:15:0.1" -o ${OUTPUT_DIR}/damped-oscillation.png --width 1920 --height 1080 --title "Damped Oscillation" --xlabel "Time (s)" --ylabel "Amplitude"`, 
             "Generate high-resolution PNG for presentations");

    // Parametric Curves
    this.section("Parametric Curves");
    this.run(`parametric -x "cos(t)" -y "sin(t)" -r "t=0:2*pi" -o ${OUTPUT_DIR}/unit-circle.svg --title "Unit Circle"`, 
             "Plot a unit circle using parametric equations");
    this.run(`parametric -x "16*sin(t)^3" -y "13*cos(t)-5*cos(2*t)-2*cos(3*t)-cos(4*t)" -r "t=0:2*pi" -o ${OUTPUT_DIR}/heart-curve.svg --title "Heart Curve"`, 
             "Generate a mathematical heart curve");
    this.run(`parametric -x "cos(5*t)*cos(t)" -y "cos(5*t)*sin(t)" -r "t=0:pi" -o ${OUTPUT_DIR}/rose-curve.svg --title "Rose Curve"`, 
             "Create a rose curve mathematical art");
    this.run(`parametric -x "t*cos(t)" -y "t*sin(t)" -r "t=0:6*pi:0.1" -o ${OUTPUT_DIR}/spiral.svg --title "Archimedes Spiral"`, 
             "Plot an Archimedes spiral");

    // Advanced Mathematical Functions
    this.section("Advanced Mathematical Functions");
    this.run(`plot -e "1/(1 + exp(-x))" -r "x=-6:6" -o ${OUTPUT_DIR}/sigmoid.svg --title "Sigmoid Function"`, 
             "Plot sigmoid activation function (ML/AI)");
    this.run(`plot -e "exp(-0.5*x^2) / sqrt(2*pi)" -r "x=-4:4" -o ${OUTPUT_DIR}/gaussian.svg --title "Gaussian Distribution"`, 
             "Generate standard normal distribution");
    this.run(`plot -e "sin(x)/x" -r "x=-20:20:0.1" -o ${OUTPUT_DIR}/sinc.svg --title "Sinc Function"`, 
             "Plot the sinc function (signal processing)");
    this.run(`plot -e "factorial(x)" -r "x=0:10:1" -o ${OUTPUT_DIR}/factorial.svg --title "Factorial Function"`, 
             "Show factorial growth");

    // Data Export Capabilities
    this.section("Data Export Capabilities");
    this.run(`export -e "sin(x)" -r "x=0:2*pi:0.1" -o ${OUTPUT_DIR}/sine-data.json --format geojson`, 
             "Export coordinate data as GeoJSON");
    this.run(`export -e "sin(x),cos(x)" -r "x=0:2*pi:0.1" -o ${OUTPUT_DIR}/trig-data.csv --format csv`, 
             "Export multi-expression data as CSV");
    this.run(`export -e "Growth:exp(x),Decay:exp(-x)" -r "x=0:3:0.5" -o ${OUTPUT_DIR}/exponential-data.json --format json`, 
             "Export labeled data as simple JSON");

    // Scientific/Engineering Examples
    this.section("Scientific & Engineering Examples");
    this.run(`plot -e "sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7" -r "x=0:4*pi" -o ${OUTPUT_DIR}/fourier-series.svg --title "Square Wave Fourier Approximation"`, 
             "Fourier series approximation of square wave");
    this.run(`plot -e "exp(-0.1*x) * cos(2*pi*x)" -r "x=0:10" -o ${OUTPUT_DIR}/damped-wave.svg --title "Damped Oscillation (RLC Circuit)"`, 
             "Model damped oscillation (electrical engineering)");
    this.run(`plot -e "1 - exp(-x/2)" -r "x=0:10" -o ${OUTPUT_DIR}/step-response.svg --title "First-Order System Step Response" --xlabel "Time" --ylabel "Response"`, 
             "Control systems step response");

    // Complex Parametric Art
    this.section("Mathematical Art & Visualization");
    this.run(`parametric -x "sin(3*t)" -y "sin(2*t)" -r "t=0:2*pi" -o ${OUTPUT_DIR}/lissajous.svg --title "Lissajous Curve"`, 
             "Generate Lissajous curve pattern");
    this.run(`parametric -x "cos(t) * (2 + cos(8*t))" -y "sin(t) * (2 + cos(8*t))" -r "t=0:2*pi" -o ${OUTPUT_DIR}/flower.svg --title "Mathematical Flower"`, 
             "Create mathematical flower art");

    // Edge Cases and Error Handling
    this.section("Edge Cases & Domain Handling");
    this.run(`plot -e "log(x)" -r "x=0.1:10" -o ${OUTPUT_DIR}/logarithm.svg --title "Natural Logarithm (Safe Domain)"`, 
             "Logarithm with proper domain (avoids log(0))");
    this.run(`plot -e "sqrt(x)" -r "x=-2:4" -o ${OUTPUT_DIR}/sqrt-clipped.svg --title "Square Root (Domain Clipped)"`, 
             "Square root with automatic domain clipping");
    this.run(`plot -e "1/x" -r "x=-2:2:0.1" -o ${OUTPUT_DIR}/reciprocal.svg --title "Reciprocal Function"`, 
             "Reciprocal function (handles division by zero)");

    // Performance Examples
    this.section("High-Resolution & Performance");
    this.run(`plot -e "sin(100*x)" -r "x=0:1:0.001" -o ${OUTPUT_DIR}/high-frequency.svg --title "High-Frequency Oscillation"`, 
             "High-frequency function with fine resolution");
    this.run(`parametric -x "sin(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -y "cos(t)*(exp(cos(t))-2*cos(4*t)-sin(t/12)^5)" -r "t=0:12*pi:0.1" -o ${OUTPUT_DIR}/butterfly.svg --title "Butterfly Curve"`, 
             "Complex parametric butterfly curve");

    this.printSummary();
  }

  /**
   * Print summary of all examples
   */
  printSummary() {
    console.log(`\n🎉 Demo Complete! Generated ${this.examples.length} examples in '${OUTPUT_DIR}/' directory.`);
    console.log("\n📊 Summary of Generated Files:");
    console.log("================================");
    
    const sections = {};
    this.examples.forEach(example => {
      if (!sections[example.section]) {
        sections[example.section] = [];
      }
      sections[example.section].push(example);
    });

    Object.keys(sections).forEach(sectionName => {
      console.log(`\n${sectionName}:`);
      sections[sectionName].forEach((example, i) => {
        console.log(`  ${i + 1}. ${example.description}`);
        // Extract output filename from command
        const outputMatch = example.command.match(/-o\s+([^\s]+)/);
        if (outputMatch) {
          console.log(`     File: ${outputMatch[1]}`);
        }
      });
    });

    console.log(`\n📁 All files saved in: ./${OUTPUT_DIR}/`);
    console.log("\n🚀 These examples demonstrate plot-code-lib's capabilities:");
    console.log("   • Mathematical function plotting (SVG/PNG)");
    console.log("   • Multi-expression comparisons with legends");
    console.log("   • Parametric curve generation");
    console.log("   • Data export (GeoJSON/CSV/JSON)");
    console.log("   • Scientific and engineering applications");
    console.log("   • Mathematical art and visualization");
    console.log("   • Error handling and domain management");
    console.log("   • High-resolution output generation");
    
    console.log("\n✨ Use these examples as templates for your own visualizations!");
    console.log("   Visit the README.md for detailed command reference and syntax.");
  }
}

// Run the demo
if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = new PlotCodeLibDemo();
  demo.runAll().catch(error => {
    console.error('Demo failed:', error.message);
    process.exit(1);
  });
}

export { PlotCodeLibDemo };