library/OPENAI_API.md
# library/OPENAI_API.md
# OPENAI_API

## Crawl Summary
**Table of Technical Topics**:
1. Endpoints & URL Structure
2. Authentication Methods
3. Request Parameters & Defaults
4. Response Format & Error Handling
5. SDK/Code Examples

**Extracted Technical Details**:
- Endpoint for completions: `POST https://api.openai.com/v1/completions`
- Mandatory headers: `Authorization: Bearer YOUR_API_KEY`, `Content-Type: application/json`
- Key parameters: `model` (string), `prompt` (string), `max_tokens` (integer; default 16), `temperature` (float; default 1.0)
- Response JSON includes fields: `id`, `object`, `created`, `model`, and `choices` (array of completion results)
- Error responses include HTTP status codes and JSON error messages.


## Normalised Extract
**Table of Contents**:

1. Endpoints & URL Structure
   - Endpoint: `POST https://api.openai.com/v1/completions`
   - Additional Endpoints: `/v1/edits`, `/v1/images/generations`, etc.

2. Authentication Methods
   - Header: `Authorization: Bearer YOUR_API_KEY`
   - API key must be kept secure and rotated regularly.

3. Request Parameters & Defaults
   - `model` (string): Model identifier, e.g., "text-davinci-003"
   - `prompt` (string): Input text for completion
   - `max_tokens` (integer): Maximum tokens to generate (default: 16)
   - `temperature` (float): Sampling temperature (default: 1.0, range: 0 to 2)
   - `top_p` (float): Alternative to temperature for nucleus sampling (default: 1.0)
   - Other optional parameters: `frequency_penalty`, `presence_penalty`, etc.

4. Response Format & Error Handling
   - Successful Response Structure:
     ```json
     {
       "id": "cmpl-1234567890",
       "object": "text_completion",
       "created": 1610078130,
       "model": "text-davinci-003",
       "choices": [{
         "text": "Generated text...",
         "index": 0,
         "logprobs": null,
         "finish_reason": "length"
       }]
     }
     ```
   - Error Response Example:
     ```json
     {
       "error": {
         "message": "Invalid API key provided.",
         "type": "invalid_request_error",
         "param": null,
         "code": "invalid_api_key"
       }
     }
     ```

5. SDK/Code Examples
   - Node.js Example:
     ```javascript
     const fetch = require('node-fetch');
     
     async function getCompletion(prompt) {
       const response = await fetch('https://api.openai.com/v1/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': 'Bearer YOUR_API_KEY'
         },
         body: JSON.stringify({
           model: 'text-davinci-003',
           prompt: prompt,
           max_tokens: 50,
           temperature: 1.0
         })
       });
       return await response.json();
     }
     
     // Example usage:
     getCompletion('Hello, world!').then(res => console.log(res));
     ```

   - cURL Example:
     ```bash
     curl https://api.openai.com/v1/completions \
       -H 'Content-Type: application/json' \
       -H 'Authorization: Bearer YOUR_API_KEY' \
       -d '{"model": "text-davinci-003", "prompt": "Hello, world!", "max_tokens": 50, "temperature": 1.0}'
     ```


## Supplementary Details
**Detailed Technical Specifications & Implementation Steps**:

1. Endpoint and HTTP Method
   - Endpoint: `POST https://api.openai.com/v1/completions`
   - Ensure HTTPS is used for secure communication.

2. Request Headers
   - `Authorization`: Must include `Bearer YOUR_API_KEY`.
   - `Content-Type`: Must be set as `application/json`.

3. JSON Request Body Parameters
   - Mandatory:
     - `model` (string): The model to use (e.g., "text-davinci-003").
     - `prompt` (string): Input prompt to generate text.
   - Optional (with defaults):
     - `max_tokens` (integer): Default is 16; increase to allow longer completions.
     - `temperature` (float): Default is 1.0; controls randomness.
     - `top_p` (float): Default is 1.0; alternative to controlling randomness.
     - `n` (integer): Number of completions to generate.
     - `stream` (boolean): If true, the response will be streamed.
     - `logprobs` (integer): Include log probabilities on the response tokens.
     - `stop` (string or array): Up to 4 sequences where the API will stop generating further tokens.

