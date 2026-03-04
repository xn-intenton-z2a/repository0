#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Comprehensive example generation script for plot-code-lib
// This script demonstrates all features and generates example output

import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Ensure examples directory exists
const examplesDir = 'examples';
if (!existsSync(examplesDir)) {
  mkdirSync(examplesDir, { recursive: true });
}

/**
 * Execute a plot command and log the result
 * @param {string} description - Description of what this example demonstrates
 * @param {string} command - The command to execute
 */
function runExample(description, command) {
  console.log(`\n📊 ${description}`);
  console.log(`   Command: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
    console.log(`   ✅ Success: ${output.split('\n').find(line => line.includes('Plot saved'))}`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

console.log('🚀 plot-code-lib - Comprehensive Examples Generation');
console.log('='.repeat(60));

// Basic Mathematical Functions
console.log('\n📈 BASIC MATHEMATICAL FUNCTIONS');
console.log('-'.repeat(40));

runExample(
  'Basic sine wave (SVG)',
  'node src/lib/main.js plot --expression "sin(x)" --range "x=-6.28:6.28" --file examples/demo_sine.svg --title "f(x) = sin(x)"'
);

runExample(
  'Cosine wave (PNG format)',
  'node src/lib/main.js plot --expression "cos(x)" --range "x=-6.28:6.28" --file examples/demo_cosine.png --title "f(x) = cos(x)"'
);

runExample(
  'Quadratic function',
  'node src/lib/main.js plot --expression "x^2" --range "x=-5:5" --file examples/demo_quadratic.svg --title "f(x) = x²"'
);

runExample(
  'Cubic polynomial',
  'node src/lib/main.js plot --expression "x^3 - 6*x^2 + 9*x - 4" --range "x=-1:6" --file examples/demo_cubic.svg --title "f(x) = x³ - 6x² + 9x - 4"'
);

runExample(
  'Square root function',
  'node src/lib/main.js plot --expression "sqrt(x)" --range "x=0:10" --file examples/demo_sqrt.svg --title "f(x) = √x"'
);

// Trigonometric Functions
console.log('\n🌊 TRIGONOMETRIC FUNCTIONS');
console.log('-'.repeat(40));

runExample(
  'Tangent function (limited range)',
  'node src/lib/main.js plot --expression "tan(x)" --range "x=-1.4:1.4" --file examples/demo_tangent.png --title "f(x) = tan(x)"'
);

runExample(
  'Multiple trigonometric periods',
  'node src/lib/main.js plot --expression "sin(2*x)" --range "x=-6.28:6.28" --file examples/demo_sine_double.svg --title "f(x) = sin(2x)"'
);

runExample(
  'Phase-shifted cosine',
  'node src/lib/main.js plot --expression "cos(x + pi/4)" --range "x=-6.28:6.28" --file examples/demo_cosine_shift.svg --title "f(x) = cos(x + π/4)"'
);

// Exponential and Logarithmic
console.log('\n🚀 EXPONENTIAL & LOGARITHMIC FUNCTIONS');
console.log('-'.repeat(40));

runExample(
  'Natural exponential',
  'node src/lib/main.js plot --expression "exp(x)" --range "x=-3:3" --file examples/demo_exp.svg --title "f(x) = eˣ"'
);

runExample(
  'Natural logarithm',
  'node src/lib/main.js plot --expression "log(x)" --range "x=0.1:10" --file examples/demo_log.svg --title "f(x) = ln(x)"'
);

runExample(
  'Exponential decay',
  'node src/lib/main.js plot --expression "exp(-x/2)" --range "x=0:10" --file examples/demo_decay.svg --title "f(x) = e^(-x/2)"'
);

runExample(
  'Sigmoid function (ML activation)',
  'node src/lib/main.js plot --expression "1/(1+exp(-x))" --range "x=-8:8" --file examples/demo_sigmoid.png --title "σ(x) = 1/(1+e^(-x))"'
);

// Complex and Composite Functions
console.log('\n🎯 COMPLEX & COMPOSITE FUNCTIONS');
console.log('-'.repeat(40));

runExample(
  'Damped oscillation (high resolution)',
  'node src/lib/main.js plot --expression "exp(-x^2/8)*cos(2*x)" --range "x=-8:8" --file examples/demo_damped.svg --steps 200 --title "Damped Oscillation: e^(-x²/8)·cos(2x)"'
);

runExample(
  'Product of trigonometric functions',
  'node src/lib/main.js plot --expression "sin(x) * cos(x/2)" --range "x=-12:12" --file examples/demo_trig_product.svg --title "f(x) = sin(x)·cos(x/2)"'
);

runExample(
  'Gaussian (normal distribution)',
  'node src/lib/main.js plot --expression "exp(-x^2/2)/sqrt(2*pi)" --range "x=-4:4" --file examples/demo_gaussian.png --title "φ(x) = e^(-x²/2)/√(2π)"'
);

runExample(
  'Absolute value composite',
  'node src/lib/main.js plot --expression "abs(sin(x)) + 0.5*cos(x/3)" --range "x=-15:15" --file examples/demo_abs_composite.svg --title "f(x) = |sin(x)| + 0.5·cos(x/3)"'
);

runExample(
  'Modulated sine wave',
  'node src/lib/main.js plot --expression "sin(5*x)*exp(-x^2/10)" --range "x=-5:5" --file examples/demo_modulated.svg --steps 300 --title "Amplitude Modulated: sin(5x)·e^(-x²/10)"'
);

// Edge Cases and Advanced Features
console.log('\n⚡ EDGE CASES & ADVANCED FEATURES');
console.log('-'.repeat(40));

runExample(
  'Rational function (with asymptotes)',
  'node src/lib/main.js plot --expression "1/(x^2-1)" --range "x=-3:3" --file examples/demo_rational.svg --title "f(x) = 1/(x²-1)"'
);

runExample(
  'Piecewise-like using conditional logic',
  'node src/lib/main.js plot --expression "x > 0 ? x^2 : -x^2" --range "x=-3:3" --file examples/demo_conditional.svg --title "f(x) = x² if x>0, else -x²"'
);

runExample(
  'High-frequency oscillation',
  'node src/lib/main.js plot --expression "sin(20*x)/x" --range "x=0.1:10" --file examples/demo_high_freq.png --steps 500 --title "f(x) = sin(20x)/x"'
);

// Test different ranges and formats
console.log('\n🔬 RANGE & FORMAT TESTING');
console.log('-'.repeat(40));

runExample(
  'Very small range (precision test)',
  'node src/lib/main.js plot --expression "sin(100*x)" --range "x=-0.1:0.1" --file examples/demo_small_range.svg --steps 200 --title "Precision Test: sin(100x) on [-0.1, 0.1]"'
);

runExample(
  'Large range test',
  'node src/lib/main.js plot --expression "sin(x)/x" --range "x=-50:50" --file examples/demo_large_range.png --steps 500 --title "Large Range: sinc(x) = sin(x)/x"'
);

runExample(
  'Implicit expression format (no y=)',
  'node src/lib/main.js plot --expression "x^3 - 3*x + 1" --range "x=-2:2" --file examples/demo_implicit.svg --title "Implicit Format: x³ - 3x + 1"'
);

// Mathematical Constants and Special Functions
console.log('\n🔢 CONSTANTS & SPECIAL FUNCTIONS');
console.log('-'.repeat(40));

runExample(
  'Using mathematical constants',
  'node src/lib/main.js plot --expression "sin(pi*x)" --range "x=-2:2" --file examples/demo_constants.svg --title "f(x) = sin(πx)"'
);

runExample(
  'Hyperbolic functions',
  'node src/lib/main.js plot --expression "tanh(x)" --range "x=-5:5" --file examples/demo_tanh.svg --title "f(x) = tanh(x)"'
);

console.log('\n✨ EXAMPLE GENERATION COMPLETE!');
console.log('='.repeat(60));
console.log('\nGenerated comprehensive examples demonstrating:');
console.log('• Basic mathematical functions (linear, quadratic, cubic, roots)');
console.log('• Trigonometric functions (sin, cos, tan, phase shifts)'); 
console.log('• Exponential & logarithmic functions');
console.log('• Complex composite functions');
console.log('• Edge cases and advanced mathematical expressions');
console.log('• Both SVG and PNG output formats');
console.log('• Variable resolution (100-500 steps)');
console.log('• Range customization and precision testing');
console.log('• Mathematical constants and special functions');
console.log('\nAll examples saved to examples/ directory');
console.log('View the generated plots to see plot-code-lib capabilities!');