# GEOMETRY

## Overview
The GEOMETRY feature provides a suite of geometric calculations for common shapes. In addition to computing areas, perimeters, and other basic properties for circles, rectangles, triangles, and spheres, this updated module introduces support for regular polygons. Users can now compute the area and perimeter of a regular polygon given the number of sides and the side length.

## CLI Integration
- **Global Flag:** `--geometry`
- **Sub-Commands:**
  - **circle:** Calculate area (π * r²) and circumference (2 * π * r) for a circle. Example: `node src/lib/main.js --geometry circle 5`
  - **rectangle:** Compute area (width * height) and perimeter (2 * (width + height)). Example: `node src/lib/main.js --geometry rectangle 4 6`
  - **triangle:** Calculate area using Heron’s formula and perimeter given three side lengths. Example: `node src/lib/main.js --geometry triangle 3 4 5`
  - **sphere:** Optionally, compute volume ((4/3) * π * r³) and surface area (4 * π * r²) for a sphere. Example: `node src/lib/main.js --geometry sphere 5`
  - **polygon:** **New!** Compute the area and perimeter of a regular polygon using the formula:
    - **Area:** (n * s²) / (4 * tan(π/n))
    - **Perimeter:** n * s

    Example: `node src/lib/main.js --geometry polygon 6 3` calculates the area and perimeter for a regular hexagon with side length 3.

## Implementation Details
- **Input Parsing:** The module will parse numeric inputs following the `--geometry` flag and determine which sub-command is requested. For the new polygon sub-command, exactly two numbers are required: the number of sides (an integer greater than 2) and the side length (a positive number).
- **Operation Logic:**
  - **Polygon Calculation:** The program validates that the number of sides is at least 3. It then calculates the area using the formula: Area = (n * s²) / (4 * tan(π/n)), and the perimeter as: Perimeter = n * s.
  - Existing geometric commands continue to operate as previously defined.

## Testing & Documentation
- **Unit Tests:** New tests will be added to verify correct computations of the area and perimeter for various regular polygons, including edge cases (e.g., minimum valid number of sides, typical side lengths).
- **Documentation:** The README, CLI usage guides, and inline code comments will be updated to include examples and detailed explanations for the new polygon sub-command.

## Alignment with Repository Mission
By extending the GEOMETRY feature to include regular polygon calculations, this update broadens the mathematical capabilities of the CLI tool while staying true to the repository's mission of promoting streamlined automation and healthy collaboration with self-contained, modular utilities. The new sub-command enhances value without adding excessive complexity.