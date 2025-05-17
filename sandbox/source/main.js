#!/usr/bin/env node
import minimist from "minimist";
import { main as coreMain } from "../../src/lib/main.js";

const args = process.argv.slice(2);
const options = minimist(args, {
  alias: { m: "mission" },
  boolean: ["mission"],
});

if (options.mission) {
  console.log("Repo Mission: Showcase workflows");
  process.exit(0);
}

coreMain(args);
