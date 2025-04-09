#!/usr/bin/env node

/**
 * repository0 CLI Tool: A Template for Automated Workflows
 *
 * This main file handles CLI command processing inline via a command mapping. It supports arithmetic commands: --sum, --multiply, --subtract, --divide, --modulo, --average, and additional commands: --factorial, --sqrt, --median, --mode, --stddev, --percentile, --log, among others.
 *
 * Note: All commands uniformly return "Error: No valid numeric inputs provided." when no valid numeric inputs are detected. Literal 'NaN' (in any form or capitalization) is explicitly rejected as an invalid input by default unless allowed via configuration or inline flag.
 *
 * New Feature: Global JSON Output Mode with optional pretty-printing. When the global flag --json is provided, all command outputs are returned as structured JSON objects for easier machine integration. Supplying --json-pretty outputs formatted JSON with 2-space indentation for improved readability.
 *
 * Enhancement: Extended Global JSON Output Mode now includes additional metadata fields:
 *   - timestamp: The ISO formatted time of command execution
 *   - version: The current tool version
 *   - executionDuration: The time taken in milliseconds to execute the command
 *   - inputEcho: The cleansed input parameters after filtering global flags
 *
 * Enhancement: Consolidated and refined NaN handling logic for numeric parsing. The parsing logic now resides in integrated utility functions within this file. A dedicated configuration function centralizes environment variable initializations for NaN handling, punctuation stripping, and warning index mode. This ensures predictable behavior and easier maintenance.
 *
 * New Option: DYNAMIC_WARNING_INDEX - When set to true, the parser will use the token's actual position (1-indexed) in the input as the warning index for invalid tokens, instead of using a fixed index.
 *
 * New Option: --summarize-warnings - When provided, aggregates duplicate warning messages into a summarized message instead of printing each individual warning.
 *
 * New Flag: --allow-nan-inline - Allows NaN tokens to be accepted as valid numeric inputs for the current command only without modifying the global ALLOW_NAN setting. This inline flag is transient and resets automatically after each command invocation.
 *
 * New Flag: --ignore-invalid - When provided, the CLI will ignore invalid numeric tokens instead of erroring out if any are encountered. If all tokens are invalid, a warning message is returned.
 *
 * New Command: --config outputs the current CLI configuration including TOOL_VERSION and the configuration of invalid tokens.
 *
 * New Command: --toggle-allow-nan dynamically toggles the ALLOW_NAN setting for numeric parsing at runtime.
 *
 * New Command: --diagnose-nan provides a detailed diagnostic report for NaN token handling. It analyzes each input token, showing its original and trimmed forms, whether it was accepted, the warning index, the character range (trimStart and trimEnd) of the trimmed portion in the original token, and any correction suggestions based on the current configuration. The output is available in both standard and JSON modes, and respects the --allow-nan-inline flag on a per-invocation basis.
 *
 * Note on 'NaN' Handling: The parser explicitly checks for tokens resembling 'NaN' in a case-insensitive manner, even if they are surrounded by extra punctuation or whitespace. Tokens with internal whitespace (e.g., 'N aN') are rejected. To allow 'NaN' as a valid numeric value, set INVALID_TOKENS to an empty string, ALLOW_NAN to 'true', or supply the --allow-nan-inline flag.
 *
 * Correction Suggestion: When a token equal to 'NaN' is rejected due to configuration, a suggestion is appended to help users enable NaN processing if intended. This suggestion can be disabled by setting DISABLE_NAN_SUGGESTION to 'true'.
 */

// Consolidated Environment Configuration
function getConfig() {
  return {
    ALLOW_NAN: (process.env.ALLOW_NAN && process.env.ALLOW_NAN.toLowerCase() === 'true') || false,
    INVALID_TOKENS: process.env.INVALID_TOKENS !== undefined ? process.env.INVALID_TOKENS : ((process.env.ALLOW_NAN && process.env.ALLOW_NAN.toLowerCase() === 'true') ? "" : "nan"),
    TOKEN_PUNCTUATION_CONFIG: process.env.TOKEN_PUNCTUATION_CONFIG !== undefined ? process.env.TOKEN_PUNCTUATION_CONFIG : ",.;?!",
    DISABLE_NAN_SUGGESTION: (process.env.DISABLE_NAN_SUGGESTION && process.env.DISABLE_NAN_SUGGESTION.toLowerCase() === 'true') || false,
    DYNAMIC_WARNING_INDEX: (process.env.DYNAMIC_WARNING_INDEX && process.env.DYNAMIC_WARNING_INDEX.toLowerCase() === 'true') || false
  };
}