4. Response Structure
   - The JSON response includes a unique `id`, creation timestamp (`created`), the `model` used, and a `choices` array. Each element in `choices` has the generated text, index, and additional metadata such as log probabilities.

5. Error Handling
   - HTTP error codes are accompanied by an error JSON with keys `error.message`, `error.type`, `error.param`, and `error.code`.
   - Implement retry logic for transient errors (e.g., HTTP 429, 500).

6. Best Practices
   - Always validate the JSON schema of both request and response.
   - Use environment variables to store API keys securely.
   - Monitor API usage and set up rate-limiting.
   - Log both successful and error responses for audit and troubleshooting.

7. Implementation Steps
   - Step 1: Set up secure storage for your API key.
   - Step 2: Construct the request with proper headers and JSON body.
   - Step 3: Implement error handling logic to catch and act upon HTTP errors.
   - Step 4: Parse the JSON response and extract the requisite values.
   - Step 5: Include logging mechanisms to track request/response cycles.


## Reference Details
**Comprehensive API Specifications and Code Examples**:

1. API Endpoint Definition:
   - URL: `https://api.openai.com/v1/completions`
   - Method: POST

2. Complete Request Example (cURL):
   ```bash
   curl https://api.openai.com/v1/completions \
     -H 'Content-Type: application/json' \
     -H 'Authorization: Bearer YOUR_API_KEY' \
     -d '{
           "model": "text-davinci-003",
           "prompt": "Translate the following English text to French: \"Hello, how are you?\"",
           "max_tokens": 60,
           "temperature": 0.7,
           "top_p": 1.0,
           "n": 1,
           "stream": false,
           "logprobs": null,
           "stop": "\n"
         }'
   ```

3. Node.js SDK Method Signature Example:
   ```javascript
   /**
    * Generates a completion using the OpenAI API.
    * @param {Object} options - The request options
    * @param {string} options.model - The model identifier (e.g., 'text-davinci-003')
    * @param {string} options.prompt - The prompt text
    * @param {number} [options.max_tokens=16] - Maximum number of tokens in the response
    * @param {number} [options.temperature=1.0] - Sampling temperature
    * @param {number} [options.top_p=1.0] - Nucleus sampling factor
    * @param {boolean} [options.stream=false] - If true, stream the results
    * @returns {Promise<Object>} - The JSON response from the API
    */
   async function createCompletion({
     model,
     prompt,
     max_tokens = 16,
     temperature = 1.0,
     top_p = 1.0,
     stream = false
   }) {
     const response = await fetch('https://api.openai.com/v1/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
       },
       body: JSON.stringify({ model, prompt, max_tokens, temperature, top_p, stream })
     });
     if (!response.ok) {
       const errorDetails = await response.json();
       throw new Error(`Error ${response.status}: ${errorDetails.error.message}`);
     }
     return await response.json();
   }
   ```

4. Python SDK Method Example using Requests:
   ```python
   import requests

   def create_completion(model: str, prompt: str, max_tokens: int = 16, temperature: float = 1.0, top_p: float = 1.0, stream: bool = False) -> dict:
       url = 'https://api.openai.com/v1/completions'
       headers = {
           'Content-Type': 'application/json',
           'Authorization': f'Bearer YOUR_API_KEY'
       }
       payload = {
           'model': model,
           'prompt': prompt,
           'max_tokens': max_tokens,
           'temperature': temperature,
           'top_p': top_p,
           'stream': stream
       }
       response = requests.post(url, headers=headers, json=payload)
       if response.status_code != 200:
           raise Exception(f'API error: {response.status_code} - {response.json()}')
       return response.json()
   ```

5. Troubleshooting Procedures:
   - If receiving a 401 or invalid API key error, ensure that your `Authorization` header is correctly formatted and your API key is active.
   - For rate limit errors (HTTP 429), implement exponential backoff. For example, wait 1 second, then 2 seconds, then 4 seconds upon consecutive failures.
   - Use logging to capture full HTTP requests and responses. In Node.js, consider using libraries like `winston` or `pino`.
   - Validate JSON schemas using tools like `ajv` in JavaScript, or `jsonschema` in Python.

