# Mission Statement

`repository0` is a repository template that showcases the GitHub workflows imported from intentïon `agentic‑lib`. Its
primary purpose is to demonstrate these automated CI/CD workflows and provide a basis for further development.
We add features to showcase what we can confidently do with completion calls to an LLM with a 200,000 token limit used
to create and update directory of JS source and test files. The files in `sandbox/` are maintained by the repository's 
workflows and run using the same test suite as the main source file.

We showcase what you can by generating a new feature showing it at work as the output of `npm run start` and with 
feature level tests showing primary flows as well as classic unit tests. 

The mission of the contributors, human or automated, is to show case the workflow capabilities of the repository.
2025-05-19T15:36:22Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-19T15-08Z

# Activity Log

## Discussions activity at 2025-05-19T15:36:28.853Z

Hello @Antony-at-Polycode 👋

I’m seeding the repository now to establish the initial structure and align with our mission. The mission detail remains blank as requested. You’ll see the seed branch created and a trace of this discussion recorded. Let me know once you’re ready to proceed with opening pull requests for sandbox features or any further steps!

[Posted on "https://github.com/xn-intenton-z2a/repository0/discussions/1862#discussioncomment-13195505" by the repository bot which took the action "seed-repository" with the detail "".]

LLM API Usage:

```json
{"prompt_tokens":55137,"completion_tokens":101,"total_tokens":55238,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":0,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}

```
---

2025-05-19T15:37:45Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-19T15-08Z

## Maintain Feature at 2025-05-19T15:37:59.968Z

Maintained feature COMMAND_PARSER.

Git diff:

```
```

LLM API Usage:

```json
{"prompt_tokens":6139,"completion_tokens":1366,"total_tokens":7505,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

## Maintain Feature at 2025-05-19T15:58:00.485Z

Maintained feature EQUATION_PLOTTER.

Git diff:

```