// Integrated Number Utilities
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\\\]]/g, '\\$&');
}

function generateWarning(pos, originalToken) {
  const config = getConfig();
  let suggestion = "";
  if (!config.DISABLE_NAN_SUGGESTION) {
    suggestion = " Did you mean to allow NaN values?";
  }
  const indexText = config.DYNAMIC_WARNING_INDEX ? `(position ${pos})` : "(position 0)";
  return `${indexText}: ${originalToken}${suggestion}`;
}

// Global flags for inline NaN acceptance and ignoring invalid tokens; both reset after each command invocation
let inlineAllowNan = false;
let ignoreInvalidMode = false;

function parseNumbers(args) {
  const config = getConfig();
  let valid = [];
  let invalid = [];
  let tokenPunctuationConfig = config.TOKEN_PUNCTUATION_CONFIG;
  // Create a cache to store processed tokens to avoid redundant regex operations
  const tokenCache = new Map();

  // Precompile regex patterns if punctuation stripping is enabled
  let leadingRegex = null, trailingRegex = null;
  if (tokenPunctuationConfig !== "") {
    leadingRegex = new RegExp(`^[${escapeRegex(tokenPunctuationConfig)}]+`);
    trailingRegex = new RegExp(`[${escapeRegex(tokenPunctuationConfig)}]+$`);
  }

  args.forEach((token, index) => {
    let processed;
    if (tokenCache.has(token)) {
      processed = tokenCache.get(token);
    } else {
      // Always trim outer whitespace
      let trimmed = token.trim();
      if (tokenPunctuationConfig !== undefined) {
        if (tokenPunctuationConfig !== "") {
          trimmed = trimmed.replace(leadingRegex, '').replace(trailingRegex, '');
        }
      } else {
        trimmed = trimmed.replace(/^[,.;?!]+|[,.;?!]+$/g, '');
      }
      processed = trimmed;
      tokenCache.set(token, processed);
    }

    if (processed === "") {
      invalid.push(generateWarning(config.DYNAMIC_WARNING_INDEX ? index + 1 : 0, token));
      return;
    }
    if (/\s/.test(processed)) {
      invalid.push(generateWarning(config.DYNAMIC_WARNING_INDEX ? index + 1 : 0, token));
      return;
    }
    if (processed.toLowerCase() === "nan") {
      if (config.ALLOW_NAN || inlineAllowNan) {
        valid.push(NaN);
      } else {
        invalid.push(generateWarning(config.DYNAMIC_WARNING_INDEX ? index + 1 : 0, token));
      }
      return;
    }
    const num = Number(processed);
    if (isNaN(num)) {
      invalid.push(generateWarning(config.DYNAMIC_WARNING_INDEX ? index + 1 : 0, token));
    } else {
      valid.push(num);
    }
  });
  return { valid, invalid };
}

const TOOL_VERSION = '1.4.1-13';

const usage =
  "Usage: node src/lib/main.js [--json] [--json-pretty] [--summarize-warnings] [--diagnostics] [--ignore-invalid] [--help, -h] [--version] [--greet] [--info] [--sum, -s] [--multiply, -m] [--subtract] [--divide, -d] [--modulo] [--average, -a] [--power] [--factorial] [--sqrt] [--median] [--mode] [--stddev] [--range] [--factors] [--variance] [--demo] [--real] [--fibonacci] [--gcd] [--lcm] [--prime] [--log] [--percentile] [--geomean, -g] [--config] [--toggle-allow-nan] [--allow-nan-inline] [--diagnose-nan] numbers...";

// Global flags for JSON output mode and summarizing warnings
let jsonMode = false;
let jsonPretty = false;
let summarizeWarnings = false;

// Global variables to hold start time and cleansed input for JSON metadata
let __startTime = 0;
let __inputEcho = [];

