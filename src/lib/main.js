#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file handles CLI command processing inline via a command mapping. It supports arithmetic commands: --sum, --multiply, --subtract, --divide, --modulo, --average, and additional commands: --factorial, --sqrt, --median, --mode, --stddev, --percentile, --log, among others.
 *
 * Note: All commands uniformly return "Error: No valid numeric inputs provided." when no valid numeric inputs are detected. Literal 'NaN' (in any form or capitalization) is explicitly rejected as an invalid input by default unless allowed via configuration.
 *
 * New Feature: Global JSON Output Mode with optional pretty-printing. When the global flag --json is provided, all command outputs are returned as structured JSON objects for easier machine integration. Supplying --json-pretty outputs formatted JSON with 2-space indentation for improved readability.
 *
 * Enhancement: Extended Global JSON Output Mode now includes additional metadata fields:
 *   - timestamp: The ISO formatted time of command execution
 *   - version: The current tool version
 *   - executionDuration: The time taken in milliseconds to execute the command
 *   - inputEcho: The cleansed input parameters after filtering global flags
 *
 * Enhancement: Introduced a configurable mechanism for disallowed tokens in numeric parsing. By default, any token matching 'NaN' (in any casing) is rejected. Users can override this behavior by setting the environment variable INVALID_TOKENS (as a comma-separated list), which determines the tokens to reject.
 *
 * Refactor: The input parsing function has been refactored to use a helper function for generating warning messages, ensuring uniform rejection of any case variant of configured invalid tokens and consistent positional indexing for invalid inputs. Multiple invalid tokens designated by the configuration now share the same positional index in warnings.
 */

const TOOL_VERSION = '1.4.1-1';

const usage =
  "Usage: node src/lib/main.js [--json] [--json-pretty] [--diagnostics] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [numbers...]";

// Global flags for JSON output mode
let jsonMode = false;
let jsonPretty = false;

// Global variables to hold start time and cleansed input for JSON metadata
let __startTime = 0;
let __inputEcho = [];

// Helper functions to output success or error messages based on JSON mode
function sendSuccess(command, result, warnings) {
  if (jsonMode) {
    const output = {
      command,
      result,
      warnings: warnings ? warnings : [],
      timestamp: new Date().toISOString(),
      version: TOOL_VERSION,
      executionDuration: Date.now() - __startTime,
      inputEcho: __inputEcho
    };
    console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
  } else {
    console.log(String(result));
    if (warnings && warnings.length > 0) {
      warnings.forEach(msg => console.warn(msg));
    }
  }
}

function sendError(command, errorMessage, warnings) {
  if (jsonMode) {
    const output = {
      command,
      error: errorMessage,
      warnings: warnings ? warnings : [],
      timestamp: new Date().toISOString(),
      version: TOOL_VERSION,
      executionDuration: Date.now() - __startTime,
      inputEcho: __inputEcho
    };
    console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
  } else {
    console.log(String(errorMessage));
    if (warnings && warnings.length > 0) {
      warnings.forEach(msg => console.warn(msg));
    }
  }
}

// Helper function to generate a standardized warning message
function generateWarning(pos, token) {
  return `(position ${pos}): ${token}`;
}

// Optimized helper function to parse numeric inputs with detailed error reporting
// This implementation uses a configurable list of disallowed tokens (defaulting to variations of 'NaN')
// Users can override the disallowed tokens by setting the environment variable INVALID_TOKENS as a comma-separated list.
// Tokens in the disallowed list are rejected using a fixed positional index for consistency, while other invalid tokens use the current valid token index.
function parseNumbers(raw) {
  const valid = [];
  const invalid = [];
  let posValid = 0;
  const fixedInvalidPos = 0;
  // Get the list of tokens to reject from environment variable; if not set, default to ['nan'].
  const configInvalid = (process.env.INVALID_TOKENS !== undefined)
    ? process.env.INVALID_TOKENS.split(',').map(s => s.trim().toLowerCase()).filter(s => s !== '')
    : ['nan'];

  for (let i = 0; i < raw.length; i++) {
    const token = raw[i];
    const str = String(token).trim();
    // Skip if a flag is encountered
    if (str.startsWith('--')) {
      continue;
    }
    const tokenLower = str.toLowerCase();
    // If token is in the configured invalid tokens, use fixed index
    if (configInvalid.includes(tokenLower)) {
      invalid.push(generateWarning(fixedInvalidPos, token));
      continue;
    }
    const num = Number(str);
    if (!isNaN(num)) {
      valid.push(num);
      posValid++;
    } else {
      invalid.push(generateWarning(posValid, token));
      posValid++;
    }
  }
  return { valid, invalid };
}

