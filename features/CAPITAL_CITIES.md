# Overview
This feature adds a new CLI command to fetch a list of countries and their capital cities from a public data source, transform the data into a simple OWL ontology, and output the ontology as JSON.

# CLI Usage
The main script now accepts the flag --capital-cities. When invoked:
  node src/lib/main.js --capital-cities
It will:
  1. Fetch country data from the Rest Countries API.
  2. Extract each country and its capital city.
  3. Build an OWL ontology JSON with classes Country and City, and an object property hasCapital linking Country to City.
  4. Print the ontology JSON to stdout or write to a file if --output <path> is provided.

# Implementation Details
- Extend main(args) in src/lib/main.js to parse --capital-cities and optional --output.
- Use global fetch to request https://restcountries.com/v3.1/all
- Map the JSON response into an OWL structure:
    {
      "ontology": {
        "classes": ["Country","City"],
        "objectProperties": [
          {"name":"hasCapital","domain":"Country","range":"City"}
        ],
        "individuals": [
          {"type":"Country","id":"<countryCode>"},
          {"type":"City","id":"<cityName>"},
          {"subject":"<countryCode>","predicate":"hasCapital","object":"<cityName>"}
        ]
      }
    }
- Support writing to file via fs when --output is specified.

# Testing
- Add unit tests in tests/unit/main.test.js that stub global fetch to return a sample list of countries.
- Verify that calling main(["--capital-cities"]) returns without error and logs a valid OWL JSON structure.
- Test that --output writes a file containing the expected JSON.

# Documentation
- Update README.md to document the --capital-cities option, usage examples, and sample output.
- Include a link to MISSION.md to reference the goal of generating OWL ontologies.