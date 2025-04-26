# NPM_CHECKUPDATES

## Crawl Summary
npm-check-updates is a CLI and module tool to upgrade package.json dependencies to their latest versions while preserving semantic version constraints. Key technical features include installing with npm or npx, using targeted commands such as ncu, ncu -u, and ncu -g, and handling advanced filtering options (filter, filterResults, filterVersion, reject, groupFunction). Extensive CLI options enable deep customization: caching, concurrency, registry specification, peer dependency resolution, and automated upgrade with doctor mode which runs tests and reverts on failure. Configuration files (.ncurc) support JSON and JS formats with function definitions for dynamic filtering. Module usage allows programmatic integration with complete API method signatures.

## Normalised Extract
Table of Contents:
1. Installation
   - npm install -g npm-check-updates
   - npx npm-check-updates
2. Basic Usage
   - ncu for checking version updates
   - ncu -u for upgrading package.json, followed by npm install
   - ncu -g for global package checking
3. CLI Options & Parameters
   - --cache: Enables local caching (default file: ~/.ncu-cache.json, expiration: 10 minutes)
   - --concurrency <n>: Sets maximum concurrent HTTP requests (default 8)
   - --configFileName and --configFilePath: Specify custom config file names and directories
   - --cwd <path>: Working directory specification
   - --dep: Limit checks to dependency sections (default [prod, dev, optional, packageManager])
   - --deprecated: Boolean flag (default true)
   - --doctor: Iterative upgrade mode with testing (requires -u)
   - --doctorInstall and --doctorTest: Custom commands for install and test scripts
   - --filter and --reject: Filter package names using strings/wildcards/regex or custom functions
   - --format: Modify output formatting; options include group, ownerChanged, repo, time, lines, installedVersion
   - --install: Auto-install behavior (always, never, prompt; default prompt)
   - -p, --packageManager: Specify npm, yarn, pnpm, bun, etc. (default npm)
   - --peer: Evaluate and enforce peer dependency constraints
   - --pre: Include prerelease versions (default 0)
   - -r, --registry and --registryType: Choose registry source, type (npm or json)
   - --removeRange: Removes version ranges from output versions
   - --retry <n>: Retry count for package info requests (default 3)
   - -s, --silent: Suppress output
   - -t, --target: Set upgrade target; accepts latest, newest, greatest, minor, patch, semver, @[tag] (default latest)
   - --timeout <ms>: Global timeout settings (default no global timeout, 30 sec per registry fetch)
   - -u, --upgrade: Overwrite package.json with new versions
   - --verbose: Enable verbose logging
   - Workspace options: -w, --workspace and -ws, --workspaces
4. Advanced Filtering & Functions
   - filter: Function (name, semver) => boolean
   - filterResults: Function (packageName, { current, currentVersionSemver, upgraded, upgradedVersionSemver }) => boolean
   - filterVersion: Same usage as filter for version pattern matching
   - groupFunction: Function (name, defaultGroup, currentSpec, upgradedSpec, upgradedVersion) => group name
5. Config File (.ncurc) Formats
   - JSON example: { "upgrade": true, "filter": "svelte", "reject": ["@types/estree", "ts-node"] }
   - JS config for advanced functions
6. Module Usage & API
   - Import using: import ncu from 'npm-check-updates'
   - Run method: ncu.run({ packageFile, upgrade, jsonUpgraded, silent }) returns upgraded versions
7. Doctor Mode & Troubleshooting
   - Command: ncu --doctor -u
   - Process: Pre-test with npm install, npm test; optimistic upgrade via ncu -u; iterative testing; revert on failure; log details of broken updates.

Each section includes the exact commands, parameters, defaults, and usage patterns that can be directly applied in development environments.

## Supplementary Details
Exact Parameter Values and Configuration Options:
- Cache Options:
  --cache: Enables caching with default file ~/.ncu-cache.json; --cacheExpiration <min> defaults to 10 minutes;
  --cacheFile <path> allows custom file specification.
- Concurrency: --concurrency <n> defaults to 8 concurrent HTTP requests.
- Dependency Check: --dep defaults to [prod, dev, optional, packageManager].
- Doctor Mode: Requires running 'ncu --doctor -u' which internally executes npm install (or custom command via --doctorInstall) and npm test (or via --doctorTest). In the event of test failure, the upgrade is rolled back.
- Filtering Functions:
  filter: function(name, semver) { if (name.startsWith('@myorg/')) return false; return true; }
  filterResults: function(packageName, { current, currentVersionSemver, upgraded, upgradedVersionSemver }) { let currentMajor = parseInt(currentVersionSemver[0]?.major, 10); let upgradedMajor = parseInt(upgradedVersionSemver?.major, 10); if (currentMajor && upgradedMajor) { return currentMajor >= upgradedMajor; } return true; }
  filterVersion: similar to filter, example rejecting packages where semver major > 5 for '@myorg/' packages.
