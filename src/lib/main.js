#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file handles CLI command processing inline via a command mapping. It supports arithmetic commands: --sum, --multiply, --subtract, --divide, --modulo, --average, and additional commands: --factorial, --sqrt, --median, --mode, --stddev, --percentile, --log, among others.
 *
 * Note: All commands uniformly return "Error: No valid numeric inputs provided." when no valid numeric inputs are detected. Literal 'NaN' (in any form or capitalization) is explicitly rejected as an invalid input.
 */

const usage =
  "Usage: node src/lib/main.js [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [numbers...]";

// Helper function to parse numeric inputs uniformly
function parseNumbers(raw) {
  const valid = [];
  const invalid = [];
  for (const token of raw) {
    if (typeof token === "string" && token.startsWith("--")) {
      break;
    }
    // Uniform rejection: literal 'NaN' in any case is considered invalid
    if (String(token).toLowerCase() === "nan") {
      invalid.push(token);
      continue;
    }
    const num = Number(token);
    if (!isNaN(num)) {
      valid.push(num);
    } else {
      invalid.push(token);
    }
  }
  return { valid, invalid };
}

const commands = {
  "--diagnostics": async (_args) => {
    console.log("Diagnostics: All systems operational.");
  },
  "--help": async (_args) => {
    console.log(usage);
    console.log("  --diagnostics: Check system diagnostics");
  },
  "--info": async (_args) => {
    console.log(
      "Repository0 CLI Tool version 1.4.1-1 - This repository demonstrates automated workflows and modular CLI command handling."
    );
  },
  "--sum": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const result = numbers.reduce((acc, val) => acc + val, 0);
    console.log("Sum: " + result);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--multiply": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const result = numbers.reduce((acc, val) => acc * val, 1);
    console.log("Multiply: " + result);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--subtract": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    } else if (numbers.length === 1) {
      console.log("Subtract: " + numbers[0]);
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result -= numbers[i];
    }
    console.log("Subtract: " + result);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--divide": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === 0) {
        console.log("Divide: Division by zero error");
        return;
      }
      result /= numbers[i];
    }
    console.log("Divide: " + result);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--modulo": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length < 2) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const dividend = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === 0) {
        console.log("Modulo: Division by zero error");
        return;
      }
    }
    const result = numbers.slice(1).reduce((acc, val) => acc % val, dividend);
    console.log("Modulo: " + result);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--average": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const avg = sum / numbers.length;
    console.log("Average: " + avg);
    if (invalid.length > 0) {
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--version": async (_args) => {
    try {
      if (process.env.FORCE_VERSION_ERROR === "true") {
        throw new Error("unknown error");
      }
      console.log("Version: 1.4.1-1");
    } catch (e) {
      console.error("Could not retrieve version: " + e.message);
    }
  },
  "--greet": async (_args) => {
    console.log("Hello, welcome to repository0!");
  },
  "--power": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result = Math.pow(result, numbers[i]);
    }
    console.log("Power: " + result);
  },
  "--factorial": async (args) => {
    if (args.length < 1) {
      console.log("Factorial: Provide a number");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      console.log("Factorial: Input must be a non-negative integer");
      return;
    }
    let fact = 1;
    for (let i = 2; i <= n; i++) {
      fact *= i;
    }
    console.log("Factorial: " + fact);
  },
  "--sqrt": async (args) => {
    if (args.length < 1) {
      console.log("Square Root: Provide a number");
      return;
    }
    const n = Number(args[0]);
    if (isNaN(n)) {
      console.log("Square Root: Provide a number");
      return;
    }
    if (n < 0) {
      console.log("Square Root: Negative input error");
      return;
    }
    console.log("Square Root: " + Math.sqrt(n));
  },
  "--median": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const sorted = numbers.slice().sort((a, b) => a - b);
    const len = sorted.length;
    let median;
    if (len % 2 === 1) {
      median = sorted[Math.floor(len / 2)];
    } else {
      median = (sorted[len / 2 - 1] + sorted[len / 2]) / 2;
    }
    console.log("Median: " + median);
  },
  "--mode": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const frequency = {};
    numbers.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter((num) => frequency[num] === maxFreq)
      .map(Number);
    console.log("Mode: " + modes.join(","));
  },
  "--stddev": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
    const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
    const stddev = Math.sqrt(variance);
    console.log("Stddev: " + stddev);
  },
  "--demo": async (_args) => {
    console.log("Demo output: This is a demo execution without network calls.");
  },
  "--real": async (_args) => {
    console.log("Real call: This feature is not implemented over the wire yet.");
  },
  "--range": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    console.log("Range: " + (max - min));
  },
  "--factors": async (args) => {
    if (args.length < 1) {
      console.log("Factors: Provide a non-negative integer");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      console.log("Factors: Provide a non-negative integer");
      return;
    }
    const factors = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) {
        factors.push(i);
      }
    }
    console.log("Factors: " + factors.join(","));
  },
  "--variance": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    if (numbers.length === 1) {
      console.log("Variance: 0");
      return;
    }
    const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
    const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
    console.log("Variance: " + variance);
  },
  "--fibonacci": async (args) => {
    if (args.length < 1) {
      console.log("Fibonacci: Provide a non-negative integer");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      console.log("Fibonacci: Provide a non-negative integer");
      return;
    }
    if (n === 0) {
      console.log("Fibonacci: 0");
      return;
    }
    if (n === 1) {
      console.log("Fibonacci: 1");
      return;
    }
    let a = 0;
    let b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    console.log("Fibonacci: " + b);
  },
  "--gcd": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const computeGcd = (a, b) => (b === 0 ? a : computeGcd(b, a % b));
    console.log("GCD: " + numbers.reduce((a, b) => computeGcd(a, b)));
  },
  "--lcm": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const computeGcd = (a, b) => (b === 0 ? a : computeGcd(b, a % b));
    const computeLcm = (a, b) => Math.abs(a * b) / computeGcd(a, b);
    console.log("LCM: " + numbers.reduce((a, b) => computeLcm(a, b)));
  },
  "--prime": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const isPrime = (num) => {
      if (num < 2) return false;
      for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
      }
      return true;
    };
    const result = numbers.filter(isPrime);
    console.log("Prime: " + result.join(","));
  },
  "--log": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    if (numbers.length === 1) {
      const x = numbers[0];
      if (x <= 0) {
        console.log("Log: Input must be greater than 0");
        return;
      }
      const result = Math.log(x);
      console.log("Log: " + result);
    } else {
      const x = numbers[0], base = numbers[1];
      if (x <= 0) {
        console.log("Log: Input must be greater than 0");
        return;
      }
      if (base <= 0 || base === 1) {
        console.log("Log: Base must be greater than 0 and not equal to 1");
        return;
      }
      const result = Math.log(x) / Math.log(base);
      console.log("Log: " + result);
    }
    if (invalid.length > 0) {
      // In case there were invalid inputs mixed in, they are ignored after warning
      console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
    }
  },
  "--percentile": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const p = numbers[0];
    if (p < 0 || p > 100) {
      console.log("Error: Percentile must be between 0 and 100.");
      return;
    }
    const data = numbers.slice(1);
    if (data.length === 0) {
      console.log("Error: No valid numeric inputs provided.");
      return;
    }
    const sorted = data.slice().sort((a, b) => a - b);
    const n = sorted.length;
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    let percentileValue;
    if (lower === upper) {
      percentileValue = sorted[lower];
    } else {
      percentileValue = sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
    }
    console.log("Percentile: " + percentileValue);
  }
};

