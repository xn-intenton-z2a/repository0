#!/usr/bin/env node
// src/lib/main.js
// This file has been updated for improved consistency in comments, error handling, and JSON output formatting.
// Extended functionality: added a new flag '--extended' to provide combined system information and detailed diagnostics.
// It now follows a more unified style across all functionalities, including extended functionality to generate a full extended OWL ontology with environment details, generate UUIDs, analyze a built ontology, display combined extended info, display an ASCII art version using figlet, and display an inspirational quote.

import { fileURLToPath } from "url";
import pkg from "../../package.json" with { type: "json" };
import chalkImport from "chalk";
import { appendFile } from "fs/promises";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js"; // Including .js extension for clarity
import os from "os";
import { v4 as uuidv4 } from "uuid"; // New dependency for UUID generation
import figlet from "figlet"; // New dependency for ASCII art version display
import { promisify } from "util"; // Added promisify for async figlet

// Extend dayjs to support UTC formatting
dayjs.extend(utc);

// Use a no-op chalk when in test mode for consistent output during testing
const chalk = process.env.NODE_ENV === "test"
  ? { blue: s => s, green: s => s, red: s => s }
  : chalkImport;

// Promisify figlet for async/await usage
const figletAsync = promisify(figlet);

/**
 * Prints the usage instructions for the CLI tool.
 * @param {boolean} withDemo - Whether to include demo output.
 */
function printUsage(withDemo) {
  const usageMsg = `Usage: node src/lib/main.js [options]
Options:
  --help                  Show help
  --help-json             Show help in JSON format
  --version               Show version
  --version-full          Show detailed version info
  --example-owl           Show an example OWL ontology as JSON
  --fetch-owl             Fetch public API data and render as OWL ontology JSON (includes metadata)
  --build-owl             Build a demo OWL ontology as JSON
  --diagnostics           Run diagnostics to test public API connectivity (includes metadata)
  --extend                Display extended OWL ontology as JSON with additional metadata
  --full-extend           Display full extended OWL ontology as JSON with environment details
  --random-owl            Generate a random OWL ontology as JSON
  --log                   Enable logging of output to file
  --time                  Display the current UTC time
  --system                Display system information
  --detailed-diagnostics  Display extended diagnostics including memory usage, uptime, and load averages
  --uuid                  Generate a new random UUID
  --analyze-owl           Analyze the built OWL ontology and report counts
  --extended              Display combined system info and detailed diagnostics as JSON
  --ascii-version         Display the CLI version in ASCII art format
  --quote                 Display an inspirational quote
`;
  console.log(chalk.blue(usageMsg));
  if (withDemo) {
    console.log(chalk.green("Demo Output: Run with: []"));
  }
}

/**
 * Safely exits the process unless in test environment.
 * @param {number} code - The exit code.
 */
function safeExit(code) {
  if (process.env.NODE_ENV !== "test") {
    process.exit(code);
  }
}

/**
 * Helper function to print messages and then exit.
 * @param {string[]} messages - Array of messages to print.
 * @param {function} colorFunc - Optional function to color the message (default: chalk.green).
 */
function printAndExit(messages, colorFunc = msg => chalk.green(msg)) {
  messages.forEach(message => console.log(colorFunc(message)));
  safeExit(0);
}

/**
 * Main function of the CLI tool. It processes the provided command line arguments
 * and executes the corresponding functionality.
 * @param {string[]} args - The command line arguments.
 */
