# Mission

A JavaScript library that computes structured diffs between two JSON Schema (Draft-07) documents, helping API developers track and validate schema changes across versions.

## Required Capabilities

- Compare two JSON Schema objects and return an array of change records.
- Render changes as human-readable text or JSON.
- Classify each change as `"breaking"`, `"compatible"`, or `"informational"`.

## Change Record Format

Each change is a plain object with these fields:

```js
{ path: "/properties/email", changeType: "type-changed", before: "string", after: "number" }
```

Supported `changeType` values:

- `property-added` / `property-removed`
- `type-changed`
- `required-added` / `required-removed`
- `enum-value-added` / `enum-value-removed`
- `description-changed`
- `nested-changed` (recursive diff of sub-schemas)

## Requirements

- Resolve local `$ref` pointers (JSON Pointer within the same document) before diffing. Remote `$ref` is out of scope — throw if encountered.
- Traverse `properties`, `items`, `allOf`, `oneOf`, `anyOf` recursively.
- Export all public API as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests covering each change type, nested schemas, and `$ref` resolution.
- README with usage examples showing a before/after schema pair.

## Acceptance Criteria

- [ ] Diffing two schemas returns an array of change objects
- [ ] Detects added and removed properties
- [ ] Detects type changes (e.g. `"string"` → `"number"`)
- [ ] Detects `required` array changes
- [ ] Handles nested schemas recursively (properties within properties)
- [ ] Resolves local `$ref` before diffing
- [ ] Classifying a removed required property returns `"breaking"`
- [ ] Formatting changes produces readable text output
- [ ] All unit tests pass
- [ ] README documents usage with examples
