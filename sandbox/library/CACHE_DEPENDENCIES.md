# CACHE_DEPENDENCIES

## Crawl Summary
Jobs on GitHub-hosted runners start clean. Use actions/cache@v4 with parameters key (string ≤512 chars), path (dirs/files/globs), optional restore-keys (multiline strings), optional enableCrossOsArchive (boolean). Restore sequence: exact key, partial key, restore-keys; on miss save new cache. Caches immutable. Limit: repos 10 GB total, entries expire after 7 days. Manage via web UI, REST API, GH CLI. Access restricted to current, default, and base branches. CLI workflows require CLI≥2.32.0.

## Normalised Extract
Table of Contents 1  Input Parameters 2  Restore Logic 3  Output Parameters 4  Cache Versioning 5  Usage Limits 6  Management Methods

1 Input Parameters
key   required string max512 variables, contexts, literals, functions
path  required string or multiline list directories, files, glob patterns, absolute or workspace paths
restore-keys optional multiline string ordered keys for fallback partial matches
enableCrossOsArchive optional boolean default:false enables cross-OS archive on Windows

2 Restore Logic
Step1 exact match on key
Step2 prefix match on key
Step3 for each restore-key sequential prefix match
Within branch then default branch

3 Output Parameters
cache-hit boolean true on exact match false otherwise

4 Cache Versioning
Stamp path and compression metadata to ensure tool compatibility

5 Usage Limits
Expiry 7d inactivity
Repo limit 10 GB total
Evict oldest caches when limit exceeded

6 Management Methods
Web UI Actions > Management > Caches view filter sort delete
REST API endpoints: GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}
GitHub CLI gh cache list|delete --ref --limit requires CLI>=2.32.0

## Supplementary Details
Parameter Defaults and Effects
enableCrossOsArchive: false disables cross-OS caching; set true to allow Windows runners to handle caches created on Linux/macOS
restore-keys order matters: first matching prefix restores the most recent cache
Implementation Steps
1. actions/checkout@v4
2. actions/cache@v4 with key,path,restore-keys
3. Conditional if cache-hit output false run fallback steps
4. Install/build/test
5. On success new cache saved automatically
CLI Cleanup Workflow
Use gh cache list --ref <ref> --limit <n> --json id --jq '.[].id' to fetch IDs
Loop over IDs with gh cache delete <id>
Bind GH_TOKEN and GH_REPO environment variables
Use refs/pull/${{ github.event.pull_request.number }}/merge for PR caches

## Reference Details
REST API Endpoints
GET /repos/{owner}/{repo}/actions/caches
Parameters: owner:string repo:string per_page:int page:int
Response: total_count:int actions_caches:[{id:int, key:string, size_in_bytes:int, last_accessed_at:string, created_at:string}]
DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}
Parameters: cache_id:int
Response: 204 No Content

GitHub CLI Subcommands
gh cache list --ref string --limit int --json string --jq string
gh cache delete <cache_id>

cache Action Inputs
actions/cache@v4 uses: inputs:
  key: ${{ runner.os }}-build-name-${{ hashFiles('file') }}
  path: |
    ~/.npm
    other/path
  restore-keys: |
    key1
    key2
  enableCrossOsArchive: true

Outputs
steps.cache.outputs.cache-hit
Type boolean

Best Practices
Always include runner.os in key for OS isolation
Hash dependency lock files to auto-refresh on changes
Provide multiple restore-keys from most to least specific
Check cache-hit output to skip expensive operations

Troubleshooting
Command: gh cache list --ref refs/heads/main --limit 10 --json id,name
Expected: JSON array of cache entries
If empty, ensure workflow has created caches and ref matches
If delete fails 404, verify cache_id and permissions


## Information Dense Extract
key:string≤512;path:string|list dirs/files/globs;restore-keys:string lines;enableCrossOsArchive:boolean default=false. Restore: exact key→prefix key→restore-keys sequential; branch then default branch. cache-hit:boolean. Caches expire 7d inactive; repo limit10GB; evict oldest. Manage: Web UI Caches filter key:NAME; REST GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}; CLI gh cache list|delete --ref--limit--json--jq. Best: include runner.os and hashFiles(lock) in key; multiple restore-keys; conditional cache-hit checks. Troubleshoot: gh cache list --ref refs/heads/main --limit10 --json id,name →non-empty JSON; delete returns204 on success,404 on invalid id.

## Sanitised Extract
Table of Contents 1  Input Parameters 2  Restore Logic 3  Output Parameters 4  Cache Versioning 5  Usage Limits 6  Management Methods

