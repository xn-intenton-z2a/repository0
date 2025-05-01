library/OPENAI_API.md
# library/OPENAI_API.md
# OPENAI_API

## Crawl Summary
Crawled content returned no data bytes; use source entry 2, OpenAI API Documentation, as the technical basis. Core endpoints include Completions, Chat Completions, Embeddings, Fine-tuning and integrated error handling. Each endpoint specifies required and optional parameters along with detailed response structure for immediate implementation.

## Normalised Extract
Table of Contents: 1. Completions API, 2. Chat Completions API, 3. Embeddings API, 4. Fine-tuning API, 5. Error Handling.

1. Completions API:
   - Endpoint: POST /v1/completions
   - Parameters: model (string, required), prompt (string or array, required), max_tokens (number, default 16), temperature (number, default 1.0), top_p (number, default 1.0), frequency_penalty (number), presence_penalty (number)
   - Returns: A JSON completion response containing generated text and metadata.

2. Chat Completions API:
   - Endpoint: POST /v1/chat/completions
   - Parameters: model (string, required), messages (array of message objects with roles and content, required)
   - Returns: A JSON chat response including message content and usage statistics.

3. Embeddings API:
   - Endpoint: POST /v1/embeddings
   - Parameters: model (string, required), input (string or array, required)
   - Returns: A JSON containing embeddings vectors for the provided input text.

4. Fine-tuning API:
   - Endpoints for job creation, file upload, job status retrieval
   - Required parameters: training file ID, model name, hyperparameters
   - Returns: Job status information and fine-tuned model details.

5. Error Handling:
   - HTTP codes: 200 (success), 400 (bad request), 401 (unauthorized), 429 (rate limit), 500 (server error)
   - Error structure: Contains error code, message and details; troubleshooting via curl commands to verify connectivity and authentication.


## Supplementary Details
Completions API: POST /v1/completions requires 'model' and 'prompt'. Optional: max_tokens (default 16), temperature (default 1.0), top_p (default 1.0), frequency_penalty, and presence_penalty. Chat API: POST /v1/chat/completions requires 'model' and 'messages' array (each with role and content). Embeddings API: POST /v1/embeddings requires 'model' and 'input'. Fine-tuning: supports file upload (endpoint for files), job creation with parameters like training_file (string), model (string), n_epochs (number), batch_size (number), learning_rate_multiplier (number). Configuration options include API key header: Authorization: Bearer YOUR_API_KEY, Content-Type: application/json. Troubleshooting steps include verifying API key validity with curl --header 'Authorization: Bearer YOUR_API_KEY' and checking response error codes. All endpoints return JSON responses with status information.

## Reference Details
API Specifications:
1. Completions:
   - URL: POST https://api.openai.com/v1/completions
   - Parameters object: { model: string, prompt: string|string[], max_tokens?: number, temperature?: number, top_p?: number, frequency_penalty?: number, presence_penalty?: number }
   - Return type: Promise<{ id: string, object: string, created: number, model: string, choices: Array<{ text: string, index: number, logprobs: any, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>
   - Example SDK method: openai.createCompletion({ model: "text-davinci-003", prompt: "Hello world", max_tokens: 16 });
2. Chat Completions:
   - URL: POST https://api.openai.com/v1/chat/completions
   - Parameters object: { model: string, messages: Array<{ role: string, content: string }>, temperature?: number, top_p?: number, n?: number, stream?: boolean, stop?: string|string[] }
   - Return type: Promise<{ id: string, object: string, created: number, choices: Array<{ index: number, message: { role: string, content: string }, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>
   - Example SDK method: openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: "Hello" }] });
3. Embeddings:
   - URL: POST https://api.openai.com/v1/embeddings
   - Parameters object: { model: string, input: string|string[] }
   - Return type: Promise<{ data: Array<{ embedding: number[], index: number, object: string }>, model: string, usage: { prompt_tokens: number, total_tokens: number } }>