- Formatting Options: --format accepts comma-delimited values such as group, ownerChanged, repo, time, lines, installedVersion. Grouping can be customized using groupFunction:
  groupFunction: function(name, defaultGroup, currentSpec, upgradedSpec, upgradedVersion) { if (name === 'typescript' && defaultGroup === 'minor') return 'major'; if (name.startsWith('@myorg/')) return 'My Org'; return defaultGroup; }
- Registry Options: Using --registry and --registryType (npm by default, or json for file based registries). Example JSON registry file provided with package versions.
- Upgrade Target: --target accepts values: latest, newest, greatest, minor, patch, semver, or a custom tag (e.g. @next). Default is latest.
- Module API:
  ncu.run({ packageFile: '../package.json', upgrade: true, jsonUpgraded: true, silent: true }) returns an object with package names and upgraded versions.
- CLI Examples:
  ncu mocha
  ncu -f "chalk mocha react"
  ncu \!nodemon
  ncu react-*
  ncu "/^react-.*$/"

Implementation Steps:
1. Verify package.json is under version control.
2. Run ncu to check updates.
3. Run ncu -u to upgrade the file.
4. Run npm install to update installed packages and package-lock.json.
5. (Optional) Use interactive mode via ncu --interactive for selective upgrades.
6. For doctor mode, ensure tests pass before and after upgrade; if tests fail, revert configuration.

Troubleshooting Procedures:
- Run with --verbose to see detailed logs.
- Use --loglevel to adjust output granularity.
- For registry issues, specify --registry and check connectivity.
- In case of failing tests during doctor mode, manually run npm install --no-save <package>@<version> and npm test to isolate issues.


## Reference Details
API and CLI Specifications:

Function API Signatures:
1. filter
   Signature: function filter(name: string, semver: Array): boolean
   Example: if (name.startsWith('@myorg/')) { return false; } else { return true; }

2. filterResults
   Signature: function filterResults(packageName: string, context: { current: string, currentVersionSemver: Array, upgraded: string, upgradedVersionSemver: Object }): boolean
   Example: let currentMajor = parseInt(context.currentVersionSemver[0]?.major, 10); let upgradedMajor = parseInt(context.upgradedVersionSemver?.major, 10); if (currentMajor && upgradedMajor) { return currentMajor >= upgradedMajor; } else { return true; }

3. filterVersion
   Signature: function filterVersion(name: string, semver: Array): boolean
   Example: if (name.startsWith('@myorg/') && parseInt(semver[0]?.major) > 5) { return false; } return true;

4. groupFunction
   Signature: function groupFunction(name: string, defaultGroup: string, currentSpec: string, upgradedSpec: string, upgradedVersion: string): string
   Example: if (name === 'typescript' && defaultGroup === 'minor') return 'major'; if (name.startsWith('@myorg/')) return 'My Org'; else return defaultGroup;

CLI Method Signatures:
- ncu [options]
   Options include: --upgrade (-u), --filter (-f), --reject (-x), --target (-t), --global (-g), --interactive (-i), --doctor (-d), --cache, --concurrency, --install, --packageFile, --packageManager (-p), --pre, --registry, --registryType, --timeout, --verbose, --loglevel, etc.

SDK / Module Usage:
- import ncu from 'npm-check-updates';
  async function updateDependencies() {
    const result = await ncu.run({ 
      packageFile: '../package.json', 
      upgrade: true, 
      jsonUpgraded: true, 
      silent: true
    });
    return result; // Object with package: version mappings
  }

Concrete Best Practices with Implementation Code:
- Ensure package.json is version controlled before running ncu -u.
- Run tests (npm test) prior and post upgrade. Use doctor mode to automate testing and rollback.
- Use interactive mode (ncu --interactive) for granular control.
- Use --filter and --reject to precisely control which packages to upgrade.

Detailed Troubleshooting Commands:
- To clear cache: ncu --cacheClear
- To view debug information: ncu --verbose
- To retry failed requests: use --retry 5 (example increases from default 3).
- Verify registry connectivity with: ncu --registry https://registry.npmjs.org
- For custom configuration issues, check .ncurc.json or .ncurc.js for proper structure and function definitions.

Configuration Options with Defaults & Effects:
--cache: false unless specified, default file: ~/.ncu-cache.json
--cacheExpiration: 10 minutes
--concurrency: 8
--configFileName: .ncurc.{json,yml,js,cjs}
--dep: ["prod","dev","optional","packageManager"]
--deprecated: true
--install: prompt
--packageManager: npm
--pre: 0
--registryType: npm
--retry: 3
--target: latest

Exceptions:
- If a package update causes test failures in doctor mode, the process reverts to the previous stable configuration and logs the error output.


