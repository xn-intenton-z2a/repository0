#!/usr/bin/env node
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import minimist from "minimist";
import ejs from "ejs";
import yaml from "js-yaml";

/**
 * Main entrypoint for CLI commands.
 * @param {string[]} argv - Command-line arguments (excluding node and script path).
 */
export async function main(argv) {
  const args = minimist(argv, {
    boolean: ["help", "mission", "version", "render", "features"],
    alias: { h: "help", m: "mission", f: "features" },
  });

  // Help command
  if (args.help) {
    console.log(
      `Usage: ${path.basename(
        process.argv[1]
      )} [--help] [-m|--mission] [--version] [-f|--features] [--render <template> <data>] [echo <message>...]`
    );
    console.log(`\nCommands:`);
    console.log(`  --help                      Display usage instructions`);
    console.log(`  -m, --mission               Print mission statement`);
    console.log(`  --version                   Print version`);
    console.log(`  -f, --features              List available features`);
    console.log(`  --render <template> <data>  Render EJS template with data (JSON or YAML)`);
    console.log(`  echo <message>              Echo message`);
    return;
  }

  // Mission statement
  if (args.mission) {
    const mission = await fs.readFile(path.resolve("MISSION.md"), "utf-8");
    console.log(mission);
    return;
  }

  // Version
  if (args.version) {
    const pkg = JSON.parse(
      await fs.readFile(path.resolve("package.json"), "utf-8")
    );
    console.log(pkg.version);
    return;
  }

  // List features
  if (args.features) {
    // Read and display mission statement first
    const missionText = await fs.readFile(path.resolve("MISSION.md"), "utf-8");
    console.log(missionText);
    try {
      const dirPath = path.resolve("sandbox/features");
      const files = await fs.readdir(dirPath);
      const mdFiles = files.filter((f) => f.endsWith(".md"));
      const featuresList = [];
      for (const file of mdFiles) {
        const content = await fs.readFile(path.join(dirPath, file), "utf-8");
        // Extract title
        const titleMatch = content.match(/^#\s+(.*)$/m);
        const title = titleMatch ? titleMatch[1].trim() : "";
        // Extract description: first non-heading paragraph
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
        featuresList.push({ title, description });
      }
      console.log(JSON.stringify(featuresList, null, 2));
      process.exit(0);
    } catch (e) {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
    return;
  }

  // Render EJS template
  if (args.render) {
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
      // Fallback to JSON parse
      data = JSON.parse(dataRaw);
    }
    const output = ejs.render(tpl, data);
    console.log(output);
    return;
  }

  // Echo command
  if (args._.length > 0 && args._[0] === "echo") {
    console.log(args._.slice(1).join(" "));
    return;
  }

  // Default to help
  console.log(
    `Usage: ${path.basename(
      process.argv[1]
    )} [--help] [-m|--mission] [--version] [-f|--features] [--render <template> <data>] [echo <message>...]`
  );
}

// If the script is run directly, invoke main with process arguments
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
