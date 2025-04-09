# NUMERIC

## Overview

This feature consolidates various arithmetic, statistical, combinatorial, and complex number operations into a unified numerical utilities module within the CLI tool. In addition to the original capabilities such as basic arithmetic (addition, subtraction, multiplication, division, modulo), advanced statistics (median, mode, standard deviation, percentile, geometric mean, variance, Fibonacci, GCD, LCM, and prime detection), complex number arithmetic, and basic calculus operations (numerical differentiation and integration), this update extends the module to include **financial calculations**. This integration enriches the module with practical tools for computing simple and compound interest as well as EMI (Equated Monthly Installments) for loan evaluations.

## CLI Integration

In addition to the existing commands, three new sub-commands are introduced:

- **Simple Interest (`--simple-interest`):**
  - **Usage:** `node src/lib/main.js --simple-interest <principal> <rate> <time>`
  - **Description:** Calculates the simple interest using the formula: _SI = (principal × rate × time) / 100_.

- **Compound Interest (`--compound-interest`):**
  - **Usage:** `node src/lib/main.js --compound-interest <principal> <rate> <time>`
  - **Description:** Computes the compound interest where the total amount is calculated as _Amount = principal * (1 + rate/100)^time_ and then the compound interest is _Amount - principal_.

- **EMI Calculator (`--emi`):**
  - **Usage:** `node src/lib/main.js --emi <principal> <annual_rate> <tenure_in_months>`
  - **Description:** Estimates the monthly installment using the formula: _EMI = [principal * monthlyRate * (1+monthlyRate)^n] / [(1+monthlyRate)^n - 1]_, where _monthlyRate = annual_rate / (12*100)_ and _n_ is the number of months.

## Implementation Details

- **Financial Computations:**
  - These calculations are implemented as additional command branches within the NUMERIC module. They perform input validation, ensuring that the provided parameters are numeric and positive where required.
  - The functions will provide clear error messages if inputs are missing or invalid.

- **CLI Output Modes:**
  - As with all commands, these new financial functions support both plain text and JSON output modes. In JSON mode (activated via the `--json` or `--json-pretty` flags), responses include metadata such as timestamp, version, execution duration, and input echo.

- **Error Handling & Testing:**
  - Each new command includes unit tests for both typical and edge-case scenarios to ensure reliable operation. The documentation and README will be updated to include usage examples.

## Alignment with Repository Mission

By updating the NUMERIC module to include financial calculations, this enhancement provides users with practical tools for common financial computations. This practical addition supports the repository’s mission of promoting streamlined automation and healthy collaboration through a self-contained, modular CLI utility that addresses a broader range of everyday computational needs.