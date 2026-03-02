// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/expression-parser.js

import { evaluate, parse as mathParse } from 'mathjs';

/**
 * Parses and validates mathematical expressions
 */
export class ExpressionParser {
  constructor() {
    this.supportedVariables = new Set(['x', 't', 'time']);
  }

  /**
   * Parse a mathematical expression string
   * @param {string} expression - The expression to parse (e.g., "sin(x)", "y = cos(t)")
   * @returns {object} Parsed expression object
   */
  parse(expression) {
    try {
      // Handle y = f(x) format
      let cleanExpression = expression.trim();
      let variable = 'x';
      
      if (cleanExpression.includes('=')) {
        const parts = cleanExpression.split('=');
        if (parts.length !== 2) {
          throw new Error('Invalid equation format. Use format: y = f(x)');
        }
        cleanExpression = parts[1].trim();
        
        // Detect the variable used
        for (const v of this.supportedVariables) {
          if (cleanExpression.includes(v)) {
            variable = v;
            break;
          }
        }
      }

      // Parse with mathjs to validate syntax
      const parsed = mathParse(cleanExpression);
      
      return {
        original: expression,
        expression: cleanExpression,
        variable,
        parsed,
        isValid: true
      };
    } catch (error) {
      return {
        original: expression,
        expression: null,
        variable: null,
        parsed: null,
        isValid: false,
        error: error.message
      };
    }
  }

  /**
   * Evaluate an expression at a specific point
   * @param {object} parsedExpression - Result from parse()
   * @param {number} value - Value to substitute for the variable
   * @returns {number} Result of evaluation
   */
  evaluate(parsedExpression, value) {
    if (!parsedExpression.isValid) {
      throw new Error(`Cannot evaluate invalid expression: ${parsedExpression.error}`);
    }

    try {
      const scope = { [parsedExpression.variable]: value };
      return evaluate(parsedExpression.expression, scope);
    } catch (error) {
      throw new Error(`Evaluation failed at ${parsedExpression.variable}=${value}: ${error.message}`);
    }
  }

  /**
   * Generate time series data from an expression
   * @param {object} parsedExpression - Result from parse()
   * @param {object} range - Range object {min: number, max: number, steps: number}
   * @returns {Array} Array of {x, y} points
   */
  generateTimeSeries(parsedExpression, range = { min: -10, max: 10, steps: 100 }) {
    if (!parsedExpression.isValid) {
      throw new Error(`Cannot generate time series from invalid expression: ${parsedExpression.error}`);
    }

    const { min, max, steps } = range;
    const stepSize = (max - min) / (steps - 1);
    const points = [];

    for (let i = 0; i < steps; i++) {
      const x = min + i * stepSize;
      try {
        const y = this.evaluate(parsedExpression, x);
        // Skip invalid points (NaN, Infinity)
        if (isFinite(y)) {
          points.push({ x, y });
        }
      } catch (error) {
        // Skip points that can't be evaluated
        continue;
      }
    }

    return points;
  }

  /**
   * Parse range string like "x=-10:10" or "-5:5"
   * @param {string} rangeStr - Range string
   * @returns {object} Range object {min, max, steps}
   */
  parseRange(rangeStr, defaultSteps = 100) {
    if (!rangeStr) {
      return { min: -10, max: 10, steps: defaultSteps };
    }

    // Remove variable prefix if present (e.g., "x=-10:10" -> "-10:10")
    let range = rangeStr;
    if (range.includes('=')) {
      range = range.split('=')[1];
    }

    const parts = range.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid range format. Use format: min:max (e.g., "-10:10")');
    }

    const min = parseFloat(parts[0]);
    const max = parseFloat(parts[1]);

    if (isNaN(min) || isNaN(max)) {
      throw new Error('Range values must be numbers');
    }

    if (min >= max) {
      throw new Error('Range minimum must be less than maximum');
    }

    return { min, max, steps: defaultSteps };
  }
}

export default ExpressionParser;