# WIKIPEDIA_SUMMARY

## Overview

Add a new CLI option `--fetch-wikipedia <term>` to fetch a summary of a topic from Wikipedia's REST API and display it as plain text. This brings the repository closer to its mission of building a knowledge graph by enabling data retrieval from a public source.

## CLI Usage

The main script accepts:

- `--fetch-wikipedia <term>` : Fetches the introduction summary of the specified Wikipedia article.

Supply the term as a single argument or a quoted string for multi-word titles.

## Behavior

When invoked with `--fetch-wikipedia`, the tool constructs a request to:

```
https://en.wikipedia.org/api/rest_v1/page/summary/<encoded term>
```

It retrieves the `extract` field from the JSON response and prints it to stdout. The process exits with code 0 on success.

## Error Handling

- If fetch fails (network error or non-200 HTTP code), an error message is printed to stderr and the process exits with code 1.
- If the page does not exist, the CLI prints:

  ```
  Article not found: <term>
  ```

  to stderr and exits with code 1.
- If the page is a disambiguation (`type` of `disambiguation`), a notice is printed to stderr and the process exits with code 1.

## Testing

Unit tests mock the global `fetch` function to simulate:

- A successful response with sample JSON containing an `extract` field.
- A 404 response representing a missing page.
- A network error.
- A disambiguation response.

Tests verify that `main()` handles each case according to the specification.
