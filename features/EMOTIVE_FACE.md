# Description

The CLI now supports rendering facial expressions as ASCII art based on an emotion input.

# Goals

Provide a simple interface for AI to communicate emotion through ASCII faces.

# CLI Interface

The main script accepts an --emotion or -e option with values: happy, sad, angry, neutral.
Printing the corresponding ASCII face to stdout.
If no emotion provided, defaults to neutral.

# Implementation

Extend src/lib/main.js to parse arguments, map emotion to ASCII templates, and output the selected face.
Include a mapping object for emotion to ASCII strings. Keep code lightweight.

# Testing

Add unit tests in tests/unit/main.test.js that invoke main with various emotion flags and verify correct ASCII art output. Cover all supported emotions and default behavior.

# Documentation

Update README.md to show usage: npm run start -- --emotion happy
Include examples of output for each emotion.