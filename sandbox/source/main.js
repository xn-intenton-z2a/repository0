#!/usr/bin/env node
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import minimist from "minimist";
import { main } from "../../src/lib/main.js";

/**
 * CLI entrypoint function.
 * @param {string[]} argv - Command line arguments.
 */
export async function cli(argv) {
  const args = argv || process.argv.slice(2);
  const opts = minimist(args, {
    alias: { m: "mission", h: "help", v: "version" },
    boolean: ["mission", "help", "version"],
  });

  if (opts.mission) {
    try {
      const missionPath = path.resolve(process.cwd(), "MISSION.md");
      const content = await fs.readFile(missionPath, "utf8");
      console.log(content);
      return;
    } catch (err) {
      console.error(`Error reading mission statement: ${err.message}`);
      return;
    }
  }

  // Fallback: default behavior
  main(args);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Called directly as a script
  cli(process.argv.slice(2));
}
