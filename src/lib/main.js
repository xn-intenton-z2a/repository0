#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";

// Token types for mathematical expressions
const TokenType = {
  NUMBER: 'NUMBER',
  VARIABLE: 'VARIABLE',
  FUNCTION: 'FUNCTION',
  OPERATOR: 'OPERATOR',
  LEFT_PAREN: 'LEFT_PAREN',
  RIGHT_PAREN: 'RIGHT_PAREN',
  EOF: 'EOF'
};

// Mathematical functions supported
const MATH_FUNCTIONS = {
  'sin': Math.sin,
  'cos': Math.cos,
  'tan': Math.tan,
  'log': Math.log,
  'ln': Math.log,
  'exp': Math.exp,
  'sqrt': Math.sqrt,
  'abs': Math.abs,
  'floor': Math.floor,
  'ceil': Math.ceil,
  'round': Math.round
};

class Token {
  constructor(type, value, position = 0) {
    this.type = type;
    this.value = value;
    this.position = position;
  }
}

class Tokenizer {
  constructor(expression) {
    this.expression = expression.replace(/\s+/g, ''); // Remove whitespace
    this.position = 0;
  }

  peek() {
    return this.position < this.expression.length ? this.expression[this.position] : null;
  }

  advance() {
    return this.position < this.expression.length ? this.expression[this.position++] : null;
  }

  tokenize() {
    const tokens = [];
    
    while (this.position < this.expression.length) {
      const char = this.peek();
      
      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
      } else if (this.isAlpha(char)) {
        tokens.push(this.readIdentifier());
      } else if (this.isOperator(char)) {
        tokens.push(this.readOperator());
      } else if (char === '(') {
        tokens.push(new Token(TokenType.LEFT_PAREN, char, this.position));
        this.advance();
      } else if (char === ')') {
        tokens.push(new Token(TokenType.RIGHT_PAREN, char, this.position));
        this.advance();
      } else {
        throw new Error(`Unexpected character '${char}' at position ${this.position}`);
      }
    }
    
    tokens.push(new Token(TokenType.EOF, null, this.position));
    return tokens;
  }

  isDigit(char) {
    return char && /[0-9.]/.test(char);
  }

  isAlpha(char) {
    return char && /[a-zA-Z_]/.test(char);
  }

  isOperator(char) {
    return char && /[+\-*/^]/.test(char);
  }

  readNumber() {
    const start = this.position;
    let value = '';
    let hasDot = false;
    
    while (this.peek() && this.isDigit(this.peek())) {
      const char = this.peek();
      if (char === '.') {
        if (hasDot) break;
        hasDot = true;
      }
      value += this.advance();
    }
    
    return new Token(TokenType.NUMBER, parseFloat(value), start);
  }

  readIdentifier() {
    const start = this.position;
    let value = '';
    
    while (this.peek() && (this.isAlpha(this.peek()) || this.isDigit(this.peek()))) {
      value += this.advance();
    }
    
    const type = MATH_FUNCTIONS.hasOwnProperty(value) ? TokenType.FUNCTION : TokenType.VARIABLE;
    return new Token(type, value, start);
  }

  readOperator() {
    const start = this.position;
    const value = this.advance();
    return new Token(TokenType.OPERATOR, value, start);
  }
}

// AST Node types
class NumberNode {
  constructor(value) {
    this.value = value;
  }

  evaluate(variables = {}) {
    return this.value;
  }
}

class VariableNode {
  constructor(name) {
    this.name = name;
  }

  evaluate(variables = {}) {
    if (!(this.name in variables)) {
      throw new Error(`Undefined variable: ${this.name}`);
    }
    return variables[this.name];
  }
}

class BinaryOpNode {
  constructor(left, operator, right) {
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  evaluate(variables = {}) {
    const leftVal = this.left.evaluate(variables);
    const rightVal = this.right.evaluate(variables);
    
    switch (this.operator) {
      case '+': return leftVal + rightVal;
      case '-': return leftVal - rightVal;
      case '*': return leftVal * rightVal;
      case '/': 
        if (rightVal === 0) throw new Error('Division by zero');
        return leftVal / rightVal;
      case '^': return Math.pow(leftVal, rightVal);
      default:
        throw new Error(`Unknown operator: ${this.operator}`);
    }
  }
}

class UnaryOpNode {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;
  }

  evaluate(variables = {}) {
    const val = this.operand.evaluate(variables);
    
    switch (this.operator) {
      case '+': return +val;
      case '-': return -val;
      default:
        throw new Error(`Unknown unary operator: ${this.operator}`);
    }
  }
}

class FunctionNode {
  constructor(name, argument) {
    this.name = name;
    this.argument = argument;
  }

  evaluate(variables = {}) {
    const func = MATH_FUNCTIONS[this.name];
    if (!func) {
      throw new Error(`Unknown function: ${this.name}`);
    }
    
    const argVal = this.argument.evaluate(variables);
    return func(argVal);
  }
}

class ExpressionParser {
  constructor(expression) {
    this.tokens = new Tokenizer(expression).tokenize();
    this.position = 0;
  }

  peek() {
    return this.position < this.tokens.length ? this.tokens[this.position] : null;
  }

  advance() {
    return this.position < this.tokens.length ? this.tokens[this.position++] : null;
  }

  parse() {
    const result = this.parseExpression();
    if (this.peek().type !== TokenType.EOF) {
      throw new Error('Unexpected tokens after expression');
    }
    return result;
  }

  parseExpression() {
    return this.parseAddSubtract();
  }