## Information Dense Extract
npm-check-updates CLI and module; install via npm -g or npx; usage: ncu, ncu -u, ncu -g, ncu --interactive; options: --cache (file: ~/.ncu-cache.json, 10min expiration), --concurrency 8, --dep [prod, dev, optional, packageManager], --doctor (-d), --filter, --reject, --filterResults, --filterVersion, --format (group, ownerChanged, repo, time, lines, installedVersion), --install (prompt/always/never), --packageManager (npm by default), --peer, --pre 0, --registry and --registryType (npm/json), --removeRange, --retry 3, --silent, --target (latest/newest/greatest/minor/patch/semver/@[tag]), --timeout, --verbose; API functions: filter(name,semver), filterResults(packageName,context), filterVersion(name,semver), groupFunction(name,defaultGroup,currentSpec,upgradedSpec,upgradedVersion); module usage: ncu.run({ packageFile, upgrade:true, jsonUpgraded:true, silent:true }); doctor mode runs npm install and npm test pre and post upgrade with rollback on failure; configuration via .ncurc files (JSON/JS) with possible function definitions.

## Sanitised Extract
Table of Contents:
1. Installation
   - npm install -g npm-check-updates
   - npx npm-check-updates
2. Basic Usage
   - ncu for checking version updates
   - ncu -u for upgrading package.json, followed by npm install
   - ncu -g for global package checking
3. CLI Options & Parameters
   - --cache: Enables local caching (default file: ~/.ncu-cache.json, expiration: 10 minutes)
   - --concurrency <n>: Sets maximum concurrent HTTP requests (default 8)
   - --configFileName and --configFilePath: Specify custom config file names and directories
   - --cwd <path>: Working directory specification
   - --dep: Limit checks to dependency sections (default [prod, dev, optional, packageManager])
   - --deprecated: Boolean flag (default true)
   - --doctor: Iterative upgrade mode with testing (requires -u)
   - --doctorInstall and --doctorTest: Custom commands for install and test scripts
   - --filter and --reject: Filter package names using strings/wildcards/regex or custom functions
   - --format: Modify output formatting; options include group, ownerChanged, repo, time, lines, installedVersion
   - --install: Auto-install behavior (always, never, prompt; default prompt)
   - -p, --packageManager: Specify npm, yarn, pnpm, bun, etc. (default npm)
   - --peer: Evaluate and enforce peer dependency constraints
   - --pre: Include prerelease versions (default 0)
   - -r, --registry and --registryType: Choose registry source, type (npm or json)
   - --removeRange: Removes version ranges from output versions
   - --retry <n>: Retry count for package info requests (default 3)
   - -s, --silent: Suppress output
   - -t, --target: Set upgrade target; accepts latest, newest, greatest, minor, patch, semver, @[tag] (default latest)
   - --timeout <ms>: Global timeout settings (default no global timeout, 30 sec per registry fetch)
   - -u, --upgrade: Overwrite package.json with new versions
   - --verbose: Enable verbose logging
   - Workspace options: -w, --workspace and -ws, --workspaces
4. Advanced Filtering & Functions
   - filter: Function (name, semver) => boolean
   - filterResults: Function (packageName, { current, currentVersionSemver, upgraded, upgradedVersionSemver }) => boolean
   - filterVersion: Same usage as filter for version pattern matching
   - groupFunction: Function (name, defaultGroup, currentSpec, upgradedSpec, upgradedVersion) => group name
5. Config File (.ncurc) Formats
   - JSON example: { 'upgrade': true, 'filter': 'svelte', 'reject': ['@types/estree', 'ts-node'] }
   - JS config for advanced functions
6. Module Usage & API
   - Import using: import ncu from 'npm-check-updates'
   - Run method: ncu.run({ packageFile, upgrade, jsonUpgraded, silent }) returns upgraded versions
7. Doctor Mode & Troubleshooting
   - Command: ncu --doctor -u
   - Process: Pre-test with npm install, npm test; optimistic upgrade via ncu -u; iterative testing; revert on failure; log details of broken updates.

Each section includes the exact commands, parameters, defaults, and usage patterns that can be directly applied in development environments.

## Original Source
npm-check-updates Documentation
https://www.npmjs.com/package/npm-check-updates

## Digest of NPM_CHECKUPDATES

# NPM-CHECK-UPDATES

Retrieved on: 2023-10-XX

This document contains the full technical details of npm-check-updates, including installation steps, usage examples, CLI options with parameters, advanced filtering mechanisms, configuration file formats, and module usage. It includes complete API function signatures, method specifications and concrete code examples for integration and troubleshooting.

## Installation

- Global installation: npm install -g npm-check-updates
- Execution via npx: npx npm-check-updates

## Usage

- Basic dependency check: 
  Command: ncu
  Output sample:
    eslint 7.32.0 -> 8.0.0
    prettier ^2.7.1 -> ^3.0.0
