# repository0

**owl-builder** is a JavaScript library and CLI tool designed to:
- Hold constants for the URLs of free open public data sources.
- Crawl these open public data sources via APIs or web crawling to capture data as JSON files.
- Transform JSON files and capture data into OWL ontologies.
- Read and write and OWL ontologies as JSON files.
- Provide examples tools for querying OWL ontologies stored as JSON via a CLI with an ESJ like syntax.
- Include CLI variations on this example: node src/lib/main.js --capital-cities (yielding OWL as JSON file showing capital cities).
- Showcase all the features of the library in the README.md file.

owl-builder is a CLI tool which will facilitate the creation of OWL ontologies from public data sources,
and to provide a set of tools for managing the OWL ontologies in a JSON format.

## Seed repository activity at 2025-05-26T23:54:40.337Z

When responding to a post on url https://github.com/xn-intenton-z2a/repository0/discussions/2245, the repository was seeded with mission:



and outcome "success"

LLM API Usage:

---


## Feature to Issue at 2025-05-26T23:57:32.921Z

Activity:

Generated issue 2288 for feature "capital-cities" with URL https://github.com/xn-intenton-z2a/repository0/issues/2288

title:

Implement `--capital-cities` CLI command to fetch countries and output OWL JSON

And description:

## Objective
Add a new CLI command `--capital-cities` to fetch a list of countries and their capital cities from the Rest Countries API, transform the results into an OWL ontology JSON, and either print it to stdout or write it to a file when `--output <path>` is provided.

## Changes to Make

1. **src/lib/main.js**
   - Extend `main(args)` to detect `--capital-cities` and optional `--output <path>` arguments.
   - Use global `fetch` to request data from `https://restcountries.com/v3.1/all`.
   - Map the response into an OWL ontology structure with:
     ```js
     {
       ontology: {
         classes: ['Country', 'City'],
         objectProperties: [
           { name: 'hasCapital', domain: 'Country', range: 'City' }
         ],
         individuals: [ /* Country & City individuals, then triples linking them */ ]
       }
     }
     ```
   - Serialize the ontology JSON and:
     - If `--output <path>` is passed, write the JSON to the given file using `fs.promises.writeFile()`.
     - Otherwise, print the JSON string to stdout.

2. **tests/unit/main.test.js**
   - Stub `global.fetch` to return a small array of sample countries, e.g.: 
     ```js
     [
       { cca3: 'USA', capital: ['Washington D.C.'] },
       { cca3: 'FRA', capital: ['Paris'] }
     ]
     ```
   - Test that `main(['--capital-cities'])` resolves and prints a valid OWL JSON (use `console.log` spy to capture output and `JSON.parse` to verify structure).
   - Stub `fs.promises.writeFile` to test that passing `['--capital-cities','--output','out.json']` writes the correct JSON string to `out.json`.

3. **README.md**
   - Add a new section under **CLI Usage** for the `--capital-cities` command:
     ```md
     ### Fetch Capital Cities as OWL JSON
     ```bash
     node src/lib/main.js --capital-cities [--output <path>]
     ```
     This will fetch all countries from the Rest Countries API, build an OWL ontology with classes `Country` and `City`, an object property `hasCapital`, and individuals for each country and its capital. If `--output` is provided, the result is written to the specified file, otherwise it is printed to stdout.
     ```json
     {
       "ontology": { ... }
     }
     ```
   - Reference the MISSION.md goal of generating OWL ontologies.

## Verification Steps

1. Run `npm test` to ensure all tests pass and the new tests cover both CLI-only and file-output flows.
2. Execute locally:
   - `node src/lib/main.js --capital-cities` and confirm a valid JSON string appears.
   - `node src/lib/main.js --capital-cities --output sample.json` and confirm `sample.json` is created with the correct content.

_No other files should be modified. This implements the core functionality of the CAPITAL_CITIES feature._

LLM API Usage:
```json
{"prompt_tokens":6679,"completion_tokens":1356,"total_tokens":8035,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":576,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---