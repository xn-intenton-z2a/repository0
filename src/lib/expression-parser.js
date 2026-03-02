// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/expression-parser.js

import { parse, evaluate, create, all } from "mathjs";

const math = create(all);

/**
 * Parse a mathematical expression into a structured format
 * Supports formats like:
 * - "y=sin(x)" (explicit function)
 * - "sin(x)" (implicit y= function)
 * - "x=t*cos(t),y=t*sin(t)" (parametric)
 * - "r=1+cos(theta)" (polar)
 */
export function parseExpression(expressionString) {
  if (!expressionString || typeof expressionString !== 'string') {
    throw new Error('Expression must be a non-empty string');
  }

  const expressions = expressionString.split(',').map(expr => expr.trim());
  const parsedExpressions = [];

  for (const expr of expressions) {
    if (expr.includes('=')) {
      // Explicit format: "y=sin(x)" or "x=cos(t),y=sin(t)"
      const [left, right] = expr.split('=').map(s => s.trim());
      parsedExpressions.push({
        variable: left,
        expression: right,
        compiled: math.parse(right).compile()
      });
    } else {
      // Implicit format: "sin(x)" assumes "y=sin(x)"
      parsedExpressions.push({
        variable: 'y',
        expression: expr,
        compiled: math.parse(expr).compile()
      });
    }
  }

  // Determine the type of plot
  const variables = parsedExpressions.map(p => p.variable);
  let type = 'cartesian';
  let independentVar = 'x';
  
  if (variables.includes('r')) {
    // Check if any expression mentions theta or θ
    const hasAngleVar = parsedExpressions.some(p => 
      p.expression.includes('theta') || p.expression.includes('θ')
    );
    if (hasAngleVar || variables.includes('theta') || variables.includes('θ')) {
      type = 'polar';
      independentVar = variables.includes('theta') ? 'theta' : 
                      variables.includes('θ') ? 'θ' : 'theta';
    }
  } else if (variables.includes('x') && variables.includes('y') && 
             !variables.some(v => v !== 'x' && v !== 'y')) {
    // Parametric if both x and y are defined explicitly
    const hasParam = parsedExpressions.some(p => {
      const expr = p.expression;
      return expr.includes('t') && !expr.includes('x') && !expr.includes('y');
    });
    if (hasParam) {
      type = 'parametric';
      independentVar = 't';
    }
  }

  return {
    formula: expressionString,
    type,
    independentVariable: independentVar,
    expressions: parsedExpressions,
    evaluate: (scope) => {
      const results = {};
      for (const parsed of parsedExpressions) {
        try {
          results[parsed.variable] = parsed.compiled.evaluate(scope);
        } catch (error) {
          throw new Error(`Error evaluating expression for ${parsed.variable}: ${error.message}`);
        }
      }
      return results;
    }
  };
}