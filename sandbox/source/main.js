#!/usr/bin/env node
import minimist from "minimist";
import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import ejs from "ejs";
import dotenv from "dotenv";
import jsYaml from "js-yaml";
import MarkdownIt from "markdown-it";
import Database from "better-sqlite3";
import Ajv from "ajv";

async function showHelp() {
  console.log(`Usage: npm run start -- <command> [args]

Commands:
  help               Display this help message
  mission            Print the mission statement
  version            Print the current version
  echo               Echo the provided arguments
  features           List available feature documents (use --validate-mission to list those without mission reference)
  mission-features   Print the mission statement and list available features
  csv-import         Import a CSV file and output JSON array
  render             Render an EJS template with optional JSON data and output file
  replace            Perform search-and-replace on a text file
  text-replace       Alias for replace
  convert            Convert between .env, JSON, and YAML formats (use --to-json, --to-env, or --to-yaml)
  validate           Validate JSON syntax and optionally JSON Schema
  markdown           Convert a Markdown file to HTML
  import-data        Import structured data files into a SQLite database

Examples:
  npm run start -- help
  npm run start -- mission
  npm run start -- version
  npm run start -- echo Hello World
  npm run start -- features
  npm run start -- features --validate-mission
  npm run start -- mission-features
  npm run start -- csv-import data.csv
  npm run start -- csv-import data.csv --output out.json --delimiter ";" --header false
  npm run start -- render template.ejs
  npm run start -- render template.ejs data.json
  npm run start -- render template.ejs data.json --output out.html
  npm run start -- replace file.txt --search foo --replace bar
  npm run start -- text-replace file.txt --search foo --replace bar --regex --flags "gi" --output out.txt
  npm run start -- convert file.env --to-yaml --output out.yaml
  npm run start -- convert file.env --to-json
  npm run start -- convert config.json --to-env
  npm run start -- validate data.json
  npm run start -- validate data.json --schema schema.json
  npm run start -- validate data.json --schema schema.json --output report.txt
  npm run start -- markdown file.md --output file.html
  npm run start -- import-data data.csv --db my.db --table users --delimiter ";" --header false --overwrite`);
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

async function showFeatures(argv) {
  const validate = argv && argv["validate-mission"];
  try {
    const cwd = process.cwd();
    const featuresDir = path.join(cwd, "sandbox/features");
    const files = await fs.readdir(featuresDir);
    for (const file of files) {
      if (path.extname(file).toLowerCase() === ".md") {
        const filePath = path.join(featuresDir, file);
        const content = await fs.readFile(filePath, "utf-8");
        const lines = content.split("\n");
        let heading = null;
        for (const line of lines) {
          const match = line.match(/^#\s+(.*)/);
          if (match) {
            heading = match[1];
            break;
          }
        }
        if (!heading) {
          continue;
        }
        if (validate) {
          if (content.includes("MISSION.md") || content.includes("# Mission Statement")) {
            continue;
          }
        }
        console.log(heading);
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

async function doTextReplace(argv) {
  const inputFile = argv._[1];
  const search = argv.search;
  const replacement = argv.replace;
  const regexFlag = argv.regex;
  const allFlag = argv.all;
  const flagsArg = argv.flags || "";
  const output = argv.output;

  if (!inputFile || search === undefined || replacement === undefined) {
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
  if (regexFlag) {
    let flags = flagsArg;
    if (!flags) {
      flags = "g";
    }
    let re;
    try {
      re = new RegExp(search, flags);
    } catch (err) {
      console.error("Invalid regular expression:", err.message);
      process.exit(1);
    }
    result = content.replace(re, replacement);
  } else {
    if (allFlag) {
      // global literal replacement
      if (typeof content.replaceAll === "function") {
        result = content.replaceAll(search, replacement);
      } else {
        result = content.split(search).join(replacement);
      }
    } else {
      result = content.replace(search, replacement);
    }
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
  }
}

async function doConvert(argv) {
  const inputFile = argv._[1];
  const toEnv = argv["to-env"];
  const toYaml = argv["to-yaml"];
  const toJson = argv["to-json"];
  const output = argv.output;

  if (!inputFile) {
    console.error("Error: No input file specified");
    process.exit(1);
  }

  const flagCount = [toEnv, toYaml, toJson].filter(Boolean).length;
  if (flagCount > 1) {
    console.error("Error: Specify exactly one of --to-json, --to-env, or --to-yaml");
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

  let data;
  try {
    const ext = path.extname(inputFile).toLowerCase();
    if (ext === ".env") {
      data = dotenv.parse(content);
    } else if (ext === ".json") {
      data = JSON.parse(content);
    } else if (ext === ".yaml" || ext === ".yml") {
      data = jsYaml.load(content);
    } else {
      console.error(`Unsupported input format: ${ext}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error parsing input file: ${err.message}`);
    process.exit(1);
  }

  let result;
  try {
    if (toEnv) {
      if (typeof data !== "object" || data === null) {
        throw new Error("Input JSON must be an object for env conversion");
      }
      result = Object.entries(data)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    } else if (toYaml) {
      result = jsYaml.dump(data);
    } else {
      result = JSON.stringify(data, null, 2);
    }
  } catch (err) {
    console.error("Error serializing output:", err.message);
    process.exit(1);
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
  }
}

async function doValidateCommand(argv) {
  const args = argv._;
  const fileArg = args[1];
  const schemaArg = argv.schema;
  const outFile = argv.output;
  const usage = "Usage: npm run start -- validate <jsonFile> [--schema <schemaFile>] [--output <file>]";

  if (!fileArg) {
    if (outFile) {
      await fs.writeFile(path.resolve(outFile), usage, "utf-8");
      process.exit(1);
    }
    console.error(usage);
    process.exit(1);
  }

  let data;
  try {
    const content = await fs.readFile(path.resolve(fileArg), "utf-8");
    data = JSON.parse(content);
  } catch (err) {
    const msg = err.name === "SyntaxError"
      ? `Error parsing ${fileArg}: ${err.message}`
      : `Error reading ${fileArg}: ${err.message}`;
    if (outFile) {
      await fs.writeFile(path.resolve(outFile), msg, "utf-8");
      process.exit(1);
    }
    console.error(msg);
    process.exit(1);
  }

  let messages = [];
  let valid = true;
  if (schemaArg) {
    let schema;
    try {
      const schemaContent = await fs.readFile(path.resolve(schemaArg), "utf-8");
      schema = JSON.parse(schemaContent);
    } catch (err) {
      const msg = `Error reading schema: ${err.message}`;
      if (outFile) {
        await fs.writeFile(path.resolve(outFile), msg, "utf-8");
        process.exit(1);
      }
      console.error(msg);
      process.exit(1);
    }
    const ajv = new Ajv({ strict: false });
    const validateFn = ajv.compile(schema);
    valid = validateFn(data);
    if (!valid && validateFn.errors) {
      for (const err of validateFn.errors) {
        const dataPath = err.instancePath || err.dataPath || "";
        messages.push(`${dataPath}: ${err.message}`);
      }
    }
  }

  if (valid) {
    messages.push(`Validation passed for ${fileArg}`);
  }

  if (outFile) {
    await fs.writeFile(path.resolve(outFile), messages.join("\n"), "utf-8");
    process.exit(valid ? 0 : 1);
  } else {
    if (valid) {
      console.log(messages[0]);
      process.exit(0);
    }
    for (const msg of messages) {
      console.error(msg);
    }
    process.exit(1);
  }
}

async function doImportData(argv) {
  const inputFile = argv._[1];
  const dbPath = argv.db;
  const table = argv.table || 'data';
  const delimiter = argv.delimiter || ',';
  const header = argv.header !== false;
  const overwrite = argv.overwrite || false;

  if (!inputFile) {
    console.error('Error: No input file specified');
    process.exit(1);
  }
  if (!dbPath) {
    console.error('Error: --db <database path> is required');
    process.exit(1);
  }

  let raw;
  try {
    raw = await fs.readFile(path.resolve(inputFile), 'utf-8');
  } catch (err) {
    console.error('Error reading input file:', err.message);
    process.exit(1);
  }

  let records;
  const ext = path.extname(inputFile).toLowerCase();
  try {
    if (ext === '.csv') {
      records = parse(raw, { columns: header, delimiter, skip_empty_lines: true });
    } else if (ext === '.json') {
      const data = JSON.parse(raw);
      if (!Array.isArray(data)) {
        console.error('Error: JSON input must be an array of objects');
        process.exit(1);
      }
      records = data;
    } else if (ext === '.yaml' || ext === '.yml') {
      const data = jsYaml.load(raw);
      if (!Array.isArray(data)) {
        console.error('Error: YAML input must be an array of objects');
        process.exit(1);
      }
      records = data;
    } else if (ext === '.env') {
      const envObj = dotenv.parse(raw);
      records = [envObj];
    } else {
      console.error(`Unsupported input format: ${ext}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error parsing input file: ${err.message}`);
    process.exit(1);
  }

  let db;
  try {
    db = new Database(dbPath);
  } catch (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }

  try {
    const exists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
    if (exists) {
      if (overwrite) {
        db.prepare(`DROP TABLE "${table}"`).run();
      } else {
        console.error(`Error: Table '${table}' already exists. Use --overwrite to replace.`);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('Error checking table existence:', err.message);
    process.exit(1);
  }

  const keys = Object.keys(records[0] || {});
  const colsDef = keys.map((k) => `"${k}" TEXT`).join(', ');
  try {
    db.prepare(`CREATE TABLE "${table}" (${colsDef})`).run();
  } catch (err) {
    console.error('Error creating table:', err.message);
    process.exit(1);
  }

  const placeholders = keys.map(() => '?').join(', ');
  const insertSQL = `INSERT INTO "${table}" (${keys.map((k) => `"${k}"`).join(', ')}) VALUES (${placeholders})`;
  const insertStmt = db.prepare(insertSQL);
  const insertMany = db.transaction((recs) => {
    for (const r of recs) {
      insertStmt.run(...keys.map((k) => r[k]));
    }
  });
  try {
    insertMany(records);
  } catch (err) {
    console.error('Error inserting records:', err.message);
    process.exit(1);
  }

  db.close();
  console.log(`Inserted ${records.length} records into table '${table}' in database ${dbPath}`);
  process.exit(0);
}

async function doMarkdown(argv) {
  const inputFile = argv._[1];
  const output = argv.output;
  if (!inputFile) {
    console.error("Error: No input file specified");
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
  const md = new MarkdownIt();
  let html;
  try {
    html = md.render(content);
  } catch (err) {
    console.error("Error rendering markdown:", err.message);
    process.exit(1);
  }
  if (output) {
    try {
      const outputPath = path.resolve(output);
      await fs.writeFile(outputPath, html, "utf-8");
      process.exit(0);
    } catch (err) {
      console.error("Error writing output file:", err.message);
      process.exit(1);
    }
  } else {
    console.log(html);
  }
}

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ["header", "regex", "to-env", "to-yaml", "to-json", "overwrite", "validate-mission", "all"],
    string: ["output", "delimiter", "flags", "search", "replace", "db", "table", "schema"],
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
      await showFeatures(argv);
      break;
    case "mission-features":
      await showMission();
      console.log("");
      await showFeatures(argv);
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
    case "convert":
      await doConvert(argv);
      break;
    case "validate":
      await doValidateCommand(argv);
      break;
    case "markdown":
      await doMarkdown(argv);
      break;
    case "import-data":
      await doImportData(argv);
      break;
    default:
      console.log(`Unknown command: ${command}` + "\n");
      await showHelp();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
