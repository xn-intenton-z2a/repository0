# Mission

A JavaScript library and CLI that renders emotion as ASCII art faces. Supports a fixed set of emotions, each with a distinct facial expression.

## Required Capabilities

- Render a named emotion as a multi-line ASCII art face.
- List all supported emotion names.
- Support exactly these 6 emotions: `happy`, `sad`, `angry`, `surprised`, `neutral`, `confused`.

## Constraints

Each face must be:
- At least 5 lines tall and 9 characters wide
- Visually distinct from all other faces (different mouth, eyebrow, or eye patterns)
- Composed only of printable ASCII characters (no Unicode)

Unrecognised emotions must throw `TypeError`.

## CLI

When run as `node src/lib/main.js --emotion <name>`, print the face to stdout and exit with code 0. When run with `--list`, print all supported emotion names one per line. Print an error message and exit with code 1 for unrecognised emotions.

## Requirements

- Export all public API as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests verifying each emotion produces distinct output of the required dimensions.
- README with examples showing each face.

## Acceptance Criteria

- [ ] Listing emotions returns `["happy", "sad", "angry", "surprised", "neutral", "confused"]`
- [ ] Rendering `"happy"` produces a string of at least 5 lines and 9 characters wide
- [ ] Each of the 6 emotions produces visually distinct output (no two are identical)
- [ ] Rendering an unknown emotion throws `TypeError`
- [ ] CLI `--emotion happy` prints a face to stdout
- [ ] CLI `--list` prints all 6 emotion names
- [ ] All unit tests pass
- [ ] README shows all 6 faces
