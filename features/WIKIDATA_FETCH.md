# Overview
Add a new CLI option --fetch-wikidata <term> to search for and retrieve basic entity information from Wikidata's API, including label, description, and aliases.

# CLI Usage
The main script accepts:
- --fetch-wikidata <term> : Searches Wikidata for the specified term in English and fetches the first matching entity's label, description, and aliases.

# Behavior
When invoked with --fetch-wikidata:
- Construct a request to https://www.wikidata.org/w/api.php?action=wbsearchentities&search=<encoded term>&language=en&format=json to search entities.
- If the search returns at least one result, take the id of the first entity.
- Construct a request to https://www.wikidata.org/wiki/Special:EntityData/<id>.json to fetch entity data.
- Parse the JSON to extract the English label, description, and aliases.
- Print the information to stdout in a readable format.
- Exit with code 0 on success.

# Error Handling
- If the search or fetch fails (network error or non-200 HTTP code), print an error message to stderr and exit with code 1.
- If no search results are found, print a notice that the term was not found and exit with code 1.

# Testing
Add unit tests that mock the global fetch function to simulate:
- A successful search response with at least one result and a successful entity data response.
- A successful search response with no results.
- A network error during the search.
- A non-200 HTTP code during entity data fetch.
Ensure main() handles each case as specified.

# Documentation
Update README.md to include the new CLI option --fetch-wikidata under 'Running the Demo' with example invocations.