#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file now handles all CLI command processing inline, removing the dependency on an external
 * module that was causing build/test issues. The arithmetic commands (e.g., --sum, --multiply, --subtract, --divide, --modulo, --average, --power, --variance, --range) have been updated to uniformly return the error message "Error: No valid numeric inputs provided." when no valid numeric inputs are detected. Other commands such as --factorial, --sqrt, and --fibonacci retain their specialized error messaging.
 *
 * New statistical commands have been added:
 *    --median: Computes the median of the provided list of numbers (average of two middles for even numbers).
 *    --mode: Computes the mode(s) of the provided list of numbers and returns the most frequent value(s).
 *    --stddev: Computes the population standard deviation of the provided list of numbers.
 *
 * Note: The handling of literal 'NaN' inputs (in any case) as well as any tokens that appear to be additional flags (starting with "--") has been standardized across all arithmetic operations. When only 'NaN', other non-numeric values, or flag tokens are provided, the CLI will return the error message without any additional warnings.
 */

const usage = "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]";

// Helper function to parse numeric inputs uniformly
function parseNumbers(raw) {
  // Process tokens sequentially and stop if a token that looks like a flag is encountered
  const valid = [];
  const invalid = [];
  for (const token of raw) {
    if (typeof token === 'string' && token.startsWith('--')) {
      break;
    }
    // Explicitly treat literal 'NaN' (case insensitive) as invalid
    if (typeof token === 'string' && token.toLowerCase() === 'nan') {
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

async function cliMain(args) {
  // If no argument is provided, default to an empty array so that usage is printed without trailing parentheses
  if (args === undefined) {
    args = [];
  }

  // If args is not an array, treat as non-array input and print usage with extra parentheses
  if (!Array.isArray(args)) {
    console.log(usage + "()");
    console.log("No CLI arguments provided. Exiting.");
    return;
  }

  // If an empty array is passed, print usage without trailing parentheses
  if (args.length === 0) {
    console.log(usage);
    console.log("No CLI arguments provided. Exiting.");
    return;
  }

  const flag = args[0];
  switch (flag) {
    case undefined:
      console.log(usage);
      console.log("No CLI arguments provided. Exiting.");
      break;
    case "--diagnostics":
      console.log("Diagnostics: All systems operational.");
      break;
    case "--help":
      console.log(usage);
      console.log("  --diagnostics: Check system diagnostics");
      break;
    case "--info":
      console.log(`Repository0 CLI Tool version 1.4.1-1 - This repository demonstrates automated workflows and modular CLI command handling.`);
      break;
    case "--sum": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      }
      const result = numbers.reduce((acc, val) => acc + val, 0);
      console.log("Sum: " + result);
      if (invalid.length > 0) {
        console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
      }
      break;
    }
    case "--multiply": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      }
      const result = numbers.reduce((acc, val) => acc * val, 1);
      console.log("Multiply: " + result);
      if (invalid.length > 0) {
        console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
      }
      break;
    }
    case "--subtract": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else if (numbers.length === 1) {
        console.log("Subtract: " + numbers[0]);
      } else {
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
          result -= numbers[i];
        }
        console.log("Subtract: " + result);
      }
      if (invalid.length > 0) {
        console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
      }
      break;
    }
    case "--divide": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
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
      }
      break;
    }
    case "--modulo": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length < 2) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
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
      }
      break;
    }
    case "--average": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
        const avg = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
        console.log("Average: " + avg);
        if (invalid.length > 0) {
          console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
        }
      }
      break;
    }
    case "--version": {
      try {
        if (process.env.FORCE_VERSION_ERROR === "true") {
          throw new Error("unknown error");
        }
        console.log("Version: 1.4.1-1");
      } catch (e) {
        console.error("Could not retrieve version: " + e.message);
      }
      break;
    }
    case "--greet":
      console.log("Hello, welcome to repository0!");
      break;
    case "--power": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length < 2) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
          result = Math.pow(result, numbers[i]);
        }
        console.log("Power: " + result);
      }
      break;
    }
    case "--factorial": {
      if (args.length < 2) {
        console.log("Factorial: Provide a number");
      } else {
        const n = parseInt(args[1], 10);
        if (n < 0 || isNaN(n)) {
          console.log("Factorial: Input must be a non-negative integer");
        } else {
          let fact = 1;
          for (let i = 2; i <= n; i++) {
            fact *= i;
          }
          console.log("Factorial: " + fact);
        }
      }
      break;
    }
    case "--sqrt": {
      if (args.length < 2) {
        console.log("Square Root: Provide a number");
      } else {
        const n = Number(args[1]);
        if (isNaN(n)) {
          console.log("Square Root: Provide a number");
        } else if (n < 0) {
          console.log("Square Root: Negative input error");
        } else {
          console.log("Square Root: " + Math.sqrt(n));
        }
      }
      break;
    }
    case "--median": {
      const { valid: numbers } = parseNumbers(args.slice(1));
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
      break;
    }
    case "--mode": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      }
      const frequency = {};
      numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
      });
      const maxFreq = Math.max(...Object.values(frequency));
      const modes = Object.keys(frequency)
        .filter(num => frequency[num] === maxFreq)
        .map(Number);
      console.log("Mode: " + modes.join(","));
      break;
    }
    case "--stddev": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      }
      const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
      const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
      const stddev = Math.sqrt(variance);
      console.log("Stddev: " + stddev);
      break;
    }
    case "--demo":
      console.log("Demo output: This is a demo execution without network calls.");
      break;
    case "--real":
      console.log("Real call: This feature is not implemented over the wire yet.");
      break;
    case "--range": {
      const { valid: numbers, invalid } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
        const min = Math.min(...numbers);
        const max = Math.max(...numbers);
        console.log("Range: " + (max - min));
      }
      break;
    }
    case "--factors": {
      if (args.length < 2) {
        console.log("Factors: Provide a non-negative integer");
      } else {
        const n = parseInt(args[1], 10);
        if (n < 0 || isNaN(n)) {
          console.log("Factors: Provide a non-negative integer");
        } else {
          const factors = [];
          for (let i = 1; i <= n; i++) {
            if (n % i === 0) factors.push(i);
          }
          console.log("Factors: " + factors.join(","));
        }
      }
      break;
    }
    case "--variance": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length === 0) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else if (numbers.length === 1) {
        console.log("Variance: 0");
      } else {
        const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
        const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
        console.log("Variance: " + variance);
      }
      break;
    }
    case "--fibonacci": {
      if (args.length < 2) {
        console.log("Fibonacci: Provide a non-negative integer");
      } else {
        const n = parseInt(args[1], 10);
        if (isNaN(n) || n < 0) {
          console.log("Fibonacci: Provide a non-negative integer");
        } else if (n === 0) {
          console.log("Fibonacci: 0");
        } else if (n === 1) {
          console.log("Fibonacci: 1");
        } else {
          let a = 0, b = 1;
          for (let i = 2; i <= n; i++) {
            [a, b] = [b, a + b];
          }
          console.log("Fibonacci: " + b);
        }
      }
      break;
    }
    case "--gcd": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length < 2) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
        const computeGcd = (a, b) => b === 0 ? a : computeGcd(b, a % b);
        console.log("GCD: " + numbers.reduce((a, b) => computeGcd(a, b)));
      }
      break;
    }
    case "--lcm": {
      const { valid: numbers } = parseNumbers(args.slice(1));
      if (numbers.length < 2) {
        console.log("Error: No valid numeric inputs provided.");
        return;
      } else {
        const computeGcd = (a, b) => b === 0 ? a : computeGcd(b, a % b);
        const computeLcm = (a, b) => Math.abs(a * b) / computeGcd(a, b);
        console.log("LCM: " + numbers.reduce((a, b) => computeLcm(a, b)));
      }
      break;
    }
    case "--prime": {
      const { valid: numbers } = parseNumbers(args.slice(1));
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
      break;
    }
    default:
      console.log("Run with: " + JSON.stringify(args));
      break;
  }
}

const __test = {
  printUsage: (verbose) => {
    console.log(usage);
    console.log("No CLI arguments provided. Exiting.");
  },
  printHelp: () => {
    console.log(usage);
    console.log("  --diagnostics: Check system diagnostics");
  },
  gcd: (a, b) => {
    return b === 0 ? a : __test.gcd(b, a % b);
  },
  lcm: (a, b) => {
    return Math.abs(a * b) / __test.gcd(a, b);
  }
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  (async function run() {
    await cliMain(process.argv.slice(2));
    process.exit(0);
  })();
}

export { cliMain as main, __test };
