#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// examples/api-usage.js

import { ExpressionPlotter } from '../src/lib/plotter.js';
import { parseExpression } from '../src/lib/expression-parser.js';
import { parseRange } from '../src/lib/range-parser.js';

/**
 * Example demonstrating the plot-code-lib JavaScript API
 */
async function apiExample() {
  console.log('📊 plot-code-lib JavaScript API Example\n');

  try {
    // Example 1: Simple sine wave
    console.log('🌊 Example 1: Sine Wave');
    const sineExpr = parseExpression('y=sin(x)');
    const sineRanges = parseRange('x=-2π:2π,y=-2:2');
    
    console.log(`Expression: ${sineExpr.formula}`);
    console.log(`Type: ${sineExpr.type}`);
    console.log(`Range: x=[${sineRanges.x.min.toFixed(2)}, ${sineRanges.x.max.toFixed(2)}]`);
    
    const sinePlotter = new ExpressionPlotter({
      width: 800,
      height: 600,
      title: 'Sine Wave Example'
    });
    
    await sinePlotter.plot(sineExpr, sineRanges, {
      points: 500,
      outputFile: 'examples/api-sine.svg'
    });
    console.log('✅ Sine wave saved to examples/api-sine.svg\n');

    // Example 2: Parametric spiral
    console.log('🌀 Example 2: Parametric Spiral');
    const spiralExpr = parseExpression('x=t*cos(t),y=t*sin(t)');
    const spiralRanges = parseRange('t=0:6π');
    
    console.log(`Expression: ${spiralExpr.formula}`);
    console.log(`Type: ${spiralExpr.type}`);
    console.log(`Independent variable: ${spiralExpr.independentVariable}`);
    
    const spiralPlotter = new ExpressionPlotter({
      width: 800,
      height: 600,
      title: 'Parametric Spiral'
    });
    
    await spiralPlotter.plot(spiralExpr, spiralRanges, {
      points: 1000,
      outputFile: 'examples/api-spiral.svg'
    });
    console.log('✅ Spiral saved to examples/api-spiral.svg\n');

    // Example 3: Polar rose
    console.log('🌹 Example 3: Polar Rose');
    const roseExpr = parseExpression('r=sin(4*theta)');
    const roseRanges = parseRange('theta=0:2π');
    
    console.log(`Expression: ${roseExpr.formula}`);
    console.log(`Type: ${roseExpr.type}`);
    
    const rosePlotter = new ExpressionPlotter({
      width: 600,
      height: 600,
      title: 'Four-Petaled Rose'
    });
    
    await rosePlotter.plot(roseExpr, roseRanges, {
      points: 800,
      outputFile: 'examples/api-rose.png'
    });
    console.log('✅ Rose saved to examples/api-rose.png\n');

    // Example 4: Custom evaluation
    console.log('🧮 Example 4: Manual Evaluation');
    const quadExpr = parseExpression('y=x^2+2*x+1');
    
    console.log('Evaluating at specific points:');
    for (let x = -3; x <= 3; x++) {
      const result = quadExpr.evaluate({ x });
      console.log(`  f(${x}) = ${result.y}`);
    }
    
    console.log('\n🎉 All examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the example if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  apiExample();
}

export { apiExample };