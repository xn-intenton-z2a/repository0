#!/usr/bin/env node
import minimist from "minimist";
import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";

async function showHelp() {
  console.log(`Usage: npm run start -- <command> [args]

Commands:
  help               Display this help message
  mission            Print the mission statement
  version            Print the current version
  echo               Echo the provided arguments
  features           List available feature documents
  mission-features   Print the mission statement and list available features
  csv-import         Import a CSV file and output JSON array

Examples:
  npm run start -- help
  npm run start -- mission
  npm run start -- version
  npm run start -- echo Hello World
  npm run start -- features
  npm run start -- mission-features
  npm run start -- csv-import data.csv
  npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false`);
}

async function showMission() {
  try {
    const cwd = process.cwd();
    const content = await fs.readFile(path.join(cwd, "MISSION.md"), "utf-8");
    console.log(content);
  } catch (err) {
    console.error("Error reading mission:", err.message);
    process.exit(1);
  }
}

async function showVersion() {
  try {
    const cwd = process.cwd();
    const pkg = await fs.readFile(path.join(cwd, "package.json"), "utf-8");
    const { version } = JSON.parse(pkg);
    console.log(version);
  } catch (err) {
    console.error("Error reading version:", err.message);
    process.exit(1);
  }
}

async function doEcho(args) {
  console.log(args.join(" "));
}

async function showFeatures() {
  try {
    const cwd = process.cwd();
    const featuresDir = path.join(cwd, "sandbox/features");
    const files = await fs.readdir(featuresDir);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === ".md") {
        const content = await fs.readFile(path.join(featuresDir, file), "utf-8");
        const lines = content.split("\n");
        for (const line of lines) {
          const match = line.match(/^#\s+(.*)/);
          if (match) {
            console.log(match[1]);
            break;
          }
        }
      }
    }
  } catch (err) {
    console.error("Error listing features:", err.message);
    process.exit(1);
  }
}

async function doCsvImport(argv) {
  const inputFile = argv._[1];
  if (!inputFile) {
    console.error("Error: No input file specified");
    process.exit(1);
  }

  const delimiter = argv.delimiter || ",";
  const header = argv.header !== false;
  const output = argv.output;

  let content;
  try {
    const inputPath = path.resolve(inputFile);
    content = await fs.readFile(inputPath, "utf-8");
  } catch (err) {
    console.error("Error reading input file:", err.message);
    process.exit(1);
  }

  let records;
  try {
    records = parse(content, { columns: header, delimiter, skip_empty_lines: true });
  } catch (err) {
    console.error("Error parsing CSV:", err.message);
    process.exit(1);
  }

  const json = JSON.stringify(records, null, 2);

  if (output) {
    try {
      const outputPath = path.resolve(output);
      await fs.writeFile(outputPath, json, "utf-8");
      process.exit(0);
    } catch (err) {
      console.error("Error writing output file:", err.message);
      process.exit(1);
    }
  } else {
    console.log(json);
  }
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["header"],
    string: ["output", "delimiter"],
    default: { header: true, delimiter: "," }
  });
  const [command, ...rest] = argv._;
  switch (command) {
    case "help":
    case undefined:
      await showHelp();
      break;
    case "mission":
      await showMission();
      break;
    case "version":
      await showVersion();
      break;
    case "echo":
      await doEcho(rest);
      break;
    case "features":
      await showFeatures();
      break;
    case "mission-features":
      await showMission();
      console.log("");
      await showFeatures();
      break;
    case "csv-import":
      await doCsvImport(argv);
      break;
    default:
      console.log(`Unknown command: ${command}\n`);
      await showHelp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