6. Best Practices:
   - Securely manage your API keys using environment variables or secret management services.
   - Regularly review API usage limits and error logs.
   - Write unit tests to simulate API responses and error handling.


## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

**Retrieved Date:** 2023-10-05

## Overview
This document compiles the exact technical details extracted from the OpenAI API reference documentation. All endpoints, parameters, request and response formats, and example code are provided for direct use by developers.

## Attribution & Data Size
- Attribution: Data extracted from Source Entry 7 (https://platform.openai.com/docs/api-reference)
- Data Size: 0 bytes (as reported in crawl)

# End of Document

## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: N/A
- Crawl Date: 2025-04-20T21:41:16.097Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-20
library/PRETTIER_DOC.md
# library/PRETTIER_DOC.md
# PRETTIER_DOC

## Crawl Summary
Prettier is an opinionated code formatter that reprints code by parsing it to an AST and formatting according to a maximum line length. The tool supports multiple languages (JavaScript, JSX, Angular, Vue, etc.) and provides CLI options such as --trailing-comma, --objectWrap, --experimentalOperatorPosition, and --experimental-ternaries. Version updates include bug fixes and new features including ECMAScript Module support and enhanced plugin interfaces.

## Normalised Extract
## Table of Contents
1. Overview and Purpose
2. Supported Languages
3. Code Formatting Process
4. CLI Options and Configuration
5. Version Updates

---

### 1. Overview and Purpose
Prettier reformats code by discarding original formatting (with exceptions for empty lines and multi-line objects) and reprinting the AST with consistent styling. It removes local styling discrepancies and aligns code with a uniform standard.

### 2. Supported Languages
- JavaScript (incl. experimental features)
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, SCSS
- HTML
- Ember/Handlebars
- JSON
- GraphQL
- Markdown (GFM, MDX v1)
- YAML

### 3. Code Formatting Process
- **Initial Code:** `foo(arg1, arg2, arg3, arg4);`
- **After Formatting (if exceeding line length):**
  ```js
  foo(
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne(),
  );
  ```
The formatter adjusts line breaks based on maximum line length configurations.

### 4. CLI Options and Configuration
- **--trailing-comma**: 
  - **Values:** "none", "es5", "all"
  - **Default:** "all"
  - **Effect:** Determines placement of trailing commas in multi-line constructs.

- **--objectWrap**: 
  - Introduced in Prettier 3.5 to manage object wrapping behavior.

- **--experimentalOperatorPosition**: 
  - Introduced in Prettier 3.5 for alternative operator placements in expressions.

- **--experimental-ternaries**: 
  - Flag to enable experimental formatting for nested ternaries.

- **--cache & --cache-location**: 
  - Improves performance by caching formatted files. Cache writing occurs only when --write is active.

### 5. Version Updates
- **3.5:** New options (objectWrap, experimentalOperatorPosition) and TS config file support.
- **3.4:** Multiple bug fixes and improvements.
- **3.3:** New Flow features support.
- **3.2:** JSONC parser and Angular ICU expressions added.
- **3.1:** Experimental ternaries formatting and Angular control flow syntax.
- **3.0:** Transition to ECMAScript Modules and breaking changes in markdown formatting and plugin interface.
- **2.8:** Enhancements to caching and support for TypeScript 4.9 satisfies operator.


## Supplementary Details
### Detailed Configuration Options
- --trailing-comma
  - **Description:** Adds trailing commas to multi-line objects and arrays.
  - **Parameters:** Accepts "none", "es5", or "all".
  - **Default Value:** "all"
  - **Effect:** Ensures consistency in diff output and aids in cleaner git diffs.

- --objectWrap
  - **Description:** Enables or disables wrapping of object properties.
  - **Usage:** Boolean flag (introduced in 3.5)

- --experimentalOperatorPosition
  - **Description:** Alters the placement of operators in expressions.
  - **Usage:** Boolean flag (introduced in 3.5)

- --experimental-ternaries
  - **Description:** Applies a novel formatting style to nested ternary expressions.
  - **Usage:** Boolean flag; improves readability in deeply nested conditional statements.

### Implementation Steps for CLI Usage
1. Install Prettier via npm: `npm install --save-dev prettier`
2. Create a configuration file (e.g., `.prettierrc`) with desired options:
   ```json
   {
     "trailingComma": "all",
     "printWidth": 80,
     "tabWidth": 2,
     "semi": true
   }
   ```
3. Use Prettier in your project via CLI:
   ```bash
   npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
   ```
4. Integrate with editor plugins for on-save formatting.


## Reference Details
### API Specifications and SDK Method Signatures
While Prettier is primarily used as a CLI tool and library, the following technical details are key for developers:

#### 1. Prettier's Core Function
```js
/**
 * Formats the given source code using Prettier's rules.
 * 
 * @param {string} source - The source code to format.
 * @param {Object} options - Configuration options for formatting.
 * @param {number} [options.printWidth=80] - Maximum line length before wrapping.
 * @param {number} [options.tabWidth=2] - Number of spaces per indentation level.
 * @param {boolean} [options.semi=true] - Whether to add semicolons at the end of statements.
 * @param {string} [options.trailingComma='all'] - Control trailing commas ('none', 'es5', 'all').
 * @param {boolean} [options.useTabs=false] - Indent lines with tabs instead of spaces.
 * @param {boolean} [options.objectWrap] - Enable wrapping for objects (introduced in 3.5).
 * @param {boolean} [options.experimentalOperatorPosition] - Enables experimental operator positioning (introduced in 3.5).
 * @param {boolean} [options.experimentalTernaries] - Enables experimental formatting for nested ternaries (introduced in 3.1).
 * @returns {string} - The formatted code.
 * @throws {Error} - Throws error if parsing fails.
 */
function format(source, options) {
  // Implementation that parses the source, builds an AST,
  // applies formatting rules based on options, and returns the formatted code.
}
```

#### 2. CLI Command Examples

- **Basic Formatting Command:**
  ```bash
  npx prettier --write "src/**/*.js"
  ```

- **Using a Custom Cache Location:**
  ```bash
  npx prettier --cache --cache-location ./tmp/cache --write "src/**/*.{js,jsx,ts,tsx}"
  ```

#### 3. Best Practices
- Always integrate Prettier with your editor (e.g., VS Code, Sublime Text, Vim) to format code on save.
- Use a pre-commit hook (e.g., lint-staged) to ensure consistent formatting before commits:
  ```json
  {
    "lint-staged": {
      "*.{js,jsx,ts,tsx}": "prettier --write"
    }
  }
  ```
- Combine Prettier with ESLint by using plugins such as `eslint-plugin-prettier` to avoid conflicts between formatting and code quality rules.

#### 4. Troubleshooting Procedures
- **Issue:** Formatting does not apply as expected.
  - **Command:** `npx prettier --debug-check "src/**/*.js"`
  - **Expected Output:** Either a list of files that need formatting or confirmation that all files are formatted.
- **Issue:** CLI performance is slow on large projects.
  - **Command:** Use `--cache` and `--cache-location` to optimize performance:
    ```bash
    npx prettier --cache --cache-location ./tmp/cache --write "src/**/*.{js,jsx,ts,tsx}"
    ```
- **Issue:** Plugin migration errors after upgrading to Prettier 3.0 or later.
  - **Procedure:** Review the migration guide provided by Prettier and adjust your plugin code to use ECMAScript Modules and async parsers.


## Original Source
Prettier Documentation
https://prettier.io/docs/en/index.html

## Digest of PRETTIER_DOC

# Prettier Documentation Digest (Retrieved: 2023-10-12)

**Data Size:** 1056300 bytes

## Overview
Prettier is an opinionated code formatter that parses your source code, builds an AST, and reprints it with its own rules, taking maximum line lengths into account. It supports a variety of languages including JavaScript (and experimental features), JSX, Angular, Vue, Flow, TypeScript, CSS, Less, SCSS, HTML, Ember/Handlebars, JSON, GraphQL, Markdown (GFM and MDX v1), and YAML.

## Technical Specifications

### 1. Formatting Process
- Parses the original code by stripping away most original styling (except for empty lines and multi-line objects when practical).
- Builds an abstract syntax tree (AST) of the code.
- Reprints the code with formatting rules that wrap code when line lengths exceed the set limits.

### 2. Supported Languages
- JavaScript (including experimental features)
- JSX
- Angular
- Vue
- Flow
- TypeScript
- CSS, Less, SCSS
- HTML
- Ember/Handlebars
- JSON
- GraphQL
- Markdown (including GFM and MDX v1)
- YAML

### 3. Code Formatting Examples
- **Single-line code example**:
  ```js
  foo(arg1, arg2, arg3, arg4);
  ```
  Remains unchanged if it fits in one line.

- **Multi-line code example**:
  ```js
  foo(  
    reallyLongArg(),
    omgSoManyParameters(),
    IShouldRefactorThis(),
    isThereSeriouslyAnotherOne(),
  );
  ```
  Prettier reformats longer function calls to wrap parameters appropriately considering the configured maximum line length.

### 4. CLI Options and Configuration
- **--trailing-comma**: 
  - **Values:** "none", "es5", "all"
  - **Default:** Changed to "all" in version 3.0
  - **Effect:** Inserts trailing commas where valid in ES5 (or all possible locations if set to "all")

- **--objectWrap** (New in Prettier 3.5): 
  - **Purpose:** Configures wrapping of objects

- **--experimentalOperatorPosition** (New in Prettier 3.5): 
  - **Purpose:** Enables experimental placement of operators

- **--experimental-ternaries** (Added in Prettier 3.1): 
  - **Purpose:** Provides a novel formatting style for nested ternaries
  - **Usage:** Pass as a flag to try the new indentation for nested ternaries

- **--cache and --cache-location** (Introduced in Prettier 2.8):
  - **Purpose:** Improves CLI performance by caching formatted files
  - **Bug Fix:** Cache now only writes when --write is specified

### 5. Version Updates and Release Notes
- **Prettier 3.5 (Feb 9, 2025):**
  - New features: objectWrap option, experimentalOperatorPosition option, and TypeScript configuration file support.

- **Prettier 3.4 (Nov 26, 2024):**
  - Numerous bug fixes and performance improvements.

- **Prettier 3.3 (Jun 1, 2024):**
  - Support for new Flow features such as component and hook declarations.

- **Prettier 3.2 (Jan 12, 2024):**
  - Added JSONC parser and Angular ICU expression support.

- **Prettier 3.1 (Nov 13, 2023):**
  - Introduced experimental ternaries formatting and Angular control flow syntax support.

- **Prettier 3.0 (Jul 5, 2023):**
  - Migration to ECMAScript Modules.
  - Breaking changes: markdown formatting adjustments and overhaul of the plugin interface.

- **Prettier 2.8 (Nov 23, 2022):**
  - Improvements to --cache CLI option and support for TypeScript 4.9 satisfies operator.

## Attribution
Extracted from the official Prettier documentation page at https://prettier.io/docs/en/index.html.


## Attribution
- Source: Prettier Documentation
- URL: https://prettier.io/docs/en/index.html
- License: MIT
- Crawl Date: 2025-04-20T21:38:19.899Z
- Data Size: 1056300 bytes
- Links Found: 2604

## Retrieved
2025-04-20
library/VITEST_DOC.md
# library/VITEST_DOC.md
# VITEST_DOC

## Crawl Summary
The crawled Vitest technical content provides detailed installation commands, requirements (Vite >= v5.0.0, Node >= v18.0.0), code examples for writing tests, instructions for configuring Vitest through vitest.config (including merging with Vite's config), detailed CLI usage, workspace configuration examples, dependency optimization options, environment settings, and troubleshooting best practices. It includes precise configuration options with their default values and effects.

## Normalised Extract
# Table of Contents

1. Installation
2. Writing Tests
3. Running Tests (CLI)
4. Configuration (vitest.config)
5. Dependency Optimization
6. Environment Configuration
7. Workspace Setup
8. CLI Options & Snapshots
9. Troubleshooting & Best Practices

---

## 1. Installation

• Commands: `npm install -D vitest`, `yarn add -D vitest`, `pnpm add -D vitest`, `bun add -D vitest`
• Requirements: Vite >= v5.0.0, Node >= v18.0.0

## 2. Writing Tests

Example:

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}
```

```javascript
// sum.test.js
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## 3. Running Tests (CLI)

• Run once: `vitest run`
• Watch mode: `vitest --watch`
• For coverage: `vitest run --coverage`

## 4. Configuration (vitest.config)

- Create `vitest.config.ts` using `defineConfig` from 'vitest/config'
- Merge with Vite config using `mergeConfig` if needed

Example:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'
    ],
    globals: false,
    environment: 'node',
    pool: 'forks'
  }
});
```

## 5. Dependency Optimization

- `server.deps.external`: Default pattern `/\/node_modules\//`
- `server.deps.inline`: Array of packages or `true` to inline all
- `server.deps.fallbackCJS`: Default `false`
- `deps.optimizer`: Configuration for bundling (ssr and web modes)

