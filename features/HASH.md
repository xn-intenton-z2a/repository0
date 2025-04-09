# HASH

## Overview
This feature introduces cryptographic hash generation utilities to the CLI tool. By leveraging Node’s built-in crypto module, HASH enables users to generate secure hash values for given input strings. Supported hashing algorithms include MD5, SHA1, and SHA256. This utility is designed as a lightweight, self-contained module, making it easy to integrate into automation scripts or use for quick data integrity checks.

## CLI Integration
- **Command Flag:** `--hash`
- **Sub-Commands/Options:**
  - **Algorithm Selection:** The user specifies the algorithm as the first argument (e.g., `md5`, `sha1`, or `sha256`).
  - **Input String:** Subsequent arguments are combined (or a single string is provided) to serve as the input for hashing.
  
- **Usage Examples:**
  - Generate MD5 hash: `node src/lib/main.js --hash md5 "Hello World"`
  - Generate SHA256 hash: `node src/lib/main.js --hash sha256 "Important data"`

## Implementation Details
- **Hash Computation:**
  - The feature utilizes Node’s `crypto` module to create hash digests. For example, using `crypto.createHash('sha256')` for SHA256.
  - Input string parsing ensures that even if multiple tokens are provided, they are concatenated appropriately into a single string for hashing.
  
- **Output Modes:**
  - In standard text mode, the resulting hash is printed as a plain text string.
  - In JSON mode (with `--json` or `--json-pretty`), the output will be a JSON object containing the command, algorithm, input echo, computed hash, and additional metadata (timestamp, version, execution duration).

- **Error Handling & Validation:**
  - The feature validates that the specified algorithm is one of the supported options. If an unsupported algorithm is provided, a clear error message is returned.
  - Input string is required; if absent, the tool prompts with a usage message.

## Testing & Documentation
- **Unit Tests:**
  - Tests will be added to verify that for a variety of input strings, the correct hash is produced using each supported algorithm.
  - Edge cases such as empty strings and very large inputs will be included.
- **Documentation:**
  - The README and CLI usage guides will be updated to include examples and explanations for the HASH feature.
  - Inline code comments will detail the integration of Node’s `crypto` module and the processing of input strings.

## Alignment with Repository Mission
The HASH feature enriches the repository’s suite of CLI utilities by providing a practical mechanism for data integrity checks and secure hash generation. It supports the mission of promoting healthy collaboration and streamlined automation by offering a self-contained, modular tool that can be easily integrated into various workflows without added complexity.