  parseAddSubtract() {
    let left = this.parseMultiplyDivide();
    
    while (this.peek() && this.peek().type === TokenType.OPERATOR && 
           (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.advance().value;
      const right = this.parseMultiplyDivide();
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseMultiplyDivide() {
    let left = this.parseExponent();
    
    while (this.peek() && this.peek().type === TokenType.OPERATOR && 
           (this.peek().value === '*' || this.peek().value === '/')) {
      const operator = this.advance().value;
      const right = this.parseExponent();
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseExponent() {
    let left = this.parseUnary();
    
    if (this.peek() && this.peek().type === TokenType.OPERATOR && this.peek().value === '^') {
      const operator = this.advance().value;
      const right = this.parseExponent(); // Right associative
      left = new BinaryOpNode(left, operator, right);
    }
    
    return left;
  }

  parseUnary() {
    if (this.peek() && this.peek().type === TokenType.OPERATOR && 
        (this.peek().value === '+' || this.peek().value === '-')) {
      const operator = this.advance().value;
      const operand = this.parseUnary();
      return new UnaryOpNode(operator, operand);
    }
    
    return this.parsePrimary();
  }

  parsePrimary() {
    const token = this.peek();
    
    if (!token) {
      throw new Error('Unexpected end of expression');
    }
    
    if (token.type === TokenType.NUMBER) {
      this.advance();
      return new NumberNode(token.value);
    }
    
    if (token.type === TokenType.VARIABLE) {
      this.advance();
      return new VariableNode(token.value);
    }
    
    if (token.type === TokenType.FUNCTION) {
      const funcName = this.advance().value;
      if (this.peek().type !== TokenType.LEFT_PAREN) {
        throw new Error(`Expected '(' after function ${funcName}`);
      }
      this.advance(); // consume '('
      const argument = this.parseExpression();
      if (this.peek().type !== TokenType.RIGHT_PAREN) {
        throw new Error(`Expected ')' after function ${funcName} argument`);
      }
      this.advance(); // consume ')'
      return new FunctionNode(funcName, argument);
    }
    
    if (token.type === TokenType.LEFT_PAREN) {
      this.advance(); // consume '('
      const expression = this.parseExpression();
      if (this.peek().type !== TokenType.RIGHT_PAREN) {
        throw new Error("Expected ')'");
      }
      this.advance(); // consume ')'
      return expression;
    }
    
    throw new Error(`Unexpected token: ${token.type} '${token.value}'`);
  }
}

// Main API functions
export function parseExpression(expression) {
  const parser = new ExpressionParser(expression);
  return parser.parse();
}

export function evaluateExpression(expression, variables = {}) {
  const ast = parseExpression(expression);
  return ast.evaluate(variables);
}

export function generateTimeSeries(expression, xMin, xMax, steps = 100) {
  const ast = parseExpression(expression);
  const points = [];
  const step = (xMax - xMin) / (steps - 1);
  
  for (let i = 0; i < steps; i++) {
    const x = xMin + i * step;
    try {
      const y = ast.evaluate({ x });
      points.push({ x, y });
    } catch (error) {
      // Skip invalid points (e.g., division by zero, domain errors)
      continue;
    }
  }
  
  return points;
}

export function main(args) {
  if (args.length === 0) {
    console.log('plot-code-lib - Mathematical Expression Plotter');
    console.log('');
    console.log('Usage:');
    console.log('  node src/lib/main.js --expr "sin(x)" --range "-1:1" --output plot.svg');
    console.log('');
    console.log('Options:');
    console.log('  --expr     Mathematical expression (e.g., "sin(x)", "x^2 + 2*x + 1")');
    console.log('  --range    Range for x values (e.g., "-1:1", "0:10:0.1")');
    console.log('  --output   Output file name (default: plot.svg)');
    console.log('  --format   Output format: svg or png (default: svg)');
    console.log('');
    console.log('Examples:');
    console.log('  node src/lib/main.js --expr "sin(x)" --range "-3.14:3.14"');
    console.log('  node src/lib/main.js --expr "x^2" --range "-2:2" --output parabola.svg');
    console.log('  node src/lib/main.js --expr "log(x)" --range "0.1:10" --format png');
    return;
  }

  // Simple argument parsing for now
  const options = parseArgs(args);
  
  if (options.expr) {
    try {
      // Test expression parsing
      const ast = parseExpression(options.expr);
      console.log(`Successfully parsed expression: ${options.expr}`);
      
      // Generate sample data points
      const range = parseRange(options.range || '-1:1');
      const points = generateTimeSeries(options.expr, range.min, range.max, 10);
      
      console.log('Sample data points:');
      points.slice(0, 5).forEach(point => {
        console.log(`  x: ${point.x.toFixed(3)}, y: ${point.y.toFixed(3)}`);
      });
      
      if (points.length > 5) {
        console.log(`  ... and ${points.length - 5} more points`);
      }
      
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

function parseArgs(args) {
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--expr':
      case '--expression':
        options.expr = value;
        break;
      case '--range':
        options.range = value;
        break;
      case '--output':
        options.output = value;
        break;
      case '--format':
        options.format = value;
        break;
    }
  }
  
  return options;
}

function parseRange(rangeStr) {
  const parts = rangeStr.split(':');
  if (parts.length < 2) {
    throw new Error('Range must be in format "min:max" or "min:max:step"');
  }
  
  const min = parseFloat(parts[0]);
  const max = parseFloat(parts[1]);
  const step = parts.length > 2 ? parseFloat(parts[2]) : (max - min) / 100;
  
  if (isNaN(min) || isNaN(max) || isNaN(step)) {
    throw new Error('Invalid range values');
  }
  
  if (min >= max) {
    throw new Error('Range minimum must be less than maximum');
  }
  
  return { min, max, step };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
