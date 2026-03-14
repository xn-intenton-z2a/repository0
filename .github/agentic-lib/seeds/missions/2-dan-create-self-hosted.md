# Mission

A JavaScript test framework that proves a code transformation system can manage its own source code — the software engineering equivalent of a compiler that compiles itself.

## Background

Self-hosting is the strongest proof of capability: if a system can maintain and recreate itself, it can maintain anything. This mission builds a test harness that validates self-hosting through four scenarios of increasing ambition.

## Required Capabilities

### Scenario 1: Clone Self

Copy the system's own source tree into a temporary workspace, write a narrowly-scoped improvement goal (e.g. "Add JSDoc to exported functions in safety.js"), run a transform cycle, and verify the system made a substantive change to its own code.

- Workspace: copy of source tree (excluding `.git/`, `node_modules/`, `models/`)
- Assertions: target file modified, still valid JavaScript, diff is substantive (not just whitespace)

### Scenario 2: Empty Bootstrap

Start from an empty repository, run an init/purge to create the seed state, write a goal describing the delta between version N and version N+1 (which already exists as a known target), run a transform, and verify convergence toward the known target.

- Workspace: empty, then init creates seed state
- Key insight: because the target already exists, convergence is objectively measurable
- Assertions: seed files created, features generated, source modified, valid JavaScript
- Soft assertion: convergence score — keywords from the N+1 delta found in generated code

### Scenario 3: Version Increment

Copy the source tree, write a goal to update the package version and synchronise seeds, run a transform, and verify the version was updated correctly.

- Assertions: `package.json` modified, still valid JSON
- Soft: version field matches target, seeds updated

### Scenario 4: Seed Sync

Copy the source tree, tamper with a seed file to introduce an outdated function, write a goal to review and fix seeds, run a transform, and verify the tampered file was corrected.

- Assertions: tampered file modified, still valid JavaScript
- Soft: modification moves toward correctness

## Infrastructure Required

- A source tree copy function that excludes `.git/`, `node_modules/`, and `models/` directories
- A diff quality checker that distinguishes substantive changes from whitespace-only edits
- A JSON validity checker for `package.json` verification
- A convergence scoring function (0.0–1.0) that measures how many target keywords appear in generated code

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- Each scenario must be independently runnable and independently pass/fail.
- Scenarios must work with a local LLM (no external API dependency required for mechanical validation).
- No external runtime dependencies beyond what the host system already provides.
- Comprehensive unit tests for each helper function and integration tests for each scenario.
- README documenting what self-hosting means, how to run each scenario, and how to interpret results.

## Acceptance Criteria

- [ ] Clone-self scenario: modifies a file in the source tree, output is valid JavaScript, diff is substantive
- [ ] Empty-bootstrap scenario: creates seed files, generates features, modifies source, output is valid JavaScript
- [ ] Version-increment scenario: modifies `package.json`, output is valid JSON
- [ ] Seed-sync scenario: corrects a tampered seed file, output is valid JavaScript
- [ ] Convergence score function returns 0.0–1.0 based on target keyword matching
- [ ] Source tree copy excludes `.git/`, `node_modules/`, and `models/`
- [ ] Each scenario is independently runnable
- [ ] All unit tests pass
- [ ] README documents self-hosting concept and scenario execution