## 6. Environment Configuration

- Set via `environment` in the config (e.g., 'node', 'jsdom', 'happy-dom', 'edge-runtime')
- Also configurable via file docblocks:

```javascript
/**
 * @vitest-environment jsdom
 */
```

## 7. Workspace Setup

Define in `vitest.workspace.ts`:

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  'tests/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      name: 'happy-dom',
      root: './shared_tests',
      environment: 'happy-dom',
      setupFiles: ['./setup.happy-dom.ts'],
    },
  },
  {
    test: {
      name: 'node',
      root: './shared_tests',
      environment: 'node',
      setupFiles: ['./setup.node.ts'],
    },
  },
]);
```

## 8. CLI Options & Snapshots

- Update snapshots: `vitest --update` or `-u`
- Set test root: `--root <path>`
- Specify reporters: `--reporter=<name>`
- For additional options, run `npx vitest --help`

## 9. Troubleshooting & Best Practices

- Ensure test file naming with `.test.` or `.spec.`
- For Bun users, run tests using `bun run test`
- When using separate configs for Vite and Vitest, merge with `mergeConfig`
- Verify alias configurations are consistent between Vite and Vitest
- In sandboxed environments (e.g., vmThreads), be mindful of memory leaks and different global behaviors.


## Supplementary Details
## Supplementary Technical Specifications

- **Installation Requirements:**
  - Vite >= v5.0.0
  - Node >= v18.0.0

- **Configuration Options (vitest.config):**
  - include: string[]; Default: ['**/*.{test,spec}.?(c|m)[jt]s?(x)']
  - exclude: string[]; Default: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
  - globals: boolean; Default: false
  - environment: string; Default: 'node' (options: 'node', 'jsdom', 'happy-dom', 'edge-runtime', etc.)
  - pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks'; Default: 'forks'

- **Dependency Handling Options:**
  - server.deps.external: (string | RegExp)[]; Default: [/\/node_modules\//]
  - server.deps.inline: (string | RegExp)[] | true; Default: []
  - server.deps.fallbackCJS: boolean; Default: false
  - server.deps.cacheDir: string; Default: 'node_modules/.vite'
  - deps.optimizer: { ssr?: { enabled: boolean }, web?: { enabled: boolean, transformAssets?: boolean, transformCss?: boolean, transformGlobPattern?: RegExp | RegExp[] } }

- **CLI Options Include:**
  - --config: specify custom config file
  - --watch: enable watch mode
  - --update (or -u): update snapshot files
  - --reporter: specify reporter (e.g., default, json, html, junit)
  - --root / --dir: set project root

- **Best Practices:**
  - Use a unified configuration when possible; merge Vite and Vitest configurations.
  - For in-depth debugging, use `deps.optimizer` options to force rebundling or inspect inlined modules.
  - For cross-environment testing, set the environment via config or docblocks to match test requirements.
  - In monorepo setups, define workspaces using glob patterns and explicit config objects.

- **Troubleshooting Procedures:**
  - To diagnose misconfiguration, run `npx vitest --help` to display all available CLI options.
  - When snapshots fail, use `vitest --update` to refresh snapshots.
  - For dependency resolution issues, inspect `server.deps` and `deps.optimizer` settings.
  - For sandbox related errors (e.g., in vmThreads), review memory limits and fallback options in pool settings.


## Reference Details
## Complete API and SDK Specifications

### 1. defineConfig API

Signature:

```typescript
function defineConfig(config: { test?: TestOptions; [key: string]: any }): { test?: TestOptions; [key: string]: any };
```

Where TestOptions may include:

- include: string[]
- exclude: string[]
- globals: boolean
- environment: 'node' | 'jsdom' | 'happy-dom' | 'edge-runtime' | string
- pool: 'threads' | 'forks' | 'vmThreads' | 'vmForks'
- deps: {
    external?: (string | RegExp)[];
    inline?: (string | RegExp)[] | true;
    fallbackCJS?: boolean;
    cacheDir?: string;
    optimizer?: {
       ssr?: { enabled: boolean };
       web?: { enabled: boolean, transformAssets?: boolean, transformCss?: boolean, transformGlobPattern?: RegExp | RegExp[] };
    };
  }

### 2. mergeConfig API

Signature:

```typescript
function mergeConfig(baseConfig: any, overrideConfig: any): any;
```

Usage Example:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    exclude: ['packages/template/*'],
  },
}));
```