const commands = {
  "--diagnostics": async (_args) => {
    sendSuccess("diagnostics", "Diagnostics: All systems operational.");
  },
  "--help": async (_args) => {
    const message = usage + "\n  --diagnostics: Check system diagnostics";
    sendSuccess("help", message);
  },
  "--info": async (_args) => {
    sendSuccess("info", "Repository0 CLI Tool version " + TOOL_VERSION + " - This repository demonstrates automated workflows and modular CLI command handling.");
  },
  "--sum": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("sum", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    const result = numbers.reduce((acc, val) => acc + val, 0);
    sendSuccess("sum", result, invalid);
  },
  "--multiply": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("multiply", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    const result = numbers.reduce((acc, val) => acc * val, 1);
    sendSuccess("multiply", result, invalid);
  },
  "--subtract": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("subtract", "Error: No valid numeric inputs provided.", invalid);
      return;
    } else if (numbers.length === 1) {
      sendSuccess("subtract", numbers[0], invalid);
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result -= numbers[i];
    }
    sendSuccess("subtract", result, invalid);
  },
  "--divide": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("divide", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === 0) {
        sendError("divide", "Divide: Division by zero error");
        return;
      }
      result /= numbers[i];
    }
    sendSuccess("divide", result, invalid);
  },
  "--modulo": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length < 2) {
      sendError("modulo", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    const dividend = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i] === 0) {
        sendError("modulo", "Modulo: Division by zero error");
        return;
      }
    }
    const result = numbers.slice(1).reduce((acc, val) => acc % val, dividend);
    sendSuccess("modulo", result, invalid);
  },
  "--average": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("average", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const avg = sum / numbers.length;
    sendSuccess("average", avg, invalid);
  },
  "--version": async (_args) => {
    try {
      if (process.env.FORCE_VERSION_ERROR === "true") {
        throw new Error("unknown error");
      }
      sendSuccess("version", "Version: " + TOOL_VERSION);
    } catch (e) {
      sendError("version", "Could not retrieve version: " + e.message);
    }
  },
  "--greet": async (_args) => {
    sendSuccess("greet", "Hello, welcome to repository0!");
  },
  "--power": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      sendError("power", "Error: No valid numeric inputs provided.");
      return;
    }
    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result = Math.pow(result, numbers[i]);
    }
    sendSuccess("power", result);
  },
  "--factorial": async (args) => {
    if (args.length < 1) {
      sendError("factorial", "Factorial: Provide a number");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      sendError("factorial", "Factorial: Input must be a non-negative integer");
      return;
    }
    let fact = 1;
    for (let i = 2; i <= n; i++) {
      fact *= i;
    }
    sendSuccess("factorial", fact);
  },
  "--sqrt": async (args) => {
    if (args.length < 1) {
      sendError("sqrt", "Square Root: Provide a number");
      return;
    }
    const n = Number(args[0]);
    if (isNaN(n)) {
      sendError("sqrt", "Square Root: Provide a number");
      return;
    }
    if (n < 0) {
      sendError("sqrt", "Square Root: Negative input error");
      return;
    }
    sendSuccess("sqrt", Math.sqrt(n));
  },
  "--median": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("median", "Error: No valid numeric inputs provided.");
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
    sendSuccess("median", median);
  },
  "--mode": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("mode", "Error: No valid numeric inputs provided.");
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
    sendSuccess("mode", modes.join(","));
  },
  "--stddev": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("stddev", "Error: No valid numeric inputs provided.");
      return;
    }
    const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
    const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
    const stddev = Math.sqrt(variance);
    sendSuccess("stddev", stddev);
  },
  "--demo": async (_args) => {
    sendSuccess("demo", "Demo output: This is a demo execution without network calls.");
  },
  "--real": async (_args) => {
    sendSuccess("real", "Real call: This feature is not implemented over the wire yet.");
  },
  "--range": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("range", "Error: No valid numeric inputs provided.");
      return;
    }
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    sendSuccess("range", max - min);
  },
  "--factors": async (args) => {
    if (args.length < 1) {
      sendError("factors", "Factors: Provide a non-negative integer");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      sendError("factors", "Factors: Provide a non-negative integer");
      return;
    }
    const factors = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) {
        factors.push(i);
      }
    }
    sendSuccess("factors", factors.join(","));
  },
  "--variance": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("variance", "Error: No valid numeric inputs provided.");
      return;
    }
    if (numbers.length === 1) {
      sendSuccess("variance", 0);
      return;
    }
    const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
    const variance = numbers.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / numbers.length;
    sendSuccess("variance", variance);
  },
  "--fibonacci": async (args) => {
    if (args.length < 1) {
      sendError("fibonacci", "Fibonacci: Provide a non-negative integer");
      return;
    }
    const n = parseInt(args[0], 10);
    if (isNaN(n) || n < 0) {
      sendError("fibonacci", "Fibonacci: Provide a non-negative integer");
      return;
    }
    if (n === 0) {
      sendSuccess("fibonacci", 0);
      return;
    }
    if (n === 1) {
      sendSuccess("fibonacci", 1);
      return;
    }
    let a = 0;
    let b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    sendSuccess("fibonacci", b);
  },
  "--gcd": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      sendError("gcd", "Error: No valid numeric inputs provided.");
      return;
    }
    const computeGcd = (a, b) => (b === 0 ? a : computeGcd(b, a % b));
    sendSuccess("gcd", numbers.reduce((a, b) => computeGcd(a, b)));
  },
  "--lcm": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      sendError("lcm", "Error: No valid numeric inputs provided.");
      return;
    }
    const computeGcd = (a, b) => (b === 0 ? a : computeGcd(b, a % b));
    const computeLcm = (a, b) => Math.abs(a * b) / computeGcd(a, b);
    sendSuccess("lcm", numbers.reduce((a, b) => computeLcm(a, b)));
  },
  "--prime": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("prime", "Error: No valid numeric inputs provided.");
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
    sendSuccess("prime", result.join(","));
  },
  "--log": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("log", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    if (numbers.length === 1) {
      const x = numbers[0];
      if (x <= 0) {
        sendError("log", "Log: Input must be greater than 0");
        return;
      }
      const result = Math.log(x);
      sendSuccess("log", result, invalid);
    } else {
      const x = numbers[0], base = numbers[1];
      if (x <= 0) {
        sendError("log", "Log: Input must be greater than 0");
        return;
      }
      if (base <= 0 || base === 1) {
        sendError("log", "Log: Base must be greater than 0 and not equal to 1");
        return;
      }
      const result = Math.log(x) / Math.log(base);
      sendSuccess("log", result, invalid);
    }
  },
  "--percentile": async (args) => {
    const { valid: numbers } = parseNumbers(args);
    if (numbers.length < 2) {
      sendError("percentile", "Error: No valid numeric inputs provided.");
      return;
    }
    const p = numbers[0];
    if (p < 0 || p > 100) {
      sendError("percentile", "Error: Percentile must be between 0 and 100.");
      return;
    }
    const data = numbers.slice(1);
    if (data.length === 0) {
      sendError("percentile", "Error: No valid numeric inputs provided.");
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
    sendSuccess("percentile", percentileValue);
  },
  "--geomean": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      sendError("geomean", "Error: No valid numeric inputs provided.", invalid);
      return;
    }
    for (const num of numbers) {
      if (num <= 0) {
        sendError("geomean", "Error: All inputs must be positive for geometric mean.");
        return;
      }
    }
    const product = numbers.reduce((acc, val) => acc * val, 1);
    const result = Math.pow(product, 1 / numbers.length);
    sendSuccess("geomean", result, invalid);
  }
};

