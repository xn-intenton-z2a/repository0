#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import { promises as fs } from "fs";

/**
 * Main entry point for CLI
 * @param {string[]} args - Command line arguments
 */
export async function main(args) {
  if (args.includes("--capital-cities")) {
    // Determine output file path if provided
    const outputIndex = args.indexOf("--output");
    let outputPath;
    if (outputIndex !== -1 && args[outputIndex + 1]) {
      outputPath = args[outputIndex + 1];
    }
    // Fetch country data
    const response = await fetch("https://restcountries.com/v3.1/all");
    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    const data = await response.json();
    // Build OWL ontology structure
    const classes = ["Country", "City"];
    const objectProperties = [
      { name: "hasCapital", domain: "Country", range: "City" }
    ];
    const individuals = [];
    for (const country of data) {
      const code = country.cca3;
      const capitals = Array.isArray(country.capital) ? country.capital : [];
      // Country individual
      individuals.push({ type: "Country", id: code });
      // City individuals and relationships
      for (const cityName of capitals) {
        individuals.push({ type: "City", id: cityName });
        individuals.push({ subject: code, predicate: "hasCapital", object: cityName });
      }
    }
    const ontology = { ontology: { classes, objectProperties, individuals } };
    const jsonString = JSON.stringify(ontology, null, 2);
    if (outputPath) {
      await fs.writeFile(outputPath, jsonString, "utf-8");
    } else {
      console.log(jsonString);
    }
    return;
  }
  // Default fallback behavior
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// Execute if invoked as script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
