#!/usr/bin/env node
// sandbox/source/main.js

import dotenv from "dotenv";
import minimist from "minimist";
import { z } from "zod";
import { fileURLToPath } from "url";
import pkg from "../../package.json" assert { type: "json" };

dotenv.config();

/**
 * Main entry point for the application.
 * Parses arguments and determines the effective conversion rate.
 * @param {string[]} inputArgs - Array of CLI arguments (excluding node and script path).
 * @returns {{ args: string[], conversionRate: number }}
 */
export function main(inputArgs = process.argv.slice(2)) {
  // Default from package.json config
  const defaultRate =
    typeof pkg.config?.issueToCodeConversionRate === "number"
      ? pkg.config.issueToCodeConversionRate
      : 0.5;

  // Parse CLI arguments
  const argv = minimist(inputArgs, {
    alias: { "conversion-rate": "conversionRate" },
    string: ["conversion-rate"],
  });

  let rateValue;
  if (argv["conversion-rate"] !== undefined) {
    rateValue = parseFloat(argv["conversion-rate"]);
  } else if (process.env.ISSUE_TO_CODE_CONVERSION_RATE !== undefined) {
    rateValue = parseFloat(process.env.ISSUE_TO_CODE_CONVERSION_RATE);
  } else {
    rateValue = defaultRate;
  }

  // Validate with Zod
  const rateSchema = z.number().min(0).max(1);
  try {
    rateSchema.parse(rateValue);
  } catch (err) {
    console.error(
      `Invalid conversion rate: ${rateValue}. Must be a number between 0 and 1.`
    );
    throw new Error(
      `Invalid conversion rate: ${rateValue}. Must be a number between 0 and 1.`
    );
  }

  console.log(`Effective conversion rate: ${rateValue}`);
  return { args: inputArgs, conversionRate: rateValue };
}

// Invoke if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
