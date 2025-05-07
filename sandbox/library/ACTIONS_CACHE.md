# ACTIONS_CACHE

## Crawl Summary
Setup a cache step with actions/cache@v3 before installing dependencies. Provide inputs: path (string|string[]), key (string unique per version), restore-keys (string multiline of prefixes), optional upload-chunk-size (bytes, default 32MiB) and retention-days (days, default 7). Use hashFiles on lockfiles for primary key. Restore behavior uses first exact match, then prefixes. Share caches across jobs by matching keys. Use JavaScript API: restoreCache(paths, primaryKey, restoreKeys?, options?) returns cacheKey or undefined; saveCache(paths, primaryKey, options?) saves cache. Check outputs.cache-hit for cache result.

## Normalised Extract
Table of Contents:
1. Cache Step Configuration
2. Key and Restore Keys
3. Path Definitions
4. Restore Behavior
5. JavaScript API Usage
6. Outputs and Env Variables
7. Best Practices
8. Troubleshooting Procedures

1. Cache Step Configuration
 uses: actions/cache@v3
 with:
   path: ~/.npm or custom directory
   key: runner.os-node-hash(package-lock.json)
   restore-keys: |
     runner.os-node-
   upload-chunk-size: 33554432
   retention-days: 7

2. Key and Restore Keys
 Primary key format: <os>-<name>-<hash>
 Restore key prefixes: <os>-<name>-
 Combine multiple restore-keys by newline separation.

3. Path Definitions
 Single path as string or array of strings separated by commas. Example: ['~/.npm','~/.cache'].

4. Restore Behavior
 Workflow reads primary key; on miss tries each restore-key in order; returns first match. Exact key match sets cache-hit output to true.

5. JavaScript API Usage
 restoreCache(paths:Array|string, primaryKey:string, restoreKeys?:Array|string, options?:{lookupOnly?:boolean}) => Promise<string|undefined>
 saveCache(paths:Array|string, key:string, options?:{uploadChunkSize?:number, retentionDays?:number}) => Promise<number>

6. Outputs and Env Variables
 Steps: cache-hit output (true|false). Runtime vars: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

7. Best Practices
 Use fine-grained paths. Keep cache size < 10GB. Invalidate caches on dependency updates by hashfiles. Use matrix-specific keys.

8. Troubleshooting Procedures
 Inspect action log prefix Cache saved/restored. To flush invalid caches run gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}. Check key mismatches in logs.

## Supplementary Details
Action inputs:
 path: type string|string[]; required; path(s) to cache directories
 key: type string; required; unique cache identifier
 restore-keys: type string; optional; newline-separated prefix patterns
 upload-chunk-size: type number; optional; default 33554432 bytes
 retention-days: type number; optional; default 7 days

JavaScript API interfaces:
 interface RestoreCacheOptions { lookupOnly?: boolean }
 interface SaveCacheOptions { uploadChunkSize?: number; retentionDays?: number }

declarations:
 function restoreCache(paths: string|string[], primaryKey: string, restoreKeys?: string|string[], options?: RestoreCacheOptions): Promise<string|undefined>
 function saveCache(paths: string|string[], key: string, options?: SaveCacheOptions): Promise<number>
 function reserveCache(key: string, options?: {uploadChunkSize?: number; retentionDays?: number}): Promise<number>


## Reference Details
YAML Workflow Example:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path:
            - ~/.npm
            - ~/.cache/yarn
          key: |
            ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
          upload-chunk-size: 33554432
          retention-days: 14
      - name: Install
        run: npm ci
```

JavaScript API Example:
```javascript
import * as cache from '@actions/cache'

