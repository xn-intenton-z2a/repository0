# ESLINT_USING

## Crawl Summary
Installation commands, configuration file formats (JSON, YAML, JS, package.json), essential CLI options (--config, --env, --ext, --fix, --format, --quiet, --ignore-pattern), Node.js API usage patterns (ESLint class constructor options, lintFiles, outputFixes, loadFormatter, format output), formatter list, plugin resolution method, .eslintignore usage.

## Normalised Extract
Table of Contents
1 Installation
2 Initialization
3 Configuration File Structure
4 CLI Usage
5 Node.js API

1 Installation
* npm install eslint --save-dev
* npx eslint --init for interactive setup

2 Initialization
* Generates .eslintrc.* based on prompts
* Supports popular style guides (Airbnb, Standard)

3 Configuration File Structure
Files supported:
  .eslintrc.json
  .eslintrc.yaml
  .eslintrc.js / .eslintrc.cjs
  package.json  { "eslintConfig": {...} }
Fields:
  env            object of { [envName]: boolean }
  parserOptions  object { ecmaVersion: number|string, sourceType: "script"|"module", ecmaFeatures: { jsx: boolean } }
  extends        array of string (shareable configs or "eslint:recommended")
  plugins        array of string (plugin names without "eslint-plugin-" prefix)
  rules          object { [ruleId]: "off"|"warn"|"error" or [level, options] }
  overrideConfigFile path string to load config from custom path

4 CLI Usage
Syntax: eslint [options] [file|dir|glob ...]
Options:
  --config <path>
  --env <env1,env2>
  --ext <.js,.jsx,.ts>
  --fix (boolean)
  --format <formatterName|path>
  --quiet (boolean)
  --ignore-pattern <pattern>
Examples:
  eslint "src/**/*.{js,jsx}" --fix --ext .js,.jsx --config .eslintrc.json

5 Node.js API
Import:
  const { ESLint } = require("eslint");
Constructor options:
  cwd            string (working directory, default process.cwd())
  fix            boolean (apply fixes)
  overrideConfigFile string (path to config)
Methods:
  lintFiles(patterns: string|string[]): Promise<ESLint.LintResult[]>
  lintText(text: string, options?: { filePath?: string }): Promise<ESLint.LintResult[]>
  loadFormatter(nameOrPath: string): Promise<Formatter>
  outputFixes(results: ESLint.LintResult[]): Promise<void>
Formatter:
  format(results: ESLint.LintResult[]): string


## Supplementary Details
Configuration defaults:
env: {} (no globals defined)
parserOptions.ecmaVersion: 5
parserOptions.sourceType: "script"
extends: []
plugins: []
rules: {}
ignorePatterns: ["node_modules/*"]

Initialization steps:
1. npx eslint --init
2. Answer prompts: type of module, framework, TypeScript, running in browser/node, style guide
3. ESLint installs dependencies, generates chosen config

Plugin installation:
npm install eslint-plugin-<pluginName> --save-dev

Formatter usage:
eslint --format json --output-file report.json

. eslintignore globs follow .gitignore syntax, matched against current working directory paths


## Reference Details
CLI Options
--config <path>                    Load configuration file from path (string)
--env <env1,env2>                  Define environments: browser, node, es6, mocha, jest, etc.
--ext <.js,.jsx,.ts>               Specify file extensions (default .js)
--fix                              Apply automatic fixes for problems
--fix-dry-run                      Show potential fixes without writing to files
--fix-type <problemTypes>         Limit fixes to problem types: problem, suggestion, layout
--format <formatterName|path>      Use a specific formatter: stylish (default), compact, json, table, unix, visualstudio, html, jslint-xml, checkstyle, tap
--output-file <filePath>           Write report to file instead of stdout
--quiet                            Report errors only, ignore warnings
--ignore-path <path>               Custom ignore file path (default .eslintignore)
--ignore-pattern <pattern>         Pattern of files to ignore
--report-unused-disable-directives  Report unused eslint-disable comments
--max-warnings <number>            Number of warnings to trigger nonzero exit code