export async function main(args) {
  // If no arguments are provided, display usage with demo output and exit
  if (!args || args.length === 0) {
    printUsage(true);
    safeExit(0);
    return;
  }

  // Handle help flags
  if (args.includes("--help")) {
    printUsage(false);
    safeExit(0);
    return;
  }

  if (args.includes("--help-json")) {
    const helpJson = {
      usage: "node src/lib/main.js [options]",
      options: [
        "--help",
        "--help-json",
        "--version",
        "--version-full",
        "--example-owl",
        "--fetch-owl",
        "--build-owl",
        "--diagnostics",
        "--extend",
        "--full-extend",
        "--random-owl",
        "--log",
        "--time",
        "--system",
        "--detailed-diagnostics",
        "--uuid",
        "--analyze-owl",
        "--extended",
        "--ascii-version",
        "--quote"
      ]
    };
    console.log(chalk.green(`Help JSON:\n${JSON.stringify(helpJson, null, 2)}`));
    safeExit(0);
    return;
  }

  // Detailed version info
  if (args.includes("--version-full")) {
    printAndExit([
      `Name: ${pkg.name}`,
      `Version: ${pkg.version}`,
      `Description: ${pkg.description}`
    ]);
    return;
  }

  // Simple version info
  if (args.includes("--version")) {
    printAndExit([`Version: ${pkg.version}`]);
    return;
  }

  // New Feature: Display ASCII art version using figlet
  if (args.includes("--ascii-version")) {
    try {
      const asciiArt = await figletAsync(`Version: ${pkg.version}`);
      console.log(chalk.green(asciiArt));
      // Added plain text version line to ensure 'Version:' is included in output
      console.log(chalk.green(`Version: ${pkg.version}`));
    } catch (err) {
      console.error(chalk.red("Error generating ASCII art version:"), err);
    }
    safeExit(0);
    return;
  }

  // Example OWL ontology
  if (args.includes("--example-owl")) {
    const exampleOWL = {
      ontologyIRI: "http://example.org/tea.owl",
      classes: [
        { id: "Tea", label: "Tea" }
      ],
      properties: [],
      individuals: []
    };
    printAndExit([
      "Example OWL Ontology as JSON:",
      JSON.stringify(exampleOWL, null, 2)
    ]);
    return;
  }

  // Fetch OWL ontology from public API with fallback
  if (args.includes("--fetch-owl")) {
    let owlOntology;
    let data;
    let endpoint = "https://restcountries.com/v3.1/all";
    try {
      let response = await fetch(endpoint);
      if (!response.ok) {
        console.error(chalk.red(`Primary endpoint failed with status ${response.status}. Trying backup endpoint...`));
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

    if (endpoint === "https://restcountries.com/v3.1/all") {
      const individuals = data.slice(0, 3).map(country => ({
        id: country.name && country.name.common ? country.name.common : "Unknown",
        label: country.region || "Unknown"
      }));
      owlOntology = {
        ontologyIRI: "http://example.org/countries.owl",
        classes: [{ id: "Country", label: "Country" }],
        properties: [],
        individuals
      };
    } else {
      const individuals = data.slice(0, 3).map(user => ({
        id: user.username || "Unknown",
        label: user.company && user.company.name ? user.company.name : "Unknown"
      }));
      owlOntology = {
        ontologyIRI: "http://example.org/users.owl",
        classes: [{ id: "User", label: "User" }],
        properties: [],
        individuals
      };
    }
    owlOntology.metadata = {
      fetchedAt: new Date().toISOString(),
      sourceEndpoint: endpoint,
      recordCount: data.length
    };
    printAndExit([
      "Fetched OWL Ontology as JSON:",
      JSON.stringify(owlOntology, null, 2)
    ]);
    return;
  }

  // Build demo OWL ontology
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
    printAndExit([
      "Built OWL Ontology as JSON:",
      JSON.stringify(builtOntology, null, 2)
    ]);
    return;
  }

  // Run diagnostics with fallback to backup endpoint if primary fails
  if (args.includes("--diagnostics")) {
    console.log(chalk.green("Running Diagnostics..."));
    try {
      const start = Date.now();
      let endpoint = "https://restcountries.com/v3.1/all";
      let response = await fetch(endpoint);
      if (!response.ok) {
        console.error(chalk.red(`Diagnostics: Primary endpoint failed with status ${response.status}. Trying backup endpoint...`));
        endpoint = "https://jsonplaceholder.typicode.com/users";
        response = await fetch(endpoint);
        if (!response.ok) {
          console.error(chalk.red("Diagnostics: Failed to fetch from both primary and backup endpoints"));
          safeExit(1);
          return;
        }
      }
      const data = await response.json();
      const latency = Date.now() - start;
      console.log(chalk.green(`Diagnostics: Fetched ${data.length} records in ${latency} ms.`));
      const individuals = data.slice(0, 3).map(item => {
        if (item.name && item.name.common) {
          return { id: item.name.common, label: item.region || "Unknown" };
        } else {
          return { id: item.username || "Unknown", label: item.company && item.company.name ? item.company.name : "Unknown" };
        }
      });
      const diagOwlOntology = {
        ontologyIRI: "http://example.org/diagnostics.owl",
        classes: [{ id: "Country", label: "Country" }],
        properties: [],
        individuals
      };
      diagOwlOntology.metadata = {
        fetchedAt: new Date().toISOString(),
        recordCount: data.length,
        latencyMs: latency,
        sourceEndpoint: endpoint
      };
      console.log(chalk.green(`Diagnostics: OWL Ontology JSON:\n${JSON.stringify(diagOwlOntology, null, 2)}`));
    } catch (error) {
      console.error(chalk.red("Diagnostics: Error fetching public API data:"), error);
      safeExit(1);
      return;
    }
    safeExit(0);
    return;
  }

  // Extended OWL ontology with additional metadata
  if (args.includes("--extend")) {
    const extendedOntology = {
      ontologyIRI: "http://example.org/extended.owl",
      classes: [
        { id: "Extended", label: "Extended Class" }
      ],
      properties: [
        { id: "hasExtension", label: "Has Extension" }
      ],
      individuals: [
        { id: "ExtensionIndividual", label: "Extension Label" }
      ],
      metadata: {
        applied: true,
        description: "This ontology includes extended functionality options.",
        timestamp: new Date().toISOString()
      }
    };
    console.log(chalk.green(`Extended OWL Ontology as JSON:\n${JSON.stringify(extendedOntology, null, 2)}`));
    safeExit(0);
    return;
  }

  // Full Extended OWL ontology with additional environment details
  if (args.includes("--full-extend")) {
    const fullExtendedOntology = {
      ontologyIRI: "http://example.org/full-extended.owl",
      classes: [
        { id: "FullExtended", label: "Full Extended Class" }
      ],
      properties: [
        { id: "hasFullExtension", label: "Has Full Extension" }
      ],
      individuals: [
        { id: "FullExtensionIndividual", label: "Full Extension Label" }
      ],
      metadata: {
        applied: true,
        description: "This ontology includes full extended functionality with environment details.",
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        platform: os.platform()
      }
    };
    console.log(chalk.green(`Full Extended OWL Ontology as JSON:\n${JSON.stringify(fullExtendedOntology, null, 2)}`));
    safeExit(0);
    return;
  }

  // Random OWL ontology
  if (args.includes("--random-owl")) {
    const samples = [
      {
        ontologyIRI: "http://example.org/owl1",
        classes: [{ id: "Class1", label: "Class 1" }],
        properties: [],
        individuals: [{ id: "Individual1", label: "Individual 1" }]
      },
      {
        ontologyIRI: "http://example.org/owl2",
        classes: [{ id: "Class2", label: "Class 2" }],
        properties: [],
        individuals: [{ id: "Individual2", label: "Individual 2" }]
      }
    ];
    const randomIndex = Math.floor(Math.random() * samples.length);
    const randomOWL = samples[randomIndex];
    randomOWL.metadata = {
      generatedAt: new Date().toISOString(),
      randomSeed: Math.random().toString(36).substr(2, 5)
    };
    printAndExit([
      "Random OWL Ontology as JSON:",
      JSON.stringify(randomOWL, null, 2)
    ]);
    return;
  }

  // Generate a new UUID
  if (args.includes("--uuid")) {
    const newUuid = uuidv4();
    printAndExit([
      `Generated UUID: ${newUuid}`
    ]);
    return;
  }

  // Analyze built OWL ontology
  if (args.includes("--analyze-owl")) {
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
    const analysis = {
      ontologyIRI: builtOntology.ontologyIRI,
      classCount: builtOntology.classes.length,
      propertyCount: builtOntology.properties.length,
      individualCount: builtOntology.individuals.length,
      analyzedAt: new Date().toISOString()
    };
    console.log(chalk.green("OWL Ontology Analysis:"));
    console.log(chalk.green(JSON.stringify(analysis, null, 2)));
    safeExit(0);
    return;
  }

  // Combined Extended Info: Display combined system info and detailed diagnostics as JSON
  if (args.includes("--extended")) {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpu: os.cpus()[0].model
    };
    const detailedDiagnostics = {
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      uptime: os.uptime(),
      loadAverage: os.loadavg()
    };
    const combinedInfo = {
      systemInfo,
      detailedDiagnostics,
      timestamp: new Date().toISOString()
    };
    console.log(chalk.green(`Extended Info as JSON:\n${JSON.stringify(combinedInfo, null, 2)}`));
    safeExit(0);
    return;
  }

  // New Feature: Display an inspirational quote
  if (args.includes("--quote")) {
    const quotes = [
      "The only limit to our realization of tomorrow is our doubts of today.",
      "The future belongs to those who believe in the beauty of their dreams.",
      "In the middle of every difficulty lies opportunity."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log(chalk.green(`Inspirational Quote: ${randomQuote}`));
    safeExit(0);
    return;
  }

  // Logging output to file
  if (args.includes("--log")) {
    const logMessage = "Logging output to file 'owl-builder.log'";
    console.log(chalk.green(logMessage));
    try {
      await appendFile('owl-builder.log', `${new Date().toISOString()} ${logMessage}\n`);
    } catch (error) {
      console.error(chalk.red("Error writing log file:"), error);
      safeExit(1);
      return;
    }
    safeExit(0);
    return;
  }

  // Display current UTC time
  if (args.includes("--time")) {
    const formattedTime = dayjs.utc(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    printAndExit([`Current Time: ${formattedTime}`]);
    return;
  }

  // Display system information
  if (args.includes("--system")) {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpu: os.cpus()[0].model
    };
    console.log(chalk.green(`System Information:\n${JSON.stringify(systemInfo, null, 2)}`));
    safeExit(0);
    return;
  }

  // Detailed diagnostics information
  if (args.includes("--detailed-diagnostics")) {
    const detailedDiagnostics = {
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      uptime: os.uptime(),
      loadAverage: os.loadavg()
    };
    console.log(chalk.green(`Detailed Diagnostics:\n${JSON.stringify(detailedDiagnostics, null, 2)}`));
    safeExit(0);
    return;
  }

  // Default case: log unknown arguments
  console.log(chalk.green(`Run with: ${JSON.stringify(args)}`));
  safeExit(0);
}

// Execute main only if this script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