- Upgrade package.json: 
  Command: ncu -u
  Then run: npm install
- Global package check: 
  Command: ncu -g
- Interactive mode: 
  Command: ncu --interactive (alias: ncu -i)

## CLI Options & Configuration

Key options include:
- --cache, --cacheFile, --cacheExpiration: Cache versions locally (default cache file: ~/.ncu-cache.json, expiration: 10 minutes).
- --concurrency <n>: Maximum concurrent HTTP requests (default: 8).
- --configFileName, --configFilePath: Specify configuration file options (.ncurc.{json,yml,js,cjs}).
- --cwd <path>: Specify working directory.
- --dep <value>: Specify dependency sections such as prod, dev, optional, peer, packageManager (default: ["prod","dev","optional","packageManager"]).
- --deprecated: Include deprecated packages (default: true).
- -d, --doctor: Enable iterative upgrade & testing mode. Requires -u.
- --doctorInstall <command>: Custom install script (default: npm install).
- --doctorTest <command>: Custom test script (default: npm test).
- --filter and --reject: Filter specific packages using string, wildcard, glob, regex or a predicate function.
- --filterResults and --filterVersion: Further filtering after version fetch with predicate functions.
- --format <value>: Formatting modifiers including group, ownerChanged, repo, time, lines, and installedVersion.
- -g, --global: Check global packages.
- --install <value>: Auto-install behavior, accepting always, never, prompt (default: prompt).
- -p, --packageManager: Specify package manager (npm (default), yarn, pnpm, bun, etc.).
- --peer: Include peer dependency checks.
- --pre: Include pre-release versions (default: 0).
- -r, --registry and --registryType: Custom registry for fetching package versions. (--registryType default: npm, alternate: json with explicit registry json file URL or path.)
- --removeRange: Remove version ranges from final version.
- --retry <n>: Retry count for failed requests (default: 3).
- -s, --silent: Suppress output.
- -t, --target <value>: Determines upgrade target level (latest, newest, greatest, minor, patch, semver, @[tag]). (Default: latest)
- --timeout <ms>: Global timeout settings (default: 30 sec per npm-registry-fetch).
- -u, --upgrade: Overwrite package.json with upgraded versions.
- --verbose: Enable detailed logging (alias for --loglevel verbose).
- -w, --workspace and -ws, --workspaces: Workspace update options.

## Filtering Advanced Options

- filter: Function signature: filter(name, semver). Example:
  if (name.startsWith('@myorg/')) return false; else return true;

- filterResults: Function signature: filterResults(packageName, { current, currentVersionSemver, upgraded, upgradedVersionSemver }). Used to exclude upgrades such as major version bumps. Example: if (parseInt(currentVersionSemver[0]?.major, 10) >= parseInt(upgradedVersionSemver?.major, 10)) return true; else return false.

- filterVersion: Alias for filter option function. Example:
  if (name.startsWith('@myorg/') && parseInt(semver[0]?.major) > 5) return false; else return true;

- groupFunction: Custom grouping function provided to format output. Signature: groupFunction(name, defaultGroup, currentSpec, upgradedSpec, upgradedVersion). Example: if (name === 'typescript' && defaultGroup === 'minor') return 'major'.

## Config File (.ncurc)

Example (.ncurc.json):
{
  "upgrade": true,
  "filter": "svelte",
  "reject": ["@types/estree", "ts-node"]
}

Alternatively, use .ncurc.js to export functions for filter, filterVersion, etc.

## Module/Programmatic Usage

Importing npm-check-updates:
  import ncu from 'npm-check-updates'

Usage:
  const upgraded = await ncu.run({
    packageFile: '../package.json',
    upgrade: true,
    jsonUpgraded: true,
    silent: true
  })
  console.log(upgraded) // Outputs upgraded package versions

## Doctor Mode & Troubleshooting

- Doctor mode usage:
  Command: ncu --doctor -u
  Process: Runs npm install, npm test pre-upgrade, then ncu -u for optimistic upgrade, followed by iterative testing.
  If tests fail, it automatically reverts the package.json and lock file while logging broken upgrades.

- Filtering with regex/wildcards:
  Example: ncu react-* or ncu "/^react-.*$/"
  Reject example: ncu -x nodemon

- Registry options with JSON:
  Example command: ncu --registryType json --registry ./registry.json
  Expected registry.json content:
  { "prettier": "2.7.1", "typescript": "4.7.4" }


## Attribution
- Source: npm-check-updates Documentation
- URL: https://www.npmjs.com/package/npm-check-updates
- License: License if known: MIT
- Crawl Date: 2025-04-26T08:47:20.731Z
- Data Size: 2956807 bytes
- Links Found: 3722

## Retrieved
2025-04-26
