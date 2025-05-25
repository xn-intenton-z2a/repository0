# Overview

Add a new option to merge multiple JSON-LD files into a unified JSON-LD array. This supports combining crawled results into a consolidated dataset for building the knowledge graph.

# CLI Interface

The main script accepts a flag `--merge` followed by two or more file paths. When provided, the tool reads each file, parses the content as JSON arrays, merges entries, removes duplicates based on @id, and prints the combined array to standard output.

# Implementation Details

1. Detect the `--merge` flag and collect subsequent file path arguments.
2. For each path use fs.promises.readFile to load file contents.
3. Parse the loaded text as JSON and validate it is an array.
4. Create a map keyed by entry[@id] or the JSON string if no id present.
5. Merge all arrays into the map and extract unique entries.
6. Print the final array as a compact JSON string. Exit code should be zero on success.
7. On errors such as missing files or invalid JSON emit an error message and exit code one.

# Testing

Extend unit tests to mock fs calls. Provide sample JSON files with overlapping entries. Verify that merging yields a combined array without duplicates and that error cases are handled gracefully.