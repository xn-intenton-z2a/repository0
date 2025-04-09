# STRING_UTILS

## Overview
This feature adds a suite of string manipulation utilities to the CLI tool. It allows users to perform common text operations such as reversing a string, changing case (to uppercase, lowercase, title case), counting characters (or words), and performing search and replace. In this update, the feature is extended to include sorting capabilities. The new sort sub-command enables users to organize a list of strings or numeric values in either ascending or descending order. When a numeric sort is requested, the tool converts tokens to numbers and sorts them numerically; otherwise, it resorts to lexicographical ordering. This enhancement further enriches the tool’s text processing abilities while maintaining a focus on streamlined, self-contained utilities.

## CLI Integration
- **Command Flag:** Use the global flag `--string` to invoke string utilities.
- **Sub-Commands:**
  - **reverse:** Reverses the given string input.
  - **uppercase:** Converts the input string to all uppercase letters.
  - **lowercase:** Converts the input string to all lowercase letters.
  - **capitalize:** Capitalizes the first letter of each word.
  - **count:** Returns the character count, or word count if an optional flag `--words` is provided.
  - **replace:** Performs a search and replace operation. Requires two additional parameters: the substring to find and the substring to replace with.
  - **sort:** **New!** Sorts a list of tokens (strings or numbers). 
    - **Usage Examples:**
      - Basic lexicographical sort: 
        `node src/lib/main.js --string sort "apple banana cherry"`
      - Using a custom delimiter (e.g., comma): 
        `node src/lib/main.js --string sort "apple,banana,cherry" --delimiter ","`
      - Numeric sort: 
        `node src/lib/main.js --string sort "10 5 20" --numeric`
      - Descending order (works with numeric or lexicographical sort): 
        `node src/lib/main.js --string sort "alpha beta gamma" --desc`

## Implementation Details
- **Input Parsing:**
  - The parser extracts the sub-command following `--string`.
  - For the new sort sub-command, the input string is split into tokens. A custom delimiter can be specified using the `--delimiter` flag; otherwise, the default splitting is done using whitespace.
  - An optional `--numeric` flag instructs the tool to convert tokens to numbers for numeric sorting. If any token fails numeric conversion when numeric sorting is specified, an informative error is returned.
  - The optional `--desc` flag reverses the sorted order to descending.

- **Operation Logic:**
  - For lexicographical sorting, tokens are compared as strings in a case-insensitive manner if required.
  - For numeric sorting, tokens are parsed into numbers and then sorted in numerical order.
  - After sorting, the tokens are reassembled into a string using the same delimiter.
  - The command respects the global output modes: in plain text mode, the sorted result is printed directly; in JSON mode, the result is output with metadata (timestamp, tool version, execution duration, and input echo).

- **Error Handling:**
  - If no valid tokens are provided, or if numeric conversion fails when the `--numeric` flag is active, the tool returns a clear error message.
  - Input validation ensures that any required parameters (especially for sub-commands like replace) are present.

## Testing & Documentation
- **Unit Tests:**
  - Tests should cover sorting of simple and complex strings, numeric tokens, mixed-case ordering, custom delimiters, and both ascending and descending order.
  - Edge cases, such as empty input or tokens with extra whitespace and punctuation, are tested.
- **Documentation:**
  - README and CLI usage guides will be updated to include examples for the new sort functionality.
  - Inline code comments in the CLI source file explain the logic for splitting, conversion, and ordering.

## Alignment with Repository Mission
By extending the STRING_UTILS feature to include sorting capabilities, the tool provides users with enhanced text processing utilities essential for data organization and analysis. This update supports streamlined automation and healthy collaboration by consolidating common text manipulation tasks, all implemented as a self-contained CLI module.