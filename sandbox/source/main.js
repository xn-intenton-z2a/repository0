#!/usr/bin/env node
import fs from "fs";
import minimist from "minimist";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { main as coreMain } from "../../src/lib/main.js";

const args = process.argv.slice(2);
const options = minimist(args, {
  alias: { m: "mission" },
  boolean: ["mission"],
});

if (options.mission) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const missionPath = resolve(__dirname, "../..", "MISSION.md");
  const content = fs.readFileSync(missionPath, "utf8");
  console.log(content);
  process.exit(0);
}

coreMain(args);