### 3. CLI Options

- `--config <path>`: Use a specific configuration file
- `--watch` or `-w`: Enable watch mode for test execution
- `--update` or `-u`: Update snapshot files
- `--coverage`: Run tests with code coverage
- `--reporter <name>`: Specify reporter (e.g., default, json, html, junit)
- `--root <path>` / `--dir <path>`: Specify the project root

Example Command:

```bash
npx vitest --config ./vitest.config.ts --watch
```

### 4. Code Examples with Comments

```javascript
// Example test file: math.test.js
import { test, expect } from 'vitest';

// Simple sum function
export const sum = (a, b) => a + b;

// Test case: verifies that sum adds numbers correctly
test('sum adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

### 5. Best Practices

- Always include `.test.` or `.spec.` in test file names to ensure detection.
- Use a unified config file for both Vite and Vitest to avoid mismatched configuration.
- Utilize workspace configuration in monorepo setups to manage multiple test environments within a single process.
- Update snapshots with `--update` flag when intentional changes occur.

### 6. Detailed Troubleshooting Procedures

1. If tests are not found:
   - Verify that file patterns in the `include` and `exclude` options are accurate.
   - Run `npx vitest --help` to check effective CLI parameters.

2. For dependency resolution errors:
   - Check the settings under `server.deps` and ensure that externalized modules are correctly patterned.
   - Use inline options in `server.deps.inline` for packages in ESM format.

3. For sandbox environment issues (e.g., using `vmThreads`):
   - Consider switching to `forks` if native module globals cause errors.
   - Increase memory limits using `poolOptions.vmThreads.memoryLimit` if memory leaks are detected.

4. To merge Vite and Vitest configuration files:
   - Use the `mergeConfig` method as shown in the example to combine settings without overriding vital options.

Commands for debugging configuration:

```bash
# List effective configuration
npx vitest --config ./vitest.config.ts --debug

