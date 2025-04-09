# MEMOIZATION

## Overview
The MEMOIZATION feature has been enhanced to not only provide in-memory caching for expensive computations (e.g., factorials, Fibonacci numbers, matrix operations) within a single CLI session, but also to support persistent caching across sessions. With this enhancement, users can optionally store cache results on disk, allowing repeated invocations over different sessions to retrieve previously computed values, significantly improving performance.

## CLI Integration
- **Global Flag:** `--cache` continues to enable caching.
- **Sub-Commands & Options:**
  - **--cache-show:** Displays all currently cached entries from both the in-memory and persistent store.
  - **--cache-clear:** Clears both the in-memory and the persistent cache (i.e., deletes the stored cache file).
  - **New Flag:** `--cache-persist` when provided along with `--cache` activates the persistent caching mode. When enabled, the cache is automatically saved to a designated file (e.g., `cache.json`) in the repository root at the end of a session, and loaded at startup if available.

## Implementation Details
- **Cache Storage:**
  - **In-Memory Cache:** Continues to use a JavaScript object to store computation results during a session.
  - **Persistent Cache:** Utilizes Node’s `fs` module to write and read a JSON file (`cache.json`) that holds cached results. On tool startup, if persistent caching is enabled and the file exists, its contents are merged with the in-memory cache.
- **Operation Logic:**
  - When a command is executed with caching enabled, the tool first checks the in-memory cache for a matching key (a normalized representation of the command and its arguments).
  - If not found in memory, and if persistent caching is active, the tool loads the cache from disk to check for a stored result.
  - After computing a new result, the result is stored in both caches (in-memory and updated in the persistent file asynchronously). 
- **Error Handling:**
  - Robust error handling is implemented to manage potential file I/O errors during read/write operations. If a persistent cache file cannot be read or written, the tool falls back to in-memory caching and logs a warning.

## Testing & Documentation
- **Unit Tests:** Tests will be added to verify:
  - Retrieval of cached results from both the in-memory and persistent layers.
  - Proper saving of cache results to disk when `--cache-persist` is enabled.
  - Correct behavior of the `--cache-show` and `--cache-clear` commands.
  - Graceful handling of file I/O errors.
- **Documentation:**
  - Update the README and CLI usage guides to include examples on how to use the persistent caching functionality, along with instructions on clearing the persistent cache.
  - Inline comments in the source code will document the persistent caching logic and file I/O operations.

## Alignment with Repository Mission
By extending MEMOIZATION to support persistent caching, this enhancement further streamlines automation by reducing redundant computations across sessions. This improvement leads to a more responsive CLI tool and aligns with the repository’s mission of promoting healthy collaboration through efficient and self-contained utilities.