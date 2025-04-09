# OVERVIEW
This feature consolidates various conversion operations into a single, unified CLI command. It merges numeral conversion (between different bases), unit conversion (e.g. temperature and distance), and date conversion (date addition and difference) into one tool. This consolidation simplifies the command structure, reduces redundancy, and aligns with the repository’s mission of providing modular, self-contained automation utilities.

# CLI INTEGRATION
- **Unified Flag:** Introduce a single flag `--convert` to handle all conversion tasks.
- **Mode Selection:**
  - **Numeral Conversion Mode:** When provided with three parameters — a number (as a string), the source base, and the target base — the command validates bases (between 2 and 36) and converts the numeral using built-in JavaScript methods.
  - **Unit Conversion Mode:** When provided with four parameters — a conversion category (e.g. `temp` or `distance`), source unit, target unit, and numeric value — the utility applies the relevant formula (e.g. Celsius to Fahrenheit, meters to kilometers).
  - **Date Conversion Mode:** Supports two sub-modes:
    - **Date Difference:** When provided with two date strings, it calculates the number of days between the dates.
    - **Date Addition:** When provided with a date string and a numeric value, it adds (or subtracts) days to return a new date in ISO format.

# IMPLEMENTATION DETAILS
- **Input Parsing & Validation:** The command dynamically examines the number and type of parameters to select the appropriate conversion mode. It includes robust error handling, offering clear messages if inputs are missing or incorrectly formatted.
- **Output Formatting:** Consistent with global settings, the command outputs results in plain text or JSON (if --json or --json-pretty is active) and includes metadata such as timestamp and execution duration.
- **Testing & Documentation:** Unit tests cover all three modes to ensure accurate conversions and error messages. Documentation is updated with examples for numeral, unit, and date conversions.

# ALIGNMENT WITH REPOSITORY MISSION
By merging number, unit, and date conversion functionalities into the CONVERTER feature, the repository enhances usability and reduces complexity. This streamlined utility supports efficient automation workflows and reinforces the mission of healthy collaboration through a modular, single-source file CLI tool.