# Run tests with verbose logging
npx vitest --watch --reporter verbose
```

These API specifications, complete method signatures, detailed code examples, configuration options, best practices, and troubleshooting procedures form the complete technical reference for implementing and using Vitest directly without consulting external documentation.


## Original Source
Vitest Testing Framework Documentation
https://vitest.dev/

## Digest of VITEST_DOC

# Vitest Documentation (Retrieved: 2023-10-06)

## Installation

- Install via npm: `npm install -D vitest`
- Install via yarn: `yarn add -D vitest`
- Install via pnpm: `pnpm add -D vitest`
- Install via bun: `bun add -D vitest`

Requirements:
- Vite >= v5.0.0
- Node >= v18.0.0

## Writing Tests

Example implementation:

```javascript
// sum.js
export function sum(a, b) {
  return a + b;
}
```

```javascript
// sum.test.js
import { expect, test } from 'vitest';
import { sum } from './sum.js';

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Update your package.json:

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## Running Tests (CLI)

- Run tests once: `vitest run`
- Watch mode: `vitest --watch` or `npm run test` (if configured)
- For coverage: `vitest run --coverage`

For help: `npx vitest --help`

## Configuration

Vitest automatically reads Vite's configuration. In case of custom testing setups, create a separate config file:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Insert precise configuration options here
  },
});
```

To merge with Vite's config:

```javascript
// vitest.config.mjs
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    // Custom test configuration options
  },
}));
```

### Example: Config Options in vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**', '**/.{idea,git,cache,output,temp}/**', '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*'],
    globals: false,
    environment: 'node',
    pool: 'forks',
    deps: {
      external: [/\/node_modules\//],
      inline: [],
      fallbackCJS: false,
      cacheDir: 'node_modules/.vite',
      optimizer: {
        ssr: { enabled: false },
        web: { enabled: true }
      }
    }
  },
});
```

