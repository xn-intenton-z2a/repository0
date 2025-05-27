# `repository0`

The repository is intended as a template that includes:
* A Template Base: A starting point for new projects.
* A Running Experiment: An example implementation that demonstrates one way to use the template.
* Workflows from `agentic-lib` which reference reusable workflows.

## Overview
`repository0` is a demo repository that showcases the GitHub workflows imported from intentïon `agentic-lib`. Its primary purpose is to demonstrate these automated CI/CD workflows.

## What’s Inside

- **GitHub Workflows:**  
  Workflows in the `.github/workflows/` These workflows consume reusable workflows from intentïon `agentic-lib`.

- **Source Code:**  
  The main functionality is in `src/lib/main.js`. This file is focus of the workflow and is modified by the workflow to deliver the project goals.

- **Dependencies:**  
  `package.json` can be modified by the workflow to add or update dependencies and it also defines some of the test and build scripts.

- **Tests:**  
  Unit tests in the `tests/unit/` folder ensure that the main script doesn't drift too far.  This test file can be modified by the workflow `tests/unit/main.test.js`, duplicate `main.test.js` to fix a version of the behaviour where the workflow can't change it.

- **Docs**  
  This `README.md` can be modified by the workflow.

## Getting Started

This repository is already set up with the necessary workflows and scripts but you do need to supply the following secrets:
- `CHATGPT_API_SECRET_KEY` - This key must be for an account with access to the OpenAI chat completions API for model `o3-mini`.
  Set these secrets in your repository settings under *Settings > Secrets and Variables > Actions*. They are essential for the automated workflows such as publishing packages and managing issues.

## CLI Usage

### Fetch Capital Cities as OWL JSON

```bash
node src/lib/main.js --capital-cities [--output <path>]
```

This command fetches all countries from the Rest Countries API, builds an OWL ontology with classes `Country` and `City`, an object property `hasCapital`, and individuals for each country and its capital. If `--output <path>` is provided, the ontology JSON is written to the specified file; otherwise, it is printed to stdout.

Sample output:

```json
{
  "ontology": {
    "classes": ["Country", "City"],
    "objectProperties": [
      {
        "name": "hasCapital",
        "domain": "Country",
        "range": "City"
      }
    ],
    "individuals": [
      {
        "type": "Country",
        "id": "<countryCode>"
      },
      {
        "type": "City",
        "id": "<cityName>"
      },
      {
        "subject": "<countryCode>",
        "predicate": "hasCapital",
        "object": "<cityName>"
      }
      // ...
    ]
  }
}
```

For more details, see [MISSION.md](MISSION.md).

### Query a Country’s Capital from OWL JSON

```bash
node src/lib/main.js --find-capital-of <countryCode> [--input <ontology.json>] [--output <path>]
```

This command supports two modes:

1. **Online Mode** (no `--input` flag):
   - Fetches all countries from the Rest Countries API, builds an OWL ontology, and extracts the capital city for the specified country code.

2. **Offline Mode** (`--input <ontology.json>`):
   - Reads and parses the provided OWL JSON ontology file instead of fetching data.

If `--output <path>` is provided, writes a JSON object with `country` and `capital` to the specified file; otherwise, prints the capital name (or array of capitals) to stdout.

Error handling:
- If the input file cannot be read or parsed, prints an error and exits with a non-zero status: `Error: Failed to read or parse input file <path>`.
- If the ontology format is invalid, prints: `Error: Invalid ontology format in <path>`.
- If the country code is not found, prints:
  - Online: `Error: Country code <code> not found.`
  - Offline: `Error: Country code <code> not found in input ontology.`

Examples:

```bash
node src/lib/main.js --find-capital-of USA
# prints Washington D.C.

node src/lib/main.js --find-capital-of FRA --output capital.json
# writes {"country":"FRA","capital":"Paris"} to capital.json

node src/lib/main.js --find-capital-of USA --input ontology.json
# prints Washington D.C.

node src/lib/main.js --find-capital-of USA --input ontology.json --output out.json
# writes {"country":"USA","capital":"Washington D.C."} to out.json
```

## intentïon `agentic-lib`

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your repository to operate in an “agentic” manner. Autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK. This project itself is evolving, and these workflows may eventually become bundled actions.

*Warning:* Executing these workflows may incur charges on your OpenAI account and consume GitHub Actions minutes.

*Warning:* Experimental. This coding system is still in development and may not suit production use.

... (rest of README remains unchanged) ...