4. Fine-tuning:
   - Endpoints include file upload (e.g. POST /v1/files), job creation (POST /v1/fine-tunes) and job status retrieval (GET /v1/fine-tunes/{fine_tune_id})
   - Required parameters for job creation: training_file (string), model (string)
   - Example command: openai.createFineTune({ training_file: "file-abc123", model: "curie", n_epochs: 4, batch_size: 8, learning_rate_multiplier: 0.1 });
5. Error Handling:
   - Common HTTP codes: 200 OK, 400 Bad Request, 401 Unauthorized, 429 Too Many Requests, 500 Internal Server Error
   - Recommended troubleshooting: Check API key header format, verify endpoint URL, use curl for connectivity:
     curl https://api.openai.com/v1/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_API_KEY' -d '{"model": "text-davinci-003", "prompt": "Test", "max_tokens": 16}'


## Information Dense Extract
POST /v1/completions: model (string), prompt (string|string[]), max_tokens (number, default 16), temperature (number, 1.0), top_p (number, 1.0), frequency_penalty (number), presence_penalty (number); Returns JSON with id, object, created, model, choices, usage. POST /v1/chat/completions: model (string), messages (array of {role, content}), optional temperature, top_p, n, stream, stop; Returns JSON with id, object, created, choices, usage. POST /v1/embeddings: model (string), input (string|string[]); Returns JSON with data, model, usage. Fine-tuning: file upload endpoint POST /v1/files, job creation endpoint POST /v1/fine-tunes with parameters training_file, model, n_epochs, batch_size, learning_rate_multiplier; Error responses: HTTP 400, 401, 429, 500. SDK method examples: openai.createCompletion({...}), openai.createChatCompletion({...}), openai.createFineTune({...}). Use header Authorization: Bearer YOUR_API_KEY with Content-Type: application/json.

## Sanitised Extract
Table of Contents: 1. Completions API, 2. Chat Completions API, 3. Embeddings API, 4. Fine-tuning API, 5. Error Handling.

1. Completions API:
   - Endpoint: POST /v1/completions
   - Parameters: model (string, required), prompt (string or array, required), max_tokens (number, default 16), temperature (number, default 1.0), top_p (number, default 1.0), frequency_penalty (number), presence_penalty (number)
   - Returns: A JSON completion response containing generated text and metadata.

2. Chat Completions API:
   - Endpoint: POST /v1/chat/completions
   - Parameters: model (string, required), messages (array of message objects with roles and content, required)
   - Returns: A JSON chat response including message content and usage statistics.

3. Embeddings API:
   - Endpoint: POST /v1/embeddings
   - Parameters: model (string, required), input (string or array, required)
   - Returns: A JSON containing embeddings vectors for the provided input text.

4. Fine-tuning API:
   - Endpoints for job creation, file upload, job status retrieval
   - Required parameters: training file ID, model name, hyperparameters
   - Returns: Job status information and fine-tuned model details.

5. Error Handling:
   - HTTP codes: 200 (success), 400 (bad request), 401 (unauthorized), 429 (rate limit), 500 (server error)
   - Error structure: Contains error code, message and details; troubleshooting via curl commands to verify connectivity and authentication.

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OPENAI API REFERENCE
Date Retrieved: 2023-10-15

## Endpoints and Specifications

### 1. Completions Endpoint
- Method: POST
- URL: /v1/completions
- Required Parameters:
  - model (string): e.g. "text-davinci-003"
  - prompt (string or array): The input text(s) for completion
- Optional Parameters:
  - max_tokens (number): Maximum number of tokens to generate (default: 16)
  - temperature (number): Sampling temperature (default: 1.0)
  - top_p (number): Nucleus sampling probability (default: 1.0)
  - frequency_penalty (number): Penalizes new tokens based on frequency in the text
  - presence_penalty (number): Penalizes new tokens based on presence in the text
- Return: JSON object with generated text and metadata

### 2. Chat Completions Endpoint
- Method: POST
- URL: /v1/chat/completions
- Required Parameters:
  - model (string): e.g. "gpt-3.5-turbo"
  - messages (array): List of message objects with roles (system, user, assistant) and content
