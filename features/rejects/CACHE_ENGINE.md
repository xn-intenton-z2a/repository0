# CACHE_ENGINE

## Overview
The CACHE_ENGINE feature introduces a lightweight caching solution to reduce redundant remote API calls and processing overhead. This update enhances the existing in-memory cache by adding an optional persistent caching mechanism using file-based storage. The persistent cache is designed to maintain cached data between application runs, thereby improving performance in CI/CD environments and during iterative development.

## Implementation Details
- **Core API Enhancements:**
  - Retain the existing in-memory cache operations: `set(key, value, ttl)`, `get(key)`, and `clear(key)`.
  - Introduce an optional file-based caching mechanism that writes cache entries to a JSON file on disk. This persistent cache is used as a fallback if the in-memory cache does not contain a valid entry.
  - Provide a unified interface so that the consumer can specify whether to use in-memory caching only or enable persistent caching with a CLI flag (e.g. `--persistent-cache`).

- **File-Based Caching:**
  - On setting a cache entry with persistent caching enabled, the key-value pair, along with its expiration timestamp, is written to a designated cache file (e.g. `cache.json`).
  - On retrieval, the module first checks the in-memory cache. If not found, it attempts to load the cache from file, validate the TTL, and then populate the in-memory cache if valid.
  - Implement automatic cleanup of expired entries in the persistent cache file during read/write operations.

- **CLI Integration:**
  - Add a new optional CLI flag `--persistent-cache` to activate persistent caching mode. When this flag is provided, cache operations will use both in-memory and file-based mechanisms.
  - Provide a `--clear-cache` flag that clears both in-memory and persistent cache files.

- **Error Handling & Testing:**
  - Implement robust error handling to ensure that any file-system errors in reading or writing to the persistent cache do not affect the main workflow. Fall back to the in-memory cache if file operations fail.
  - Write unit tests (e.g., in `tests/unit/cacheEngine.test.js`) to simulate cache hits, misses, TTL expiration, and error scenarios, ensuring both in-memory and persistent caching work as expected.

## Benefits
- **Performance Improvement:**
  - Reduces repetitive remote API calls by caching responses across application runs.
  - Enhances responsiveness in environments with frequent, similar requests (e.g., CI pipelines).

- **Cost Efficiency:**
  - Minimizes unnecessary external requests, potentially lowering associated costs and resource usage.

- **Flexibility & Maintainability:**
  - Offers a simple API that abstracts the caching mechanism, allowing users to opt for persistent caching without altering their application logic.
  - Keeps caching functionality isolated in a single module, simplifying future extensions and maintenance.

## Documentation & Usage Examples
- **Usage Examples:**
  ```bash
  # Run the application with persistent caching enabled
  node src/lib/main.js --persistent-cache

  # Clear both in-memory and persistent caches
  node src/lib/main.js --clear-cache
  ```

- **Documentation:**
  - Update the README and CONTRIBUTING files to include instructions on enabling persistent caching.
  - Detail the structure of the persistent cache file and the cleanup process for expired entries.