async function run() {
  const key = `${process.platform}-deps-${hashFiles(['package-lock.json'])}`
  const cacheKey = await cache.restoreCache(['node_modules'], key, [`${process.platform}-deps-`])
  if (!cacheKey) {
    // cache miss
  }
  // install deps
  await exec('npm install')
  await cache.saveCache(['node_modules'], key, { retentionDays: 14 })
}
```

Implementation Steps:
1. Compute hashFiles lockfiles to create key
2. Define cache step before install
3. On restore miss run install, then save cache
4. Use environment outputs to conditionally skip install on hit

Best Practices:
- Scope paths to only required directories
- Use hashFiles for key uniqueness
- Set retention-days to project lifecycle
- Monitor cache-hit percentage in action logs

Troubleshooting:
Command: gh api GET /repos/{owner}/{repo}/actions/caches
Expected: list of caches with keys and ids
Command: gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}
Use logs word regex to find Cache restored and Cache saved lines.


## Information Dense Extract
actions/cache@v3 usage: inputs path(string|string[]), key(string), restore-keys(string newline), upload-chunk-size(number,default=33554432), retention-days(number,default=7). Workflow: restore then install then save. Key pattern: <os>-<name>-<hash>. restoreCache(paths, primaryKey, restoreKeys?,{lookupOnly?}):Promise<string|undefined>. saveCache(paths, key,{uploadChunkSize?,retentionDays?}):Promise<number>. Outputs: steps.<id>.outputs.cache-hit. Env: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN. Max cache size 10GB. Best practices: use hashFiles for key, narrow paths, matrix-specific keys. Troubleshoot via gh api GET/DELETE actions/caches.

## Sanitised Extract
Table of Contents:
1. Cache Step Configuration
2. Key and Restore Keys
3. Path Definitions
4. Restore Behavior
5. JavaScript API Usage
6. Outputs and Env Variables
7. Best Practices
8. Troubleshooting Procedures

1. Cache Step Configuration
 uses: actions/cache@v3
 with:
   path: ~/.npm or custom directory
   key: runner.os-node-hash(package-lock.json)
   restore-keys: |
     runner.os-node-
   upload-chunk-size: 33554432
   retention-days: 7

2. Key and Restore Keys
 Primary key format: <os>-<name>-<hash>
 Restore key prefixes: <os>-<name>-
 Combine multiple restore-keys by newline separation.

3. Path Definitions
 Single path as string or array of strings separated by commas. Example: ['~/.npm','~/.cache'].

4. Restore Behavior
 Workflow reads primary key; on miss tries each restore-key in order; returns first match. Exact key match sets cache-hit output to true.

5. JavaScript API Usage
 restoreCache(paths:Array|string, primaryKey:string, restoreKeys?:Array|string, options?:{lookupOnly?:boolean}) => Promise<string|undefined>
 saveCache(paths:Array|string, key:string, options?:{uploadChunkSize?:number, retentionDays?:number}) => Promise<number>

6. Outputs and Env Variables
 Steps: cache-hit output (true|false). Runtime vars: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

7. Best Practices
 Use fine-grained paths. Keep cache size < 10GB. Invalidate caches on dependency updates by hashfiles. Use matrix-specific keys.

8. Troubleshooting Procedures
 Inspect action log prefix Cache saved/restored. To flush invalid caches run gh api DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}. Check key mismatches in logs.

## Original Source
GitHub Actions Caching
https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds

## Digest of ACTIONS_CACHE

Retrieved: 2024-06-23
Source: https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds
Data Size: 0 bytes

# Workflow Setup
Define cache steps before dependency installation and after code checkout.

# Using actions/cache@v3
Use the official cache action with inputs path, key, restore-keys, upload-chunk-size and retention-days.

# Key and Restore-keys
Primary key must be unique; restore-keys act as fallbacks. Use OS and file-hash-based patterns.

# Caching Multiple Directories
Multiple path entries can be provided as array or multiline string.

# Cross-Job and Matrix Caching
Share caches across jobs and matrix configurations using identical key patterns.

# JavaScript Cache API
Methods: restoreCache, saveCache, reserveCache. Interfaces for options and return values.

# Environment Variables and Outputs
Outputs: cache-hit. Environment variables: ACTIONS_CACHE_URL, ACTIONS_RUNTIME_TOKEN.

# Best Practices and Limits
Limit cache size to 10GB per repository. Use precise keys. Group related caches.

# Troubleshooting
Check action logs for upload/download warnings. Use rm -rf to clear stale caches. Verify key patterns.

## Attribution
- Source: GitHub Actions Caching
- URL: https://docs.github.com/en/actions/advanced-guides/caching-dependencies-and-builds
- License: CC BY 4.0
- Crawl Date: 2025-05-07T18:30:10.162Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-07
