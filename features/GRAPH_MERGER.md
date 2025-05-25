# GRAPH_MERGER

## Overview
Implement a CLI subcommand merge that reads multiple JSON files containing graph data (nodes and edges) and produces a single consolidated knowledge graph output. This feature enables combining data from different crawler runs into one unified JSON graph suitable for downstream ingestion and analysis.

## CLI Usage
The main script should support the merge command with options:

- merge: activates the merge behavior
- --inputs: one or more JSON file paths containing nodes and edges arrays
- --output: optional path to write the merged JSON graph (default writes to stdout)

Example invocation:

npm run start merge --inputs data1.json data2.json --output combinedGraph.json

## Implementation
1. Detect the merge command in src/lib/main.js when args[0] is "merge".
2. Parse the --inputs option into an array of file paths and the --output option for an output file path.
3. For each input file:
   - Read the file using fs/promises
   - Parse the JSON and validate against the existing zod schema for nodes and edges arrays
   - Accumulate nodes and edges into in-memory collections
4. Deduplicate nodes by their unique identifier. Maintain a map of node ID to node data, preserving the first occurrence.
5. Combine edges, preserving all unique relationships. Optionally eliminate duplicate edge entries if source, target, and label match.
6. Produce a final JSON object with properties:
   - nodes: array of deduplicated nodes
   - edges: array of combined edges
7. Write the JSON stringified output to the specified file or stdout. Handle any read or parse errors gracefully with a nonzero exit code.

## Testing
Add unit tests in tests/unit/graphMerger.test.js to cover:

- Merging two or more JSON inputs with overlapping nodes and edges
- Ensuring duplicates are removed correctly
- Behavior when an input file is missing or contains invalid JSON
- Writing to stdout when no output file is specified
- Writing to a file when --output is provided