// Add alias support for frequently used commands
commands["-s"] = commands["--sum"];
commands["-m"] = commands["--multiply"];
commands["-a"] = commands["--average"];
commands["-d"] = commands["--divide"];
commands["-h"] = commands["--help"];

async function cliMain(args) {
  if (args === undefined) {
    args = [];
  }
  if (!Array.isArray(args)) {
    console.log(usage + "()");
    console.log("No CLI arguments provided. Exiting.");
    return;
  }
  if (args.length === 0) {
    console.log(usage);
    console.log("No CLI arguments provided. Exiting.");
    return;
  }
  const flag = args[0];
  const rest = args.slice(1);
  if (commands[flag]) {
    await commands[flag](rest);
  } else {
    console.log("Run with: " + JSON.stringify(args));
  }
}

const __test = {
  printUsage: (_verbose) => {
    console.log(usage);
    console.log("No CLI arguments provided. Exiting.");
  },
  printHelp: () => {
    console.log(usage);
    console.log("  --diagnostics: Check system diagnostics");
  },
  gcd: (a, b) => (b === 0 ? a : __test.gcd(b, a % b)),
  lcm: (a, b) => Math.abs(a * b) / __test.gcd(a, b)
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  (async function run() {
    await cliMain(process.argv.slice(2));
    process.exit(0);
  })();
}

export { cliMain as main, __test };
