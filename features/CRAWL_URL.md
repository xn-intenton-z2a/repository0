# Overview

Add a new command-line option to fetch a target URL, extract embedded JSON-LD structured data, and output it as JSON to standard output. This capability is the first step towards assembling a knowledge graph by crawling public web sources and harvesting machine-readable metadata.

# CLI Interface

The main script accepts a new flag `--crawl` followed by a URL. When provided, the tool retrieves the page, scans for `<script type="application/ld+json">` blocks, parses each block as JSON, and prints an array of parsed objects. If no JSON-LD is found, it emits an empty array.

# Implementation Details

1. Recognize the `--crawl` flag and validate that a URL argument is present.
2. Use the global fetch API available in Node 20 to perform an HTTP GET request to the specified URL.
3. Parse the response body as text, locate all occurrences of `<script type="application/ld+json">` sections, and extract the inner JSON strings.
4. Safely parse each JSON string into an object, collecting them into an array.
5. Print the resulting array as a compact JSON string to the console and exit with code 0. Errors in fetching or parsing should be reported with an error message and exit code 1.

# Testing

Extend existing unit tests to simulate fetch calls by mocking the global fetch function. Provide sample HTML responses containing one or more JSON-LD blocks and verify that the module prints the correct JSON array and handles empty or invalid cases without throwing uncaught errors.