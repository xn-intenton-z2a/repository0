#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import pkg from "../../package.json" assert { type: "json" };
import chalkImport from "chalk";
const chalk = process.env.NODE_ENV === "test" ? { blue: s => s, green: s => s, red: s => s } : chalkImport;

// Helper function to print usage message
function printUsage(withDemo) {
  const usageMsg = `Usage: node src/lib/main.js [options]
Options:
  --help           Show help
  --version        Show version
  --example-owl    Show an example OWL ontology as JSON
  --fetch-owl      Fetch public API data and render as OWL ontology JSON
  --build-owl      Build a demo OWL ontology as JSON`;
  console.log(chalk.blue(usageMsg));
  if (withDemo) {
    console.log(chalk.green("Demo Output: Run with: []"));
  }
}

// Helper function for safe exit (skips process.exit during tests)
function safeExit(code) {
  if (process.env.NODE_ENV !== "test") {
    process.exit(code);
  }
}

export async function main(args) {
  // If no arguments are provided, display usage with demo output and exit
  if (!args || args.length === 0) {
    printUsage(true);
    safeExit(0);
    return;
  }

  // If help flag is provided, display usage without demo output and exit
  if (args.includes("--help")) {
    printUsage(false);
    safeExit(0);
    return;
  }

  // If version flag is provided, display version info and exit
  if (args.includes("--version")) {
    console.log(chalk.green(`Version: ${pkg.version}`));
    safeExit(0);
    return;
  }

  // If example-owl flag is provided, display an OWL ontology example as JSON and exit
  if (args.includes("--example-owl")) {
    const exampleOWL = {
      ontologyIRI: "http://example.org/tea.owl",
      classes: [
        { id: "Tea", label: "Tea" }
      ],
      properties: [],
      individuals: []
    };
    console.log(chalk.green("Example OWL Ontology as JSON:"));
    console.log(JSON.stringify(exampleOWL, null, 2));
    safeExit(0);
    return;
  }

  // If fetch-owl flag is provided, fetch public API data and convert to OWL ontology JSON
  if (args.includes("--fetch-owl")) {
    try {
      // Using the REST Countries API as a real public data source
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) {
        console.error(chalk.red("Failed to fetch countries data"));
        safeExit(1);
        return;
      }
      const data = await response.json();
      // Map first 3 entries as individuals, using country common name and region
      const individuals = data.slice(0, 3).map(country => ({
        id: country.name && country.name.common ? country.name.common : "Unknown",
        label: country.region || "Unknown"
      }));
      const owlOntology = {
        ontologyIRI: "http://example.org/countries.owl",
        classes: [{ id: "Country", label: "Country" }],
        properties: [],
        individuals: individuals
      };
      console.log(chalk.green("Fetched OWL Ontology as JSON:"));
      console.log(JSON.stringify(owlOntology, null, 2));
    } catch (error) {
      console.error(chalk.red("Error fetching countries data:"), error);
    }
    safeExit(0);
    return;
  }

  // NEW: If build-owl flag is provided, build a demo OWL ontology JSON and exit
  if (args.includes("--build-owl")) {
    const builtOntology = {
      ontologyIRI: "http://example.org/built.owl",
      classes: [
        { id: "Demo", label: "Demo Class" }
      ],
      properties: [],
      individuals: [
        { id: "SampleIndividual", label: "Sample Label" }
      ]
    };
    console.log(chalk.green("Built OWL Ontology as JSON:"));
    console.log(JSON.stringify(builtOntology, null, 2));
    safeExit(0);
    return;
  }

  // For any other arguments, simply log them
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// Ensure that the script is executed only when run directly, not when imported
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