1 Input Parameters
key   required string max512 variables, contexts, literals, functions
path  required string or multiline list directories, files, glob patterns, absolute or workspace paths
restore-keys optional multiline string ordered keys for fallback partial matches
enableCrossOsArchive optional boolean default:false enables cross-OS archive on Windows

2 Restore Logic
Step1 exact match on key
Step2 prefix match on key
Step3 for each restore-key sequential prefix match
Within branch then default branch

3 Output Parameters
cache-hit boolean true on exact match false otherwise

4 Cache Versioning
Stamp path and compression metadata to ensure tool compatibility

5 Usage Limits
Expiry 7d inactivity
Repo limit 10 GB total
Evict oldest caches when limit exceeded

6 Management Methods
Web UI Actions > Management > Caches view filter sort delete
REST API endpoints: GET repos/{owner}/{repo}/actions/caches, DELETE repos/{owner}/{repo}/actions/caches/{cache_id}
GitHub CLI gh cache list|delete --ref --limit requires CLI>=2.32.0

## Original Source
GitHub Actions Caching Dependencies
https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows

## Digest of CACHE_DEPENDENCIES

# Cache Dependencies Document

Retrieved: 2024-06-14

# About Caching Workflow Dependencies

Jobs on GitHub-hosted runners start in a clean image. Use the cache action to store and restore dependency files between runs. Supported package managers and setup actions:

• npm, Yarn, pnpm — setup-node
• pip, pipenv, Poetry — setup-python
• Gradle, Maven — setup-java
• RubyGems — setup-ruby
• Go modules (go.sum) — setup-go
• .NET NuGet — setup-dotnet

# Restrictions for Accessing a Cache

• Restore caches only from current branch, default branch, or base branch of a pull request.
• Cannot restore caches from child or sibling branches or different tag names.
• Caches created on a pull request merge ref (refs/pull/.../merge) are scoped to that pull request runs only.
• Multiple workflow runs on the same repository and branch can share caches.

# Using the cache Action

Sequence on restore:
1. Search exact key match.
2. Search partial key match.
3. Search restore-keys sequentially.

On cache hit: cache restored and cache-hit output true.  On cache miss: job runs steps, then on success, new cache created with provided key and path.

Existing caches are immutable; to update, create a new cache with a new key.

# Input Parameters

• key (required)  Type: string  Max length: 512  Composition: variables, contexts, functions, literals
• path (required)  Type: string or multiline list  Supports directories, files, glob patterns, absolute or workspace-relative paths
• restore-keys (optional)  Type: multiline string  Order from most to least specific  Used when exact key misses
• enableCrossOsArchive (optional)  Type: boolean  Default: false  Enables cross-OS cache restore and save on Windows

# Output Parameters

• cache-hit  Type: boolean  Indicates exact key match

# Cache Hits and Misses

• Exact match: hit, restore files.
• No hit: miss, run job steps, then save new cache on success.
• On miss, checks restore-keys for partial matches, restores the most recent partial match.

# Matching a Cache Key

Search order within branch then default branch:
1. key exact
2. key prefix
3. restore-keys exact or prefix

Cache version stamps metadata for path and compression tool to ensure compatibility.

# Example Workflow

```yaml
name: Caching with npm
on: push
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache node modules
        id: cache-npm
        uses: actions/cache@v4
        env:
          cache-name: cache-node-modules
        with:
          path: |
            ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-
      - if: ${{ steps.cache-npm.outputs.cache-hit != 'true' }}
        name: List node modules state
        run: npm list
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
```

# Usage Limits and Eviction Policy

• Caches expire after 7 days of inactivity.
• Unlimited number of caches, but per-repo size limit 10 GB.
• When limit exceeded, oldest caches evicted until under limit.
• Prevent thrashing by deleting specific workflow caches or reducing paths.

# Managing Caches

Methods:
• Web interface: view, filter, sort, delete caches.
• REST API: GitHub Actions cache endpoints.
• GitHub CLI: gh cache subcommands (requires CLI ≥2.32.0).

# Example Cleanup Workflow

```yaml
name: cleanup caches by branch
on:
  pull_request:
    types: [ closed ]
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Cleanup
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GH_REPO: ${{ github.repository }}
          BRANCH: refs/pull/${{ github.event.pull_request.number }}/merge
        run: |
          cacheKeys=$(gh cache list --ref $BRANCH --limit 100 --json id --jq '.[].id')
          set +e
          for id in $cacheKeys; do gh cache delete $id; done
```


## Attribution
- Source: GitHub Actions Caching Dependencies
- URL: https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows
- License: License
- Crawl Date: 2025-05-10T06:29:55.014Z
- Data Size: 954918 bytes
- Links Found: 16783

## Retrieved
2025-05-10
