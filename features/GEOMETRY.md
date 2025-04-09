# GEOMETRY

## Overview
This feature provides a suite of geometric calculations for common shapes. It enables users to compute areas, perimeters, and other basic properties for shapes such as circles, rectangles, triangles, and optionally extend to volumes for 3D shapes. The GEOMETRY module is designed to be a lightweight, self-contained CLI utility that complements the existing numerical and statistical operations by addressing geometric computations.

## CLI Integration
- **Command Flag:** Introduce a new global flag `--geometry` to route geometric calculations.
- **Sub-Commands:**
  - **circle:** Calculate the area and circumference of a circle given the radius.
    - Example: `node src/lib/main.js --geometry circle 5`
  - **rectangle:** Compute the area and perimeter of a rectangle given the width and height.
    - Example: `node src/lib/main.js --geometry rectangle 4 6`
  - **triangle:** Compute the area (using Heron’s formula) and perimeter of a triangle provided the lengths of its three sides.
    - Example: `node src/lib/main.js --geometry triangle 3 4 5`
  - **sphere:** Optionally, compute the volume and surface area of a sphere given the radius.
    - Example: `node src/lib/main.js --geometry sphere 5`

## Implementation Details
- **Input Parsing:**
  - The module will parse numeric arguments following the `--geometry` flag and determine which sub-command is requested.
  - Validate the required number of numeric parameters for each shape and ensure they are positive.

- **Operation Logic:**
  - **Circle:**
    - Area = π * radius²
    - Circumference = 2 * π * radius
  - **Rectangle:**
    - Area = width * height
    - Perimeter = 2 * (width + height)
  - **Triangle:**
    - Perimeter = sum of the three sides.
    - Area computed by Heron’s formula: Calculate semi-perimeter s = (a + b + c) / 2, then area = √[s(s-a)(s-b)(s-c)].
    - Validate triangle inequality for inputs.
  - **Sphere (Optional):**
    - Volume = (4/3) * π * radius³
    - Surface Area = 4 * π * radius²

- **Error Handling & Validation:**
  - Return clear error messages if inputs are missing, non-numeric, or violate geometric constraints (e.g., triangle inequality).
  - Integrate seamlessly with the tool's global JSON output mode and common output structure.

## Testing & Documentation
- **Unit Tests:**
  - Add tests for each sub-command to verify correct computations for valid inputs and appropriate error messages for invalid cases.
  - Tests should cover both plain text and JSON output modes (using global flags `--json` and `--json-pretty`).
- **Documentation:**
  - Update the README and CLI usage guides with examples and detailed explanations of each geometric calculation.
  - Include inline code documentation to explain formulas and input validation.

## Alignment with Repository Mission
The GEOMETRY feature extends the repository’s modular CLI tool by addressing a common need for geometric calculations. This addition supports the mission of promoting healthy collaboration and streamlined automation by providing users with an easily accessible, self-contained utility for solving everyday geometric problems without adding unnecessary complexity.