Exit codes: 0 if no linting errors, 1 if linting errors or config errors, 2 if execution error

Node.js API
class ESLint(options?: {
  cwd?: string;
  overrideConfigFile?: string;
  envs?: string[];
  extensions?: string[];
  cache?: boolean;
  cacheLocation?: string;
  fix?: boolean;
  fixTypes?: ("problem"|"suggestion"|"layout")[];
  allowInlineConfig?: boolean;
  ignore?: boolean;
  ignorePath?: string;
  ignorePattern?: string|string[];
  cwd? : string;
})

Methods
lintFiles(patterns: string|string[]): Promise<LintResult[]>
lintText(text: string, options?: { filePath?: string }): Promise<LintResult[]>
loadFormatter(nameOrPath: string): Promise<{ format(results: LintResult[]): string }>
outputFixes(results: LintResult[]): Promise<void>

Interfaces
interface LintResult {
  filePath: string;
  messages: LintMessage[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  output?: string;
}
interface LintMessage {
  ruleId: string | null;
  severity: 1|2;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  fix?: { range: [number, number]; text: string };
}

Code Example
const { ESLint } = require("eslint");
(async () => {
  const eslint = new ESLint({ fix: true, overrideConfigFile: ".eslintrc.js" });
  const results = await eslint.lintFiles(["src/**/*.js"]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("html");
  const html = formatter.format(results);
  require("fs").writeFileSync("report.html", html);
})();

Troubleshooting
1. Invalid config file path error:
Command: eslint --config nonexistent.json src/
Expected: exit code 1, message "No ESLint configuration found"
Solution: Verify path and filename, use correct extension

2. Parsing error for unsupported syntax:
Error: Parsing error: Unexpected token
Solution: Update parserOptions.ecmaVersion to 2021 or later, install @babel/eslint-parser or @typescript-eslint/parser and configure parser field in config

3. Plugin not found:
Error: Failed to load plugin 'react'
Solution: npm install eslint-plugin-react --save-dev, ensure "react" appears in "plugins"

4. Formatter output not applied:
Using --format html but output printed to stdout
Solution: Add --output-file report.html flag


## Information Dense Extract
install:npm i eslint --save-dev;npx eslint --init
config files:.eslintrc.json/.yaml/.js/.cjs/package.json{eslintConfig}
config fields:env{browser,node,es6},parserOptions{ecmaVersion:2021,sourceType:module,ecmaFeatures.jsx},extends[],plugins[],rules{ruleId:[level,options]}
CLI:eslint [files] --config path --env list --ext .js,.jsx --fix --fix-dry-run --fix-type problem,suggestion,layout --format stylish|json|html --output-file file --quiet --ignore-path path --ignore-pattern pattern
NodeAPI:new ESLint({cwd,overrideConfigFile,extensions,fix,cache,ignorePath,ignorePattern})
methods:lintFiles(string|string[]):Promise<LintResult[]>;lintText(text:string,options?);loadFormatter(name:string):Promise<{format(results):string}>;outputFixes(results):Promise<void>
LintResult:{filePath,messages,errorCount,warningCount,fixableErrorCount,fixableWarningCount,output?}
LintMessage:{ruleId,severity,message,line,column,endLine?,endColumn?,fix?}
example: see code above
defaults:ecmaVersion:5,sourceType:script,ignorePattern:node_modules/*
troubleshoot:invalid config path,parsing errors,plugin load errors,formatter output issues

## Sanitised Extract
Table of Contents
1 Installation
2 Initialization
3 Configuration File Structure
4 CLI Usage
5 Node.js API

1 Installation
* npm install eslint --save-dev
* npx eslint --init for interactive setup

2 Initialization
* Generates .eslintrc.* based on prompts
* Supports popular style guides (Airbnb, Standard)

3 Configuration File Structure
Files supported:
  .eslintrc.json
  .eslintrc.yaml
  .eslintrc.js / .eslintrc.cjs
  package.json  { 'eslintConfig': {...} }
Fields:
  env            object of { [envName]: boolean }
  parserOptions  object { ecmaVersion: number|string, sourceType: 'script'|'module', ecmaFeatures: { jsx: boolean } }
  extends        array of string (shareable configs or 'eslint:recommended')
  plugins        array of string (plugin names without 'eslint-plugin-' prefix)
  rules          object { [ruleId]: 'off'|'warn'|'error' or [level, options] }
  overrideConfigFile path string to load config from custom path

4 CLI Usage
Syntax: eslint [options] [file|dir|glob ...]
Options:
  --config <path>
  --env <env1,env2>
  --ext <.js,.jsx,.ts>
  --fix (boolean)
  --format <formatterName|path>
  --quiet (boolean)
  --ignore-pattern <pattern>
Examples:
  eslint 'src/**/*.{js,jsx}' --fix --ext .js,.jsx --config .eslintrc.json

5 Node.js API
Import:
  const { ESLint } = require('eslint');
Constructor options:
  cwd            string (working directory, default process.cwd())
  fix            boolean (apply fixes)
  overrideConfigFile string (path to config)
Methods:
  lintFiles(patterns: string|string[]): Promise<ESLint.LintResult[]>
  lintText(text: string, options?: { filePath?: string }): Promise<ESLint.LintResult[]>
  loadFormatter(nameOrPath: string): Promise<Formatter>
  outputFixes(results: ESLint.LintResult[]): Promise<void>
Formatter:
  format(results: ESLint.LintResult[]): string

## Original Source
ESLint Official Documentation
https://eslint.org/docs/latest/

## Digest of ESLINT_USING

# Installation

Run in your project root:

```
npm install eslint --save-dev
npx eslint --init  # interactive configuration
```

# Configuration

Create one of these files at project root:

.eslintrc.json
.eslintrc.yaml
.eslintrc.js
.eslintrc.cjs
package.json  { "eslintConfig": { ... } }

Example .eslintrc.json:

```
{
  "env": { "browser": true, "node": true, "es6": true },
  "parserOptions": { "ecmaVersion": 2021, "sourceType": "module" },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "plugins": ["react"],
  "rules": { "no-console": "warn", "eqeqeq": ["error", "always"] }
}
```

# CLI Usage

Command syntax:

```
eslint [options] [file|dir|glob ...]
```

Key options:

--config path       Path to config file
--env list          Environments to define globals (comma-separated)
--ext list          File extensions to lint (comma-separated, default .js)
--fix               Automatically fix problems
--format name|path  Formatter to use (stylish, json, html, etc.)
--quiet             Report errors only
--ignore-pattern p  Pattern of files to ignore

Examples:

```
eslint "src/**/*.{js,jsx}" --fix --ext .js,.jsx --config .eslintrc.json
```

# Node.js API

Import and use ESLint class:

```
const { ESLint } = require("eslint");
async function run() {
  const eslint = new ESLint({
    cwd: process.cwd(),
    fix: true,
    overrideConfigFile: ".eslintrc.json"
  });
  const results = await eslint.lintFiles(["src/**/*.js"]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("stylish");
  const output = formatter.format(results);
  console.log(output);
}
run();
```

# Formatter Configuration

Formatters shipped:

stylish (default), compact, json, html, unix

Custom formatters: path to JS module exporting a function with signature function(results)

# Plugin Resolution

Plugins must be installed via npm: `npm install eslint-plugin-<name> --save-dev`. In config:

```
"plugins": ["<name>"],
"extends": ["plugin:<name>/recommended"]
```

# .eslintignore

Use .eslintignore at project root with glob patterns to exclude files/directories

Example:

```
node_modules/
build/
coverage/
```


## Attribution
- Source: ESLint Official Documentation
- URL: https://eslint.org/docs/latest/
- License: License
- Crawl Date: 2025-05-06T18:30:14.170Z
- Data Size: 1550767 bytes
- Links Found: 4643

## Retrieved
2025-05-06
