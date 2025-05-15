#!/usr/bin/env node
// sandbox/source/main.js
// CLI entrypoint with support for --help, --version, --mission commands
import minimist from "minimist";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { main as echoMain } from "../../src/lib/main.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const argv = minimist(args, { boolean: ["help", "version", "mission"], alias: { h: "help", v: "version", m: "mission" } });

// Precedence: help > version > mission
if (argv.help) {
  showHelp();
} else if (argv.version) {
  showVersion();
} else if (argv.mission) {
  showMission();
} else {
  echoMain(args);
}

function showHelp() {
  const script = path.basename(process.argv[1]);
  console.log(
    `Usage: node ${script} [options]\n\nOptions:\n  --help      Show help information\n  --version   Show version number\n  --mission   Show mission statement\n\nExamples:\n  $ node ${script} --help\n  $ node ${script} --version\n  $ node ${script} --mission\n` +
      `\nFor full mission statement see MISSION.md`);
}

function showVersion() {
  const pkgPath = path.resolve(__dirname, "../../package.json");
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    console.log(pkg.version);
  } catch (err) {
    console.error("Error reading version:", err);
    process.exit(1);
  }
}

function showMission() {
  const missionPath = path.resolve(__dirname, "../../MISSION.md");
  try {
    const content = fs.readFileSync(missionPath, "utf8");
    const lines = content.split(/\r?\n/);
    // find first header
    const headerLine = lines.find((l) => l.startsWith("# "));
    // find first non-empty paragraph after header
    let paragraph = "";
    if (headerLine) {
      const startIdx = lines.indexOf(headerLine) + 1;
      for (let i = startIdx; i < lines.length; i++) {
        if (lines[i].trim() !== "") {
          paragraph = lines[i];
          break;
        }
      }
    }
    if (headerLine && paragraph) {
      console.log(`${headerLine}\n\n${paragraph}`);
    } else {
      console.log(content);
    }
  } catch (err) {
    console.error("Error reading mission statement:", err);
    process.exit(1);
  }
}