```

LLM API Usage:

```json
{"prompt_tokens":6435,"completion_tokens":1324,"total_tokens":7759,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

2025-05-19T16:00:45Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-19T15-08Z

2025-05-19T16:37:51Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/repository0/tree/intention-2025-05-19T15-08Z

## Feature to Issue at 2025-05-19T16:43:18.931Z

Generated feature development issue with title Add 'house-choice' CLI command to randomly select from predefined houses.

LLM API Usage:

```json
{"prompt_tokens":7841,"completion_tokens":2633,"total_tokens":10474,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":2048,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Ready Issue at 2025-05-19T16:45:07.165Z

Enhanced issue https://github.com/xn-intenton-z2a/repository0/issues/2132 with action close and updated description:

This issue adds a new CLI command `house-choice` to enable users to randomly select from a set of predefined houses. It will demonstrate adding a non-trivial command, helper logic, and end-to-end tests. The LLM should update the following files in one pass to fully realize the feature:

1. **src/lib/main.js**
   - Implement a `chooseHouse(houses, seed)` helper function that returns a random house, using an optional `seed` to produce deterministic results when provided.
   - Extend the existing switch statement to recognize the `house-choice` command and support the following flags parsed via `minimist`:
     - `--list`: Print the full list of available houses instead of selecting one.
     - `--seed <number>`: Use the provided numeric seed to initialize a pseudorandom generator for reproducible choices.
   - Default behavior when no flags are provided: pick and print one random house to the console.

2. **tests/unit/main.test.js**
   - Add unit tests for `chooseHouse`: verify that it only returns values from the default house array (e.g., ["Gryffindor","Hufflepuff","Ravenclaw","Slytherin"]) and that a fixed `seed` yields a deterministic output.
   - Add integration tests for `main()`:
     - Invoking `main(["house-choice"])` logs a single valid house.
     - Invoking `main(["house-choice","--list"])` logs the complete list of houses.
     - Invoking `main(["house-choice","--seed","42"])` logs the same house on repeated runs.

3. **README.md**
   - Document the new `house-choice` command under the **Commands** section with usage examples:
     ```bash
     npm run start -- house-choice
     npm run start -- house-choice --list
     npm run start -- house-choice --seed 123
     ```
   - Briefly explain flags and expected output.

4. **package.json** (dependencies file)
   - No new dependencies are required; confirm existing `minimist` is sufficient.

**Verification steps:**
- Run `npm test` to ensure unit and integration tests pass.
- Run `npm run start -- house-choice` and `npm run start -- house-choice --list` to manually verify console output.

No new files should be created or deleted. This change focuses purely on source, tests, README, and confirming no dependency adjustments are necessary.

LLM API Usage:

```json
{"prompt_tokens":8674,"completion_tokens":1640,"total_tokens":10314,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-19T16:48:03.085Z

fixApplied: true

Add house-choice CLI command with helper and tests update documentation

Git Diff:

```diff --git a/sandbox/source/main.js b/sandbox/source/main.js
index bef8f2fa..072a2d3b 100644
--- a/sandbox/source/main.js
+++ b/sandbox/source/main.js
@@ -4,8 +4,41 @@ import { readFile } from 'fs/promises';
 import { fileURLToPath } from 'url';
 import path from 'path';
 
-async function main() {
-  const argv = minimist(process.argv.slice(2));
+/**
+ * Choose a random house, optionally using a seed for deterministic output.
+ * @param {string[]} houses - Array of house names
+ * @param {number} [seed] - Optional numeric seed for reproducibility
+ * @returns {string} - Selected house
+ */
+function chooseHouse(houses, seed) {
+  if (!Array.isArray(houses) || houses.length === 0) {
+    throw new Error('Houses must be a non-empty array');
+  }
+  let random = Math.random;
+  if (seed !== undefined) {
+    const m = 0x80000000; // 2^31
+    const a = 1103515245;
+    const c = 12345;
+    let state = seed % m;
+    random = function () {
+      state = (a * state + c) % m;
+      return state / m;
+    };
+  }
+  const index = Math.floor(random() * houses.length);
+  return houses[index];
+}
+
+/**
+ * Main entrypoint for CLI commands.
+ * Accepts an optional array of args for testing.
+ * @param {string[]} [inputArgs] - Arguments to parse (default: process.argv.slice(2))
+ */
+async function main(inputArgs) {
+  const argv = minimist(
+    inputArgs !== undefined ? inputArgs : process.argv.slice(2),
+    { boolean: ['list'], alias: { l: 'list' } }
+  );
   const [command, ...args] = argv._;
 
   switch (command) {
@@ -22,6 +55,22 @@ async function main() {
     case 'echo':
       printEcho(args);
       break;
+    case 'house-choice': {
+      const houses = [
+        'Gryffindor',
+        'Hufflepuff',
+        'Ravenclaw',
+        'Slytherin',
+      ];
+      if (argv.list) {
+        console.log(houses.join('\n'));
+      } else {
+        const seed = argv.seed !== undefined ? Number(argv.seed) : undefined;
+        const chosen = chooseHouse(houses, seed);
+        console.log(chosen);
+      }
+      break;
+    }
     default:
       console.log(`Unknown command: ${command}`);
       printHelp();
@@ -29,16 +78,23 @@ async function main() {
   }
 }
 
+/**
+ * Print help text for available commands.
+ */
 function printHelp() {
   const scriptName = path.basename(process.argv[1]);
   console.log(`Usage: ${scriptName} <command> [arguments]`);
   console.log(`Commands:`);
-  console.log(`  help     Show this help message`);
-  console.log(`  mission  Print the mission statement`);
-  console.log(`  version  Print the version from package.json`);
-  console.log(`  echo     Echo the provided arguments`);
+  console.log(`  help         Show this help message`);
+  console.log(`  mission      Print the mission statement`);
+  console.log(`  version      Print the version from package.json`);
+  console.log(`  echo         Echo the provided arguments`);
+  console.log(`  house-choice Randomly choose a house or list all houses`);
 }
 
+/**
+ * Read and print the mission statement.
+ */
 async function printMission() {
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
@@ -52,6 +108,9 @@ async function printMission() {
   }
 }
 
+/**
+ * Read and print the package version.
+ */
 async function printVersion() {
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
@@ -66,14 +125,20 @@ async function printVersion() {
   }
 }
 
+/**
+ * Echo provided arguments.
+ * @param {string[]} args
+ */
 function printEcho(args) {
   console.log(args.join(' '));
 }
 
 // If run directly, execute main
 if (path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
-  main().catch(err => {
+  main().catch((err) => {
     console.error(err);
     process.exit(1);
   });
 }
+
+export { main, chooseHouse };
\ No newline at end of file```

mainOutput:```
> @xn-intenton-z2a/repository0@2.1.0-0 start
> node src/lib/main.js

Run with: []```

[for issue https://github.com/xn-intenton-z2a/repository0/issues/2132 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":10504,"completion_tokens":7953,"total_tokens":18457,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":5760,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

