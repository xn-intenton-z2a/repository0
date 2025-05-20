# ASCII Face Renderer

## Overview
Implement ASCII art facial expressions to depict emotions in the CLI app. Users pass an emotion keyword and see a corresponding ASCII face in the console output.

## CLI Interface
The app accepts an emotion argument either as a positional parameter or via a --emotion flag. Supported emotions are happy, sad, surprised, and angry. If no emotion or an unknown emotion is provided, display a neutral face.

## Source Modifications
Update src/lib/main.js to:
- Parse the emotion argument from process.argv or named flag.
- Define a mapping from emotion keywords to ASCII art faces.
- Print the selected ASCII face to the console.

## Tests
Extend tests/unit/main.test.js to:
- Call main with each supported emotion and verify the console output contains the correct ASCII art.
- Call main without arguments and with an unsupported emotion and verify the fallback neutral face is printed.

## Documentation
Update README.md to include:
- Description of the --emotion option and positional usage.
- List of supported emotions and their ASCII art representations.
- Examples of running the CLI with different emotions.