// Helper function to aggregate duplicate warnings
function aggregateWarnings(warnings) {
  const tokenCounts = {};
  warnings.forEach(warning => {
    const match = warning.match(/\):\s*(.*?)(\s+Did you mean|$)/);
    if (match) {
      const token = match[1].trim();
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    }
  });
  return Object.entries(tokenCounts).map(
    ([token, count]) => `Token '${token}' occurred ${count} ${count > 1 ? 'times' : 'time'}`
  );
}

// Helper functions to output success or error messages based on JSON mode
function sendSuccess(command, result, warnings) {
  let finalWarnings = warnings;
  if (summarizeWarnings && warnings && warnings.length > 0) {
    finalWarnings = aggregateWarnings(warnings);
  }
  if (jsonMode) {
    const output = {
      command,
      result,
      warnings: finalWarnings ? finalWarnings : [],
      timestamp: new Date().toISOString(),
      version: TOOL_VERSION,
      executionDuration: Date.now() - __startTime,
      inputEcho: __inputEcho
    };
    console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
  } else {
    if (finalWarnings && finalWarnings.length > 0) {
      if (!summarizeWarnings) {
        finalWarnings.forEach(w => console.warn(w));
        console.log(String(result));
      } else {
        console.log(String(result) + "\n" + finalWarnings.join("\n"));
      }
    } else {
      console.log(String(result));
    }
  }
}

