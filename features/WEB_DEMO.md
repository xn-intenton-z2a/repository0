# WEB_DEMO

## Summary

Provide a small interactive web demo page under src/web/ that demonstrates both hammingDistance and hammingDistanceBits. The demo is an educational playground that helps users understand Unicode code point comparison and bitwise distances.

## Motivation

A visual, interactive example on the repository website makes the library approachable and validates web usage. It doubles as a behaviour-level test target for repository CI and a manual demo for contributors.

## Scope

Add or update a single page in src/web/ (index.html or index.js) and small supporting code to demonstrate the library. Changes are limited to:
- src/web/: add a minimal interactive widget that uses the exported functions from src/lib/main.js
- README.md: add a short note with a link to start the demo (npm run start) and how to interact with it
- tests/behaviour/: optionally add a simple behaviour test that loads the built docs and asserts UI elements exist (not required to ship with this feature spec)

## Behaviour specification

- The demo page shows two tabs or controls: String mode and Bits mode
- String mode: two text inputs for the two strings; a Compute button shows the Hamming distance computed using Unicode code points (display result and a brief note about code point counting)
- Bits mode: two numeric inputs for non-negative integers; a Compute button shows the bitwise Hamming distance and binary representations of inputs for clarity
- The demo must handle astral emoji correctly (each astral code point displays and counts as a single position) and show a short explanatory line about combining marks vs grapheme clusters
- No external dependencies; rely on the library export and plain DOM scripting so the page copies into docs/ when npm run build:web executes

## Testing and acceptance criteria

- Visiting the demo and entering karolin and kathrin in String mode shows a result of 3
- Entering an emoji pair 😃 and 😄 shows result 1 and demonstrates astral handling
- Entering bits 1 and 4 shows result 2 and displays inputs in binary
- The demo must be preserved when build:web copies src/web into docs/

## Deliverables

- features/WEB_DEMO.md (this file)
- Guidance for an interactive demo in src/web/ with minimal DOM code that calls the library exports

## Notes

Keep UI minimal and accessible; the demo is educational rather than production-grade. Avoid heavy frameworks so the demo remains small and easy to test.