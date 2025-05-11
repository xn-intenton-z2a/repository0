#!/usr/bin/env node
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

export function main(args) {
  if (args.includes("--help")) {
    const pkgPath = path.resolve(process.cwd(), "package.json");
    let name = "repository0";
    try {
      const pkgContent = fs.readFileSync(pkgPath, "utf8");
      const pkg = JSON.parse(pkgContent);
      name = pkg.name && pkg.name.includes("/") ? pkg.name.split("/").pop() : pkg.name || name;
    } catch {
      // Fallback to default name
    }
    const scriptPath = path.relative(process.cwd(), fileURLToPath(import.meta.url));
    console.log(`${name}: A CLI demo of our agentic workflows.`);
    console.log("");
    console.log(`Usage: ${scriptPath} [options] [arguments]`);
    console.log("");
    console.log("Options:");
    console.log("  --help      Show this help message");
    console.log("  --mission   Print the repository mission statement");
    console.log("  --version   Print the package version");
    console.log("");
    console.log("Examples:");
    console.log("  npm run start -- --help");
    console.log("  npm run start -- --mission");
    console.log("  npm run start -- foo bar");
    process.exit(0);
  } else if (args.includes("--version")) {
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
