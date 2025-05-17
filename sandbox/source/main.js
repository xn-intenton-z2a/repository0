#!/usr/bin/env node
import minimist from "minimist";
import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import ejs from "ejs";

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
  render             Render an EJS template with optional JSON data and output file
  replace            Perform search-and-replace on a text file
  text-replace       Alias for replace

Examples:
  npm run start -- help
  npm run start -- mission
  npm run start -- version
  npm run start -- echo Hello World
  npm run start -- features
  npm run start -- mission-features
  npm run start -- csv-import data.csv
  npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false
  npm run start -- render template.ejs
  npm run start -- render template.ejs data.json
  npm run start -- render template.ejs data.json --output out.html
  npm run start -- replace file.txt --search foo --replace bar
  npm run start -- text-replace file.txt --search foo --replace bar --regex --flags "gi" --output out.txt`);
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

async function doRender(argv) {
  const templateFile = argv._[1];
  const dataFile = argv._[2];
  const output = argv.output;
  if (!templateFile) {
    console.error("Error: No template file specified");
    process.exit(1);
  }
  let template;
  try {
    const templatePath = path.resolve(templateFile);
    template = await fs.readFile(templatePath, "utf-8");
  } catch (err) {
    console.error("Error reading template file:", err.message);
    process.exit(1);
  }
  let data = {};
  if (dataFile) {
    try {
      const dataPath = path.resolve(dataFile);
      const raw = await fs.readFile(dataPath, "utf-8");
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Error parsing data file:", err.message);
      process.exit(1);
    }
  }
  let rendered;
  try {
    rendered = ejs.render(template, data);
  } catch (err) {
    console.error("Error rendering template:", err.message);
    process.exit(1);
  }
  if (output) {
    try {
      const outputPath = path.resolve(output);
      await fs.writeFile(outputPath, rendered, "utf-8");
      console.log(`Wrote rendered output to ${output}`);
      process.exit(0);
    } catch (err) {
      console.error("Error writing output file:", err.message);
      process.exit(1);
    }
  } else {
    console.log(rendered);
    process.exit(0);
  }
}

// New text replace functionality
async function doTextReplace(argv) {
  const inputFile = argv._[1];
  const search = argv.search;
  const replacement = argv.replace;
  const useRegex = argv.regex;
  const flagsStr = argv.flags;
  const output = argv.output;

  if (!search || replacement === undefined) {
    console.error("Missing --search or --replace flag");
    process.exit(1);
  }

  let content;
  try {
    const inputPath = path.resolve(inputFile);
    content = await fs.readFile(inputPath, "utf-8");
  } catch (err) {
    console.error("Error reading input file:", err.message);
    process.exit(1);
  }

  let result;
  if (useRegex) {
    let regex;
    try {
      const flags = flagsStr || "g";
      regex = new RegExp(search, flags);
    } catch (err) {
      console.error("Invalid regular expression:", err.message);
      process.exit(1);
    }
    result = content.replace(regex, replacement);
  } else {
    result = content.replace(search, replacement);
  }

  if (output) {
    try {
      const outputPath = path.resolve(output);
      await fs.writeFile(outputPath, result, "utf-8");
      process.exit(0);
    } catch (err) {
      console.error("Error writing output file:", err.message);
      process.exit(1);
    }
  } else {
    console.log(result);
    process.exit(0);
  }
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["header", "regex"],
    string: ["output", "delimiter", "flags", "search", "replace"],
    default: { header: true, delimiter: "," },
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
    case "render":
      await doRender(argv);
      break;
    case "replace":
    case "text-replace":
      await doTextReplace(argv);
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