function sendError(command, errorMessage, warnings) {
  let finalWarnings = warnings;
  if (summarizeWarnings && warnings && warnings.length > 0) {
    finalWarnings = aggregateWarnings(warnings);
  }
  if (jsonMode) {
    const output = {
      command,
      error: errorMessage,
      warnings: finalWarnings ? finalWarnings : [],
      timestamp: new Date().toISOString(),
      version: TOOL_VERSION,
      executionDuration: Date.now() - __startTime,
      inputEcho: __inputEcho
    };
    console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
  } else {
    if (finalWarnings && finalWarnings.length > 0) {
      if (!summarizeWarnings) {
        finalWarnings.forEach(w => console.warn(w));
        console.log(String(errorMessage));
      } else {
        console.log(String(errorMessage) + "\n" + finalWarnings.join("\n"));
      }
    } else {
      console.log(String(errorMessage));
    }
  }
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
      if (ignoreInvalidMode) {
        sendSuccess("sum", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("sum", "Error: No valid numeric inputs provided.", invalid);
      }
      return;
    }
    const result = numbers.reduce((acc, val) => acc + val, 0);
    sendSuccess("sum", result, invalid);
  },
  "--multiply": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("multiply", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("multiply", "Error: No valid numeric inputs provided.", invalid);
      }
      return;
    }
    const result = numbers.reduce((acc, val) => acc * val, 1);
    sendSuccess("multiply", result, invalid);
  },
  "--subtract": async (args) => {
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("subtract", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("subtract", "Error: No valid numeric inputs provided.", invalid);
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("divide", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("divide", "Error: No valid numeric inputs provided.", invalid);
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("modulo", "Warning: Not enough valid numeric inputs provided.", invalid);
      } else {
        sendError("modulo", "Error: No valid numeric inputs provided.", invalid);
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("average", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("average", "Error: No valid numeric inputs provided.", invalid);
      }
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
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("median", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("median", "Error: No valid numeric inputs provided.", invalid);
      }
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
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("mode", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("mode", "Error: No valid numeric inputs provided.");
      }
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
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("stddev", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("stddev", "Error: No valid numeric inputs provided.", invalid);
      }
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
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("range", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("range", "Error: No valid numeric inputs provided.", invalid);
      }
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
    const { valid: numbers, invalid } = parseNumbers(args);
    if (numbers.length === 0) {
      if (ignoreInvalidMode) {
        sendSuccess("variance", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("variance", "Error: No valid numeric inputs provided.", invalid);
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("prime", "Warning: All tokens ignored, no valid numeric inputs provided.");
      } else {
        sendError("prime", "Error: No valid numeric inputs provided.");
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("log", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("log", "Error: No valid numeric inputs provided.", invalid);
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("percentile", "Warning: Not enough valid numeric inputs provided.");
      } else {
        sendError("percentile", "Error: No valid numeric inputs provided.");
      }
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
      if (ignoreInvalidMode) {
        sendSuccess("geomean", "Warning: All tokens ignored, no valid numeric inputs provided.", invalid);
      } else {
        sendError("geomean", "Error: No valid numeric inputs provided.", invalid);
      }
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
  },
  "--config": async (args) => {
    const config = getConfig();
    const configDetails = {
      TOOL_VERSION,
      INVALID_TOKENS: config.INVALID_TOKENS,
      DYNAMIC_WARNING_INDEX: config.DYNAMIC_WARNING_INDEX ? 'enabled' : 'disabled',
      TOKEN_PUNCTUATION_CONFIG: config.TOKEN_PUNCTUATION_CONFIG,
      DISABLE_NAN_SUGGESTION: config.DISABLE_NAN_SUGGESTION.toString(),
      ALLOW_NAN: config.ALLOW_NAN.toString(),
      inlineAllowNan: inlineAllowNan.toString()
    };
    if (jsonMode) {
      const output = {
        command: "config",
        config: configDetails,
        timestamp: new Date().toISOString(),
        version: TOOL_VERSION,
        executionDuration: Date.now() - __startTime,
        inputEcho: __inputEcho
      };
      console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
    } else {
      let output = "Configuration Settings:\n";
      output += `TOOL_VERSION: ${TOOL_VERSION}\n`;
      output += `INVALID_TOKENS: ${config.INVALID_TOKENS}\n`;
      output += `DYNAMIC_WARNING_INDEX: ${config.DYNAMIC_WARNING_INDEX ? 'enabled' : 'disabled'}\n`;
      output += `TOKEN_PUNCTUATION_CONFIG: ${config.TOKEN_PUNCTUATION_CONFIG}\n`;
      output += `DISABLE_NAN_SUGGESTION: ${config.DISABLE_NAN_SUGGESTION}\n`;
      output += `ALLOW_NAN: ${config.ALLOW_NAN}\n`;
      output += `inlineAllowNan: ${inlineAllowNan}\n`;
      sendSuccess("config", output);
    }
  },
  "--toggle-allow-nan": async (_args) => {
    let current = (getConfig().ALLOW_NAN);
    const newValue = !current;
    process.env.ALLOW_NAN = newValue ? 'true' : 'false';
    sendSuccess("toggle-allow-nan", "ALLOW_NAN toggled to " + process.env.ALLOW_NAN);
  },
  "--diagnose-nan": async (args) => {
    const diagnostics = [];
    const config = getConfig();
    let tokenPunctuationConfig = config.TOKEN_PUNCTUATION_CONFIG;
    if (tokenPunctuationConfig === undefined) {
      tokenPunctuationConfig = ",.;?!";
    }
    function computeTrimIndices(token, punctuationConfig) {
      let start = 0;
      let end = token.length - 1;
      while(start < token.length && /\s/.test(token[start])) {
        start++;
      }
      while(end >= start && /\s/.test(token[end])) {
        end--;
      }
      let innerStart = start;
      let innerEnd = end;
      if (punctuationConfig && punctuationConfig !== "") {
        while(innerStart <= innerEnd && punctuationConfig.includes(token[innerStart])) {
          innerStart++;
        }
        while(innerEnd >= innerStart && punctuationConfig.includes(token[innerEnd])) {
          innerEnd--;
        }
      }
      const trimmed = token.slice(innerStart, innerEnd + 1);
      return { trimmed, trimStart: innerStart, trimEnd: innerEnd + 1 };
    }
    
    args.forEach((token, index) => {
      const { trimmed, trimStart, trimEnd } = computeTrimIndices(token, tokenPunctuationConfig);
      let accepted = true;
      let value = null;
      let warning = "";
      const warningIndex = config.DYNAMIC_WARNING_INDEX ? index + 1 : 0;
      if (trimmed === "") {
        accepted = false;
        warning = generateWarning(warningIndex, token);
        diagnostics.push({
          original: token,
          trimmed,
          trimStart,
          trimEnd,
          accepted,
          value,
          warningIndex,
          suggestion: (!config.DISABLE_NAN_SUGGESTION && warning.includes("Did you mean")) ? "Did you mean to allow NaN values?" : ""
        });
        return;
      }
      if (/\s/.test(trimmed)) {
        accepted = false;
        warning = generateWarning(warningIndex, token);
        diagnostics.push({
          original: token,
          trimmed,
          trimStart,
          trimEnd,
          accepted,
          value,
          warningIndex,
          suggestion: (!config.DISABLE_NAN_SUGGESTION && warning.includes("Did you mean")) ? "Did you mean to allow NaN values?" : ""
        });
        return;
      }
      if (trimmed.toLowerCase() === "nan") {
        if (config.ALLOW_NAN || inlineAllowNan) {
          value = NaN;
        } else {
          accepted = false;
          warning = generateWarning(warningIndex, token);
        }
        diagnostics.push({
          original: token,
          trimmed,
          trimStart,
          trimEnd,
          accepted,
          value,
          warningIndex,
          suggestion: (!config.DISABLE_NAN_SUGGESTION && warning.includes("Did you mean")) ? "Did you mean to allow NaN values?" : ""
        });
        return;
      }
      const num = Number(trimmed);
      if (isNaN(num)) {
        accepted = false;
        warning = generateWarning(warningIndex, token);
        diagnostics.push({
          original: token,
          trimmed,
          trimStart,
          trimEnd,
          accepted,
          value,
          warningIndex,
          suggestion: (!config.DISABLE_NAN_SUGGESTION && warning.includes("Did you mean")) ? "Did you mean to allow NaN values?" : ""
        });
      } else {
        value = num;
        diagnostics.push({
          original: token,
          trimmed,
          trimStart,
          trimEnd,
          accepted,
          value,
          warningIndex,
          suggestion: ""
        });
      }
    });
    if (jsonMode) {
      const output = {
        command: "diagnose-nan",
        diagnostics,
        timestamp: new Date().toISOString(),
        version: TOOL_VERSION,
        executionDuration: Date.now() - __startTime,
        inputEcho: __inputEcho
      };
      console.log(jsonPretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
    } else {
      let output = "NaN Diagnostic Report:\n";
      diagnostics.forEach(d => {
        output += `Original: ${d.original.replace(/\s+/g, ' ')}, Trimmed: ${d.trimmed}, TrimStart: ${d.trimStart}, TrimEnd: ${d.trimEnd}, Accepted: ${d.accepted}, Value: ${d.value}, WarningIndex: ${d.warningIndex}, Suggestion: ${d.suggestion}\n`;
      });
      sendSuccess("diagnose-nan", output);
    }
    inlineAllowNan = false;
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
  jsonMode = false;
  jsonPretty = false;
  summarizeWarnings = false;
  ignoreInvalidMode = false;
  __inputEcho = [];
  __startTime = 0;

  let allowNanFlag = false;
  if (args && args.includes("--allow-nan-inline")) {
    allowNanFlag = true;
    args = args.filter(arg => arg !== "--allow-nan-inline");
  }
  inlineAllowNan = allowNanFlag;

  if (args && args.includes("--ignore-invalid")) {
    ignoreInvalidMode = true;
    args = args.filter(arg => arg !== "--ignore-invalid");
  }

  // Force initialization of ALLOW_NAN and INVALID_TOKENS via config
  const config = getConfig();
  process.env.ALLOW_NAN = config.ALLOW_NAN ? 'true' : 'false';
  if (process.env.INVALID_TOKENS === undefined) {
    process.env.INVALID_TOKENS = config.INVALID_TOKENS;
  }
  if (args === undefined) {
    args = [];
  }
  if (!Array.isArray(args)) {
    sendError("cliMain", usage + "\nNo CLI arguments provided. Exiting.");
    return;
  }
  if (args.includes("--json-pretty")) {
    jsonMode = true;
    jsonPretty = true;
    args = args.filter(arg => arg !== "--json-pretty" && arg !== "--json");
  } else if (args.includes("--json")) {
    jsonMode = true;
    args = args.filter(arg => arg !== "--json");
  }
  if (args.includes("--summarize-warnings")) {
    summarizeWarnings = true;
    args = args.filter(arg => arg !== "--summarize-warnings");
  }
  __inputEcho = args;
  __startTime = Date.now();

  try {
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
  } catch (error) {
    sendError("cliMain", error.message);
  }
  inlineAllowNan = false;
  ignoreInvalidMode = false;
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

export { cliMain as main, __test, escapeRegex, generateWarning, parseNumbers };