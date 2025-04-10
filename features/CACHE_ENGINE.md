# CACHE_ENGINE

## Overview
This feature introduces a lightweight caching engine to improve performance by reducing redundant remote API calls and processing overhead. The cache engine is designed as a single module that can be integrated with various repository functionalities (such as TEMPLATE_MANAGER, RELEASE_MANAGER, and WORKFLOW_MANAGER) that perform remote data fetching. It provides an in-memory cache with configurable time-to-live (TTL) support, and can be extended to support file-based caching if needed.

## Implementation Details
- **Single Source File:**
  - Implement the caching logic in a single module (e.g., `src/lib/cacheEngine.js`) to keep the feature self-contained and maintainable.

- **Core API:**
  - Provide basic operations such as `set(key, value, ttl)`, `get(key)`, and `clear(key)`.
  - Support automatic expiration of cached entries based on the TTL specified when adding an entry.
  - Optionally expose a CLI flag (`--clear-cache`) that allows users to invalidate the entire cache from the command line.

- **Integration Points:**
  - Design the cache engine to be easily integrated with existing modules that perform remote calls (for example, fetching remote templates or querying GitHub APIs).
  - Ensure that the cache does not interfere with the primary functionality if an entry is missing (i.e., fallback to a fresh remote request).

- **Error Handling & Testing:**
  - Implement robust error handling to catch and log any cache-related errors without affecting the overall workflow.
  - Write unit tests (e.g., in `tests/unit/cacheEngine.test.js`) to simulate cache hits, misses, and entry expiration scenarios.

## Benefits
- **Performance Improvement:** Reduces the number of repetitive remote API calls, lowering latency and improving responsiveness.
- **Cost Efficiency:** Minimizes unnecessary requests, potentially reducing the load on external services and associated costs.
- **Maintainable & Extendable:** Keeps the caching functionality isolated, allowing for future enhancements such as switching to a persistent file-based cache, if required.
