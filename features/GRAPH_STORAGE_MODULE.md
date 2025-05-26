# Graph Storage Module

# Overview
Introduce a dedicated graph storage module in src/lib/graph.js to encapsulate persistence operations for the knowledge graph, separating file I/O from CLI logic.

# API
- async loadGraph(filePath?: string): Promise<any[]>
- saveGraph(records: any[], filePath?: string): void
- async appendRecord(record: any, filePath?: string): Promise<void>

# Behavior
- loadGraph: Read project-root graph.json, return parsed array or empty array if file is missing or contains invalid JSON.
- saveGraph: Serialize provided records array with 2-space indentation and write to graph.json.
- appendRecord: Invoke loadGraph, append the given record, then call saveGraph with the updated array.

# Implementation
- Create src/lib/graph.js exporting the three functions using ESM syntax.
- Use fileURLToPath and dirname to resolve default filePath to project root graph.json.
- Use fs.readFileSync, fs.writeFileSync, JSON.parse, and JSON.stringify.
- Ensure loadGraph catches and ignores read or parse errors, defaulting to an empty array.

# Integration
- In src/lib/main.js, replace inline --ingest fs logic with:
  import { appendRecord } from "./graph.js";
  await appendRecord(record);
  console.log(...);
  process.exit(0);

# Tests
- Add tests in tests/unit/graph.test.js mocking fs to verify:
  - loadGraph returns empty array on missing or invalid file, returns parsed array on valid JSON.
  - saveGraph writes correct JSON string with 2-space indentation to correct path.
  - appendRecord calls loadGraph and saveGraph with updated data.
- Update tests/unit/main.test.js to stub appendRecord, verify it is called with the normalized record, console.log output, and process.exit(0).
