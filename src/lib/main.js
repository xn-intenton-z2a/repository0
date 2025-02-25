#!/usr/bin/env node
// src/lib/main.js

import { fileURLToPath } from "url";
import pkg from "../../package.json" assert { type: "json" };

// Helper function to print usage message
function printUsage(withDemo) {
  const usageMsg = `Usage: node src/lib/main.js [options]
Options:
  --help           Show help
  --version        Show version
  --example-owl    Show an example OWL ontology as JSON
  --fetch-owl      Fetch public API data and render as OWL ontology JSON`;
  console.log(usageMsg);
  if (withDemo) {
    console.log("Demo Output: Run with: []");
  }
}

export async function main(args) {
  // If no arguments are provided, display usage with demo output and exit
  if (!args || args.length === 0) {
    printUsage(true);
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }

  // If help flag is provided, display usage without demo output and exit
  if (args.includes("--help")) {
    printUsage(false);
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }

  // If version flag is provided, display version info and exit
  if (args.includes("--version")) {
    console.log(`Version: ${pkg.version}`);
    if (process.env.NODE_ENV !== "test") process.exit(0);
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
    console.log("Example OWL Ontology as JSON:");
    console.log(JSON.stringify(exampleOWL, null, 2));
    if (process.env.NODE_ENV !== "test") process.exit(0);
    return;
  }

  // If fetch-owl flag is provided, fetch public API data and convert to OWL ontology JSON
  if (args.includes("--fetch-owl")) {
    try {
      const response = await fetch("https://api.publicapis.org/entries");
      if (!response.ok) {
        console.error("Failed to fetch public API data");
        if (process.env.NODE_ENV !== "test") process.exit(1);
        return;
      }
      const data = await response.json();
      // Map first 3 entries as individuals
      const individuals = (data.entries || []).slice(0, 3).map(entry => ({
        id: entry.API,
        label: entry.Description || entry.Category
      }));
      const owlOntology = {
        ontologyIRI: "http://example.org/apis.owl",
        classes: [{ id: "API", label: "API" }],
        properties: [],
        individuals: individuals
      };
      console.log("Fetched OWL Ontology as JSON:");
      console.log(JSON.stringify(owlOntology, null, 2));
    } catch (error) {
      console.error("Error fetching public API data:", error);
    }
    if (process.env.NODE_ENV !== "test") process.exit(0);
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