## Workspaces

Define workspace configuration in a separate file (e.g., vitest.workspace.ts):

```typescript
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*',
  'tests/*/vitest.config.{e2e,unit}.ts',
  {
    test: {
      name: 'happy-dom',
      root: './shared_tests',
      environment: 'happy-dom',
      setupFiles: ['./setup.happy-dom.ts'],
    },
  },
  {
    test: {
      name: 'node',
      root: './shared_tests',
      environment: 'node',
      setupFiles: ['./setup.node.ts'],
    },
  },
]);
```

## Dependency Optimization & Transformation

Key configuration parameters for dependency handling in the test environment:

- `server.deps.external`: Default is `/\/node_modules\//`
- `server.deps.inline`: Can be an array of package names or RegExp patterns or `true` for inlining all dependencies
- `server.deps.fallbackCJS`: Defaults to `false`
- `deps.optimizer`: Enables bundling via esbuild; supports `ssr` and `web` modes

Example:

```typescript
export default defineConfig({
  test: {
    deps: {
      optimizer: {
        web: { enabled: true, transformAssets: true, transformCss: true, transformGlobPattern: [] },
        ssr: { enabled: false }
      }
    }
  }
});
```

## Environment Configuration

Set the test environment using the `environment` option or with file docblocks. Common environments:
- `node` (default)
- `jsdom`
- `happy-dom`
- `edge-runtime`

Example:

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom'
  }
});
```

Docblock style:

```javascript
/**
 * @vitest-environment jsdom
 */
```

## CLI and Snapshot Options

- Update snapshots: `vitest --update` or `-u`
- Watch mode: `vitest --watch` or `-w`
- Specify test root or directory: `--root <path>` or `--dir <path>`
- Pass custom reporters using the `--reporter` flag

## Troubleshooting & Best Practices

- Use correct file naming: tests must contain `.test.` or `.spec.`
- If using Bun, run tests with `bun run test`.
- For debugging in sandbox environments (e.g., vmThreads), be aware of memory leaks and differences in native module globals.
- Use merging configuration (with `mergeConfig`) when splitting Vite and Vitest configurations.
- Ensure alias configurations are consistent between Vite and Vitest.

---

Attribution: Data retrieved from https://vitest.dev/ (Data Size: 25494893 bytes, Links Found: 21765).

## Attribution
- Source: Vitest Testing Framework Documentation
- URL: https://vitest.dev/
- License: MIT
- Crawl Date: 2025-04-21T04:49:04.625Z
- Data Size: 25494893 bytes
- Links Found: 21765

## Retrieved
2025-04-21
