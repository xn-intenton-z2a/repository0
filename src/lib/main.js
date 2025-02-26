#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import pkg from "../../package.json" assert { type: "json" };
import chalkImport from "chalk";
const chalk = process.env.NODE_ENV === "test" ? { blue: s => s, green: s => s, red: s => s } : chalkImport;

// Helper function to print usage message
func  tion printUsage(withDemo) {
  const usageMsg = `Usage: node src/lib/main.js [options]\nOptions:\n  --help           Show help\n  --version        Show version\n  --example-owl    Show an example OWL ontology as JSON\n  --fetch-owl      Fetch public API data and render as OWL ontology JSON\n  --build-owl      Build a demo OWL ontology as JSON\n  --diagnostics    Run diagnostics to test public API connectivity`;
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

  // If fetch-owl flag is provided, fetch public API data and convert to OWL ontology JSON using multiple endpoints
  if (args.includes("--fetch-owl")) {
    let owlOntology;
    let data;
    let endpoint = "https://restcountries.com/v3.1/all";
    try {
      let response = await fetch(endpoint);
      if (!response.ok) {
        console.warn(chalk.red(`Primary endpoint failed with status ${response.status}. Trying backup endpoint...`));
        endpoint = "https://jsonplaceholder.typicode.com/users";
        response = await fetch(endpoint);
        if (!response.ok) {
          console.error(chalk.red("Failed to fetch from both primary and backup endpoints"));
          safeExit(1);
          return;
        }
      }
      data = await response.json();
    } catch (error) {
      console.error(chalk.red("Error fetching data:"), error);
      safeExit(1);
      return;
    }

    // Map data to OWL ontology based on the endpoint used
    if (endpoint === "https://restcountries.com/v3.1/all") {
      const individuals = data.slice(0, 3).map(country => ({
        id: country.name && country.name.common ? country.name.common : "Unknown",
        label: country.region || "Unknown"
      }));
      owlOntology = {
        ontologyIRI: "http://example.org/countries.owl",
        classes: [{ id: "Country", label: "Country" }],
        properties: [],
        individuals: individuals
      };
    } else {
      // Backup endpoint mapping using JSONPlaceholder users
      const individuals = data.slice(0, 3).map(user => ({
        id: user.username || "Unknown",
        label: user.company && user.company.name ? user.company.name : "Unknown"
      }));
      owlOntology = {
        ontologyIRI: "http://example.org/users.owl",
        classes: [{ id: "User", label: "User" }],
        properties: [],
        individuals: individuals
      };
    }
    console.log(chalk.green("Fetched OWL Ontology as JSON:"));
    console.log(JSON.stringify(owlOntology, null, 2));
    safeExit(0);
    return;
  }

  // If build-owl flag is provided, build a demo OWL ontology JSON and exit
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

  // NEW: If diagnostics flag is provided, run a self-test fetching public API data and log OWL ontology JSON
  if (args.includes("--diagnostics")) {
    console.log(chalk.green("Running Diagnostics..."));
    try {
      const start = Date.now();
      const response = await fetch("https://restcountries.com/v3.1/all");
      if (!response.ok) {
        console.error(chalk.red("Diagnostics: Failed to fetch public API data"));
        safeExit(1);
        return;
      }
      const data = await response.json();
      const latency = Date.now() - start;
      console.log(chalk.green(`Diagnostics: Fetched ${data.length} records in ${latency} ms.`));
      // Log the OWL ontology JSON format derived from the fetched data
      const individuals = data.slice(0, 3).map(country => ({
        id: country.name && country.name.common ? country.name.common : "Unknown",
        label: country.region || "Unknown"
      }));
      const diagOwlOntology = {
        ontologyIRI: "http://example.org/diagnostics.owl",
        classes: [{ id: "Country", label: "Country" }],
        properties: [],
        individuals: individuals
      };
      console.log(chalk.green("Diagnostics: OWL Ontology JSON:"));
      console.log(JSON.stringify(diagOwlOntology, null, 2));
    } catch (error) {
      console.error(chalk.red("Diagnostics: Error fetching public API data:"), error);
      safeExit(1);
      return;
    }
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
