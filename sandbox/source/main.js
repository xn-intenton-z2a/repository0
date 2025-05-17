#!/usr/bin/env node
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

async function main(args) {
  if (args[0] === "mission") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const missionPath = resolve(__dirname, "../../..", "MISSION.md");
    const content = await readFile(missionPath, "utf8");
    console.log(content);
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

const args = process.argv.slice(2);
main(args).catch((err) => {
  console.error(err);
  process.exit(1);
});