- Return: JSON object with chat responses

### 3. Embeddings Endpoint
- Method: POST
- URL: /v1/embeddings
- Required Parameters:
  - model (string): e.g. "text-embedding-ada-002"
  - input (string or array): Text to be embedded
- Return: JSON object with embedding vectors

### 4. Fine-tuning Endpoint
- Methods: Various (e.g. GET for retrieval, POST for creation)
- Endpoints for uploading training files, creating a fine-tune job, and monitoring job status
- Key parameters include training file ID, model, hyperparameters etc.

### 5. Error Handling and Troubleshooting
- HTTP Status Codes: 200 for success, 400 for invalid request, 401 for authentication error, 429 for rate limits, 500 for server error
- Typical error response structure: Contains error code, message, and details
- Troubleshooting: Use curl examples to verify API key and endpoint connectivity

## Attribution and Data Size
- Data Size Obtained: 0 bytes
- Source: OpenAI API Documentation (Entry 2 from SOURCES.md)


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: License: Usage governed by OpenAI's API terms and conditions
- Crawl Date: 2025-04-26T18:10:54.884Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-26
library/VITEST.md
# library/VITEST.md
# VITEST

## Crawl Summary
Vitest is a Vite-native testing framework offering fast test execution, watch mode, and Jest compatibility. It supports ESM, TypeScript, JSX and provides unified configuration between Vitest and Vite. Key features include: installation via npm/yarn, writing tests using expect/test, advanced configuration via vitest.config.ts or vite.config.ts, CLI options for running tests and coverage, dependency optimization settings, alias configuration, custom environment support, and workspace configuration for running different project setups in a single process.

## Normalised Extract
Table of Contents:
1. Installation and Setup
   - npm install -D vitest, yarn add -D vitest, requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming (.test., .spec.)
   - Example: function sum(a,b) returns a+b; test using expect(sum(1,2)).toBe(3)
3. Configuration
   - Unified config with Vite; create vitest.config.ts if different test configuration needed
   - Use CLI flag --config; use process.env.VITEST or mode in defineConfig conditionally
   - Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (no .json support)
4. CLI Usage
   - Default commands: vitest, vitest run, vitest --watch
   - Scripts in package.json: "test": "vitest", "coverage": "vitest run --coverage"
