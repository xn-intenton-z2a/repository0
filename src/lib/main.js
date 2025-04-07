#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file now handles all CLI command processing inline, removing the dependency on an external
 * module that was causing build/test issues. The functionality has been retained to support CLI commands
 * including diagnostics, help, arithmetic operations, and more.
 */

const usage = "Usage: node src/lib/main.js [--diagnostics] [--help] [--version] [--greet] [--info] [--sum] [--multiply] [--subtract] [--divide] [--modulo] [--average] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [numbers...]";

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
      console.log(`Repository0 CLI Tool version 1.4.1-0 - This repository demonstrates automated workflows and modular CLI command handling.`);
      break;
    case "--sum": {
      const raw = args.slice(1);
      const numbers = raw.map(x => Number(x)).filter(n => !isNaN(n));
      const invalid = raw.filter(x => isNaN(Number(x)));
      const result = numbers.reduce((acc, val) => acc + val, 0);
      console.log("Sum: " + result);
      if (invalid.length > 0) {
        console.warn("Warning: These inputs were not valid numbers and have been ignored: " + invalid.join(","));
      }
      break;
    }
    case "--multiply": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      const result = numbers.length === 0 ? 1 : numbers.reduce((acc, val) => acc * val, 1);
      console.log("Multiply: " + result);
      break;
    }
    case "--subtract": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length === 0) {
        console.log("Subtract: No numbers provided");
      } else if (numbers.length === 1) {
        console.log("Subtract: " + numbers[0]);
      } else {
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
          result -= numbers[i];
        }
        console.log("Subtract: " + result);
      }
      break;
    }
    case "--divide": {
      const raw = args.slice(1);
      const numbers = raw.map(Number).filter(n => !isNaN(n));
      const invalid = raw.filter(x => isNaN(Number(x)));
      if (numbers.length === 0) {
        console.log("Divide: No numbers provided");
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
      const raw = args.slice(1);
      const numbers = raw.map(Number).filter(n => !isNaN(n));
      const invalid = raw.filter(x => isNaN(Number(x)));
      if (numbers.length < 2) {
        console.log("Modulo: Provide at least two numbers");
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
      const raw = args.slice(1);
      const numbers = raw.map(Number).filter(n => !isNaN(n));
      const invalid = raw.filter(x => isNaN(Number(x)));
      if (numbers.length === 0) {
        console.log("Average: No numbers provided");
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
        console.log("Version: 1.4.1-0");
      } catch (e) {
        console.error("Could not retrieve version: " + e.message);
      }
      break;
    }
    case "--greet":
      console.log("Hello, welcome to repository0!");
      break;
    case "--power": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length < 2) {
        console.log("Power: Provide at least two numbers (base and exponent)");
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
    case "--demo":
      console.log("Demo output: This is a demo execution without network calls.");
      break;
    case "--real":
      console.log("Real call: This feature is not implemented over the wire yet.");
      break;
    case "--range": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length === 0) {
        console.log("Range: No numbers provided");
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
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length === 0) {
        console.log("Variance: No numbers provided");
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
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length < 2) {
        console.log("GCD: Provide at least two numbers");
      } else {
        const computeGcd = (a, b) => b === 0 ? a : computeGcd(b, a % b);
        console.log("GCD: " + numbers.reduce((a, b) => computeGcd(a, b)));
      }
      break;
    }
    case "--lcm": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
      if (numbers.length < 2) {
        console.log("LCM: Provide at least two numbers");
      } else {
        const computeGcd = (a, b) => b === 0 ? a : computeGcd(b, a % b);
        const computeLcm = (a, b) => Math.abs(a * b) / computeGcd(a, b);
        console.log("LCM: " + numbers.reduce((a, b) => computeLcm(a, b)));
      }
      break;
    }
    case "--prime": {
      const numbers = args.slice(1).map(Number).filter(n => !isNaN(n));
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
