#!/usr/bin/env node
// src/lib/main.js

/*
# json‑schema‑diff

**json‑schema‑diff** provides utilities to compare two JSON Schemas (or JSON data objects) and output a human‑readable diff. It’s especially useful when evolving APIs or validating schema changes.

## Installation

  ```bash
    npm install json-schema-diff
    ```

## Usage

  ```javascript
    const { diffSchemas } = require('json-schema-diff');

    const schemaA = {
      type: 'object',
      properties: {
      name: { type: 'string' },
      age: { type: 'number' }
    },
      required: ['name', 'age'],
      additionalProperties: false
    };

    const schemaB = {
      type: 'object',
      properties: {
      name: { type: 'string' },
      age: { type: 'number' },
      email: { type: 'string' }
    },
      required: ['name', 'age', 'email'],
      additionalProperties: false
    };

    const diff = diffSchemas(schemaA, schemaB);
    console.log(diff);
    ```

## API Reference

- **diffSchemas(schemaA: object, schemaB: object): string**
Returns a human‑readable diff showing changes between the two schemas.

## When & For Whom

Great for API developers and teams that need to track schema changes, especially during version upgrades or when collaborating on a shared API definition.

---

The project relies on various dependencies specified in its package configuration, including @actions/core, @octokit/rest,
acorn, axios, base64url, base85, base-x, chalk, commander, diff, dotenv, dotenv-expand, eslint-plugin-node, express,
fast-safe-stringify, js-yaml, jscodeshift, jsonrepair, keyv, keyv-file, lodash, openai, pino, recast, rxjs, tiktoken,
uuid, and vitest.


*/

// FIX?ME: Generate a simplified implementation in this file for the features in the top comment block, then add FIX?ME comments where changes for the next few foundational features could be added.