5. Dependency Optimization and Aliasing
   - server.deps settings: external (default: [/\/node_modules\//]), inline options, fallbackCJS false, cacheDir 'node_modules/.vite'
   - Aliases defined via alias option with record or array structure
6. Environment Settings
   - environment option: 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - Use docblock comments (@vitest-environment jsdom) to override per file
7. Workspaces
   - Define workspace as an array in the test property in vitest.config.ts with glob patterns and config objects
8. Troubleshooting Steps
   - For Bun: use bun run test
   - Disable dependency auto-install by setting VITEST_SKIP_INSTALL_CHECKS=1
   - Use mergeConfig to combine separate Vite and Vitest configs

Each section provides specific, actionable configurations and examples directly usable by developers.

## Supplementary Details
Installation:
  - npm: npm install -D vitest
  - yarn: yarn add -D vitest
  - pnpm: pnpm add -D vitest
Requirements:
  - Vite >= v5.0.0
  - Node >= v18.0.0

Configuration Options in vitest.config.ts:
  - test.exclude: string[]; default ['**/node_modules/**', '**/dist/**', etc.]
  - test.include: string[]; default ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
  - test.globals: boolean; default false
  - test.environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'; default 'node'
  - server.deps.external: (string | RegExp)[]; default [/\/node_modules\//]
  - server.deps.inline: (string | RegExp)[] | true; default []
  - Alias settings: alias: Record<string, string> or array of find/replacement objects

CLI Options:
  - --watch: Enables watch mode if interactive environment
  - --config: Specify alternative configuration file
  - --port, --https: Additional options for CLI
  - --globals: Enables global APIs similar to Jest

Implementation Steps for Merged Configurations:
1. Create vite.config.ts with standard Vite configuration
2. Create vitest.config.ts:
   import { defineConfig, mergeConfig } from 'vitest/config'
   import viteConfig from './vite.config.ts'
   export default mergeConfig(viteConfig, defineConfig({
     test: {
       exclude: ['packages/template/*'],
       globals: true,
       environment: 'jsdom'
     }
   }))

Best Practices:
  - Use the same config file for Vite and Vitest if possible to avoid conflicts
  - Keep test files named with .test. or .spec. extension
  - Use specific environment docblocks for tests requiring browser simulation

Troubleshooting:
  - If tests do not run as expected, verify Vite configuration is loaded
  - For dependency issues, check server.deps settings and inline configuration
  - For Bun users, run tests with: bun run test
  - To disable auto dependency installation, set environment variable: VITEST_SKIP_INSTALL_CHECKS=1

## Reference Details
API Specifications and SDK Method Signatures:

1. defineConfig (from 'vitest/config'):
   Signature: import { defineConfig } from 'vitest/config'
   Usage: defineConfig({ test: { <options> } })
   Options include:
     - exclude: string[] (default: ['**/node_modules/**', '**/dist/**', ...])
     - include: string[] (default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'])
     - globals: boolean (default: false)
     - environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' (default: 'node')
     - workspace: Array of config objects or glob patterns

2. mergeConfig (from 'vitest/config'):
   Signature: mergeConfig(viteConfig: object, vitestConfig: object) => object
   Usage: Combine Vite and Vitest configuration objects
   Example:
     import { defineConfig, mergeConfig } from 'vitest/config'
     import viteConfig from './vite.config.js'
     export default mergeConfig(viteConfig, defineConfig({ test: { exclude: ['packages/template/*'] } }))

3. CLI Commands:
   - Run tests: npx vitest
   - Run single test execution: vitest run
   - Run in watch mode: vitest --watch
   - Run coverage: vitest run --coverage
   - To specify custom configuration: vitest --config ./path/to/config.ts

4. Implementation Patterns:
   - For conditional configuration in vite.config.ts:
     /// <reference types="vitest/config" />
     import { defineConfig } from 'vite'
     export default defineConfig(({ mode }) => ({
       test: {
         // if mode is 'test', apply specific config
         globals: mode === 'test',
       }
     }))

5. Configuration Options Effects and Defaults:
   - test.exclude: excludes glob patterns, default patterns include node_modules and dist directories.
   - server.deps.external: externalize dependencies matching RegExp /\/node_modules\//.
   - globals: when true, makes Vitest available as global APIs for tests.
   - environment: defines the testing environment and influences available globals (e.g., jsdom provides document and window).

6. Best Practices Examples:
   - Use integrated configuration between Vite and Vitest by maintaining a single config file or merging using mergeConfig.
   - Consistently use .test. suffix for test files to ensure proper discovery.
   - Annotate files with @vitest-environment when a non-standard environment is necessary.

7. Troubleshooting Procedures:
   - To verify configuration loading, run: npx vitest --print-config
   - For dependency resolution issues, check the output of: npx vitest --debug
   - If tests fail due to missing packages, ensure proper installation with: npm install -D vitest and checking node_modules cache directory 'node_modules/.vite'
   - For alias issues, verify that alias entries in vite.config.ts are correctly merged into Vitest config.


## Information Dense Extract
Vitest, a Vite-native testing framework, requires Vite>=v5.0.0 and Node>=v18.0.0. Installation via npm/yarn/pnpm; tests must have .test. or .spec. suffix. Use defineConfig from 'vitest/config'; options include test.exclude (default: ['**/node_modules/**','**/dist/**']), test.include (['**/*.{test,spec}.?(c|m)[jt]s?(x)']), globals (false), environment ('node'). CLI: vitest, vitest run, vitest --watch, --coverage; merge config using mergeConfig. Dependency optimization via server.deps with external: [/\/node_modules\//], inline: [] default, fallbackCJS false, cacheDir 'node_modules/.vite'. Environment=

## Sanitised Extract
Table of Contents:
1. Installation and Setup
   - npm install -D vitest, yarn add -D vitest, requirements: Vite >= v5.0.0, Node >= v18.0.0
2. Writing Tests
   - Test file naming (.test., .spec.)
   - Example: function sum(a,b) returns a+b; test using expect(sum(1,2)).toBe(3)
3. Configuration
   - Unified config with Vite; create vitest.config.ts if different test configuration needed
   - Use CLI flag --config; use process.env.VITEST or mode in defineConfig conditionally
   - Supported file extensions: .js, .mjs, .cjs, .ts, .cts, .mts (no .json support)
4. CLI Usage
   - Default commands: vitest, vitest run, vitest --watch
   - Scripts in package.json: 'test': 'vitest', 'coverage': 'vitest run --coverage'
5. Dependency Optimization and Aliasing
   - server.deps settings: external (default: [/'/node_modules'//]), inline options, fallbackCJS false, cacheDir 'node_modules/.vite'
   - Aliases defined via alias option with record or array structure
6. Environment Settings
   - environment option: 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   - Use docblock comments (@vitest-environment jsdom) to override per file
7. Workspaces
   - Define workspace as an array in the test property in vitest.config.ts with glob patterns and config objects
8. Troubleshooting Steps
   - For Bun: use bun run test
   - Disable dependency auto-install by setting VITEST_SKIP_INSTALL_CHECKS=1
   - Use mergeConfig to combine separate Vite and Vitest configs

Each section provides specific, actionable configurations and examples directly usable by developers.

## Original Source
Vitest Documentation
https://vitest.dev

## Digest of VITEST

# Vitest Documentation Digest

Retrieved on: 2023-10-XX

# Overview
Vitest is a next generation testing framework powered by Vite. It supports ESM, TypeScript, JSX and leverages Vite's config and plugins. It is compatible with Jest (expect, snapshot, coverage) and provides a fast, on-demand watch mode.

# Installation
- Install using npm: npm install -D vitest
- Install using yarn: yarn add -D vitest
- Requirements: Vite >= v5.0.0, Node >= v18.0.0

# Writing Tests
Example:
-------------
// sum.js
export function sum(a, b) {
  return a + b
}

// sum.test.js
import { expect, test } from 'vitest'
import { sum } from './sum.js'

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

Package.json script addition:
{
  "scripts": {
    "test": "vitest"
  }
}

# Configuration
Vitest configuration is unified with Vite. It reads vite.config.ts by default. For separate config:
- Create vitest.config.ts with higher priority
- Use CLI option --config ./path/to/vitest.config.ts
- Use process.env.VITEST or mode property on defineConfig

Example using defineConfig:
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Specify options such as exclude, globals, environment, workspace, etc.
  }
})

# CLI & Commands
Default CLI commands:
- Run tests: vitest or npx vitest
- Run in watch mode: vitest --watch
- Run with coverage: vitest run --coverage

# Dependency Optimization & Aliases
Configuration options include:
- server.deps with keys: external, inline, fallbackCJS, cacheDir
- Alias configuration via alias option

# Environment Configuration
Set environment using:
- environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime'
- Use docblock annotations: @vitest-environment jsdom

# Workspaces Support
Define multiple project configurations in vitest.config using the workspace array, with specific config objects for test, environment, root, and setupFiles.

# Troubleshooting & Best Practices
- Use proper test file naming (.test. or .spec.)
- Use mergeConfig from 'vitest/config' to combine Vite config with Vitest config if using separate files
- For Bun users: run tests with bun run test
- Disable auto dependency installation via VITEST_SKIP_INSTALL_CHECKS=1


## Attribution
- Source: Vitest Documentation
- URL: https://vitest.dev
- License: License: MIT License
- Crawl Date: 2025-04-29T04:46:27.864Z
- Data Size: 28807826 bytes
- Links Found: 23248

## Retrieved
2025-04-29