// Add alias support for frequently used commands
commands["-s"] = commands["--sum"];
commands["-m"] = commands["--multiply"];
commands["-a"] = commands["--average"];
commands["-d"] = commands["--divide"];
commands["-h"] = commands["--help"];
commands["-g"] = commands["--geomean"];

async function cliMain(args) {
  // Reset json mode for every invocation to avoid state carryover between calls
  jsonMode = false;
  jsonPretty = false;
  if (args === undefined) {
    args = [];
  }
  if (!Array.isArray(args)) {
    sendError("cliMain", usage + "()\nNo CLI arguments provided. Exiting.");
    return;
  }
  // Check for global --json-pretty flag and remove it (takes precedence over --json)
  if (args.includes("--json-pretty")) {
    jsonMode = true;
    jsonPretty = true;
    args = args.filter(arg => arg !== "--json-pretty" && arg !== "--json");
  } else if (args.includes("--json")) {
    jsonMode = true;
    args = args.filter(arg => arg !== "--json");
  }
  // Set global inputEcho as the cleansed input
  __inputEcho = args;
  // Record start time for execution duration
  __startTime = Date.now();

  if (args.length === 0) {
    if (jsonMode) {
      sendSuccess("cliMain", usage + "\nNo CLI arguments provided. Exiting.");
    } else {
      console.log(usage);
      console.log("No CLI arguments provided. Exiting.");
    }
    return;
  }
  const flag = args[0];
  const rest = args.slice(1);
  if (commands[flag]) {
    await commands[flag](rest);
  } else {
    sendSuccess("cliMain", "Run with: " + JSON.stringify(args));
  }
}

const __test = {
  printUsage: (_verbose) => {
    sendSuccess("printUsage", usage + "\nNo CLI arguments provided. Exiting.");
  },
  printHelp: () => {
    sendSuccess("printHelp", usage + "\n  --diagnostics: Check system diagnostics");
  },
  gcd: (a, b) => (b === 0 ? a : __test.gcd(b, a % b)),
  lcm: (a, b) => Math.abs(a * b) / __test.gcd(a, b)
};

if (process.env.NODE_ENV !== "test" && process.argv[1] === new URL(import.meta.url).pathname) {
  (async function run() {
    await cliMain(process.argv.slice(2));
    process.exit(0);
  })();
}

export { cliMain as main, __test };
