#!/usr/bin/env node
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

export function main(args) {
  if (args.includes("--version")) {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    try {
      const pkgContent = fs.readFileSync(pkgPath, "utf8");
      const pkg = JSON.parse(pkgContent);
      console.log(pkg.version);
      process.exit(0);
    } catch (err) {
      console.error(`Error reading version from package.json: ${err.message}`);
      process.exit(1);
    }
  } else if (args.includes("--mission")) {
    // Read and print the repository mission statement
    const missionPath = path.resolve(process.cwd(), "MISSION.md");
    try {
      const content = fs.readFileSync(missionPath, "utf8");
      console.log(content);
    } catch (err) {
      console.error(`Error reading mission file: ${err.message}`);
      process.exit(1);
    }
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
