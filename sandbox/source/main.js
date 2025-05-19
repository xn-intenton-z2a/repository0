#!/usr/bin/env node
/* eslint-disable sonarjs/cognitive-complexity */
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import minimist from "minimist";
import ejs from "ejs";
import yaml from "js-yaml";
import dotenv from "dotenv";

// Load .env file silently
const dotenvResult = dotenv.config({ path: path.resolve(".env") });
const loadedEnv = dotenvResult.parsed || {};

/**
 * Main entrypoint for CLI commands.
 * Dispatches commands to dedicated handlers.
 * @param {string[]} argv - Command-line arguments (excluding node and script path).
 */
export async function main(argv) {
  const args = minimist(argv, {
    boolean: ["help", "mission", "version", "render", "features"],
    alias: { h: "help", m: "mission", f: "features", e: "env" },
    string: ["env"],
  });

  // Handle environment variables option
  if (args.env !== undefined) {
    handleEnv(args.env);
    return;
  }

  if (args.help) {
    return printHelp();
  }
  if (args.mission) {
    return printMission();
  }
  if (args.version) {
    return printVersion();
  }
  if (args.features) {
    return listFeatures();
  }
  if (args.render) {
    return renderTemplate(args);
  }
  if (args._.length > 0 && args._[0] === "echo") {
    return echoMessage(args._);
  }

  // Default to help when no known command is provided
  return printHelp();
}

/**
 * Handle --env and -e option.
 * @param {boolean|string} envArg - The argument passed to --env.
 */
function handleEnv(envArg) {
  if (envArg === true || envArg === "") {
    console.log(JSON.stringify(loadedEnv, null, 2));
    process.exit(0);
  }
  const varName = envArg;
  const value = loadedEnv[varName];
  if (value === undefined) {
    console.error(`Missing environment variable: ${varName}`);
    process.exit(1);
  }
  console.log(value);
  process.exit(0);
}

/**
 * Print usage instructions and summary of commands.
 */
function printHelp() {
  const cmd = path.basename(process.argv[1]);
  console.log(
    `Usage: ${cmd} [--help] [-m|--mission] [--version] [-f|--features] [--render <template> <data>] [--env <VAR_NAME>] [echo <message>...]`
  );
  console.log("");
  console.log("Commands:");
  console.log("  --help                      Display usage instructions");
  console.log("  -m, --mission               Print mission statement");
  console.log("  --version                   Print version");
  console.log("  -f, --features              List available features");
  console.log("  --render <template> <data>  Render EJS template with data (JSON or YAML)");
  console.log("  -e, --env <VAR_NAME>        Print a specific environment variable");
  console.log("  -e, --env                   Print all loaded environment variables as JSON");
  console.log("  echo <message>              Echo message");
}

/**
 * Print the mission statement from MISSION.md.
 */
async function printMission() {
  const mission = await fs.readFile(path.resolve("MISSION.md"), "utf-8");
  console.log(mission);
}

/**
 * Print the version from package.json.
 */
async function printVersion() {
  const pkg = JSON.parse(
    await fs.readFile(path.resolve("package.json"), "utf-8")
  );
  console.log(pkg.version);
}

/**
 * List available features by reading markdown files and extracting YAML frontmatter.
 */
async function listFeatures() {
  const missionText = await fs.readFile(path.resolve("MISSION.md"), "utf-8");
  console.log(missionText);

  try {
    const dirPath = path.resolve("sandbox/features");
    const files = await fs.readdir(dirPath);
    const mdFiles = files.filter((f) => f.endsWith(".md"));
    const featuresList = [];

    for (const file of mdFiles) {
      const raw = await fs.readFile(path.join(dirPath, file), "utf-8");
      let mission = [];
      let content = raw;
      // Parse YAML frontmatter if present
      if (content.startsWith("---")) {
        const fmMatch = content.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---[\r\n]+/);
        if (fmMatch) {
          try {
            const fmData = yaml.load(fmMatch[1]);
            if (fmData && Array.isArray(fmData.mission)) {
              mission = fmData.mission;
            }
          } catch (e) {
            // ignore YAML parse errors
          }
          content = content.slice(fmMatch[0].length);
        }
      }

      // Extract title
      // eslint-disable-next-line sonarjs/slow-regex
      const titleMatch = content.match(/^#\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1].trim() : "";
      // Extract description: first non-heading paragraph
      // eslint-disable-next-line sonarjs/slow-regex
      const afterHeading = content.replace(/^#\s+.*$/m, "").trim();
      let description = "";
      if (afterHeading) {
        const lines = afterHeading.split(/\r?\n/);
        const descLines = [];
        for (const line of lines) {
          if (line.trim() === "") break;
          descLines.push(line.trim());
        }
        description = descLines.join(" ");
      }
      featuresList.push({ title, description, mission });
    }

    console.log(JSON.stringify(featuresList, null, 2));
    process.exit(0);
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exit(1);
  }
}

/**
 * Render an EJS template with provided JSON or YAML data.
 */
async function renderTemplate(args) {
  const [templatePath, dataPath] = args._;
  if (!templatePath || !dataPath) {
    console.error("Error: --render requires <templatePath> and <dataPath>");
    process.exit(1);
  }
  const tpl = await fs.readFile(path.resolve(templatePath), "utf-8");
  const dataRaw = await fs.readFile(path.resolve(dataPath), "utf-8");
  let data;
  if (dataPath.endsWith(".json")) {
    data = JSON.parse(dataRaw);
  } else if (dataPath.endsWith(".yaml") || dataPath.endsWith(".yml")) {
    data = yaml.load(dataRaw);
  } else {
    data = JSON.parse(dataRaw);
  }
  const output = ejs.render(tpl, data);
  console.log(output);
}

/**
 * Echo message arguments to stdout.
 */
function echoMessage(args) {
  console.log(args.slice(1).join(" "));
}

// If the script is run directly, invoke main with process arguments
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}