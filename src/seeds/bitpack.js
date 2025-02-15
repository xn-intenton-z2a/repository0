#!/usr/bin/env node
// src/lib/main.js

/*
# BitPack

## Introduction

`bitpack-encoder` is a Node.js library that provides utilities for generating and encoding UUIDs, with a focus on UUIDv7. It allows you to encode UUID components using various formats such as Base64URL, Base85, and even Unicode representations. This can help optimize data storage, improve URL friendliness, and provide unique visual identifiers.

## Features

- **Generate UUIDv7 identifiers** with embedded timestamp information.
- **Extract and encode** the time portion and non-time portion of UUIDs.
- **Support for multiple encodings**:
    - **Base64URL**: URL-safe encoding suitable for web applications.
    - **Base85**: More dense encoding for reduced string length.
    - **Unicode Encoding**: Map bytes to Unicode characters (e.g., emojis) for unique visual representations.
- Compatible with **Node.js 20+** and **ES Modules**.

## Installation

```bash
npm install bitpack-encoder
```

## Usage

```javascript
import { generateAndEncodeUUIDv7 } from 'bitpack-encoder';

const result = generateAndEncodeUUIDv7();
console.log(result);
```

## Examples

### Generating and Encoding UUIDv7

```javascript
import { generateAndEncodeUUIDv7 } from 'bitpack-encoder';

const {
  uuid,
  timeHex,
  nonTimeHex,
  timeBase64URL,
  nonTimeBase64URL,
  timeBase85,
  nonTimeBase85,
  timeUnicode,
  nonTimeUnicode,
} = generateAndEncodeUUIDv7();

console.log(`UUIDv7: ${uuid}`);
console.log(`Time Portion (Hex): ${timeHex}`);
console.log(`Non-Time Portion (Hex): ${nonTimeHex}`);
console.log(`Time Portion (Base64URL): ${timeBase64URL}`);
console.log(`Non-Time Portion (Base64URL): ${nonTimeBase64URL}`);
console.log(`Time Portion (Base85): ${timeBase85}`);
console.log(`Non-Time Portion (Base85): ${nonTimeBase85}`);
console.log(`Time Portion (Unicode): ${timeUnicode}`);
console.log(`Non-Time Portion (Unicode): ${nonTimeUnicode}`);
```

### Encoding Tables

#### UUIDv7 Encoding Examples

| **ISO 8601 Timestamp**     | **Epoch Time (ms)** | **UUIDv7 (Hex Format)**                               | **Time Portion (Hex)**    | **Time Portion Encodings**                         | **Non-Time Portion Encodings**                      |
|----------------------------|---------------------|--------------------------------------------------------|---------------------------|----------------------------------------------------|----------------------------------------------------|
| 2024-09-21T12:34:56.789Z   | 1726913696789       | **0192b48b-e0b5-7a4b-b7f9-3d5c8b4a6c1d**              | 00192B48BE0B5             | Base64URL: **ABkrSL4L**<br>Base85: **Eiqh*t$**     | Base64URL: **7pbXVLf5PVyLSmwd**<br>Base85: **5A#>e*6s0lNfQ** |
| 2024-09-21T12:34:57.890Z   | 1726913697890       | **0192b48c-c1d2-7a4c-8e7a-4f6d9c5b7d2e**              | 00192B48C1D22             | Base64URL: **ABkrSMHS**<br>Base85: **EiqjK8T**     | Base64URL: **7pbXQnK0Z42vto**<br>Base85: **5A#>t2OX3^0m@** |
| 2024-09-21T12:34:58.901Z   | 1726913698901       | **0192b48d-d1e5-7a4d-9f8b-5f7ead6c8e3f**              | 00192B48D1E55             | Base64URL: **ABkrSNHl**<br>Base85: **EiqkU-o**     | Base64URL: **7pbXUXdkfi6dbI4_**<br>Base85: **5A#?%Cq~9cG_Y** |

#### UUIDv4 Encoding Example

| **UUIDv4 (Hex Format)**                             | **Standard Encodings**                                 | **Dense Encodings**                                           | **Unicode Encoding**                  |
|-----------------------------------------------------|--------------------------------------------------------|---------------------------------------------------------------|----------------------------------------|
| **f47ac10b-58cc-4372-a567-0e02b2c3d479**            | Hex: `f47ac10b58cc4372a5670e02b2c3d479`<br><Base64URL: `9HrBC1jMQ3KlZw4CsrPUeQ` | Base85: `w1X;b$Q0hLr*kRIXZ'Y`                 | 🦊🎩🍰🎲🧩🚀🎯🎷🎮🎱📚📖🎤🎧🎵📀 |

## How This Library Can Help You

`bitpack-encoder` simplifies the process of working with UUIDs by providing easy-to-use functions for generating and encoding UUIDv7 identifiers. Whether you're building distributed systems, optimizing data storage, or creating unique identifiers for your application, this library offers flexible encoding options to suit your needs.

### Benefits

1. **Optimized Data Storage**: By encoding UUIDs into more compact formats like Base85 or Unicode representations, you can reduce the amount of storage space required, which can be beneficial in large-scale applications.

2. **Improved URL Friendliness**: Use Base64URL encoding to create URL-safe UUIDs without sacrificing uniqueness or readability, enhancing integration with web applications and APIs.

3. **Environmental Impact**: Reducing the number of characters in UUID representations can slightly decrease the data transmitted over networks, contributing to energy efficiency in data centers and lowering the environmental footprint.

## Use Cases

- **Distributed Databases**: Generate time-ordered UUIDs for indexing and querying large datasets efficiently.
- **URL Shortening Services**: Create compact, URL-safe identifiers for shortened links.
- **IoT Devices**: Assign unique identifiers to devices with minimal storage and transmission overhead.

## API Reference

### `generateAndEncodeUUIDv7()`

Generates a UUIDv7 and returns an object containing various encodings of its components.

#### Returns

- **uuid**: The full UUIDv7 in standard hexadecimal format.
- **timeHex**: The time portion in hexadecimal.
- **nonTimeHex**: The non-time portion in hexadecimal.
- **timeBase64URL**: Time portion encoded in Base64URL.
- **nonTimeBase64URL**: Non-time portion encoded in Base64URL.
- **timeBase85**: Time portion encoded in Base85.
- **nonTimeBase85**: Non-time portion encoded in Base85.
- **timeUnicode**: Time portion encoded using Unicode characters.
- **nonTimeUnicode**: Non-time portion encoded using Unicode characters.

## Testing

This library uses [Vitest](https://vitest.dev/) for testing.

### Running Tests

```bash
npm install
npm run test
```

### Example Test (`tests/index.test.js`)

```javascript
import { describe, it, expect } from 'vitest';
import { generateAndEncodeUUIDv7 } from '../src/index.js';

describe('BitPack', () => {
  it('should generate and encode UUIDv7 correctly', () => {
    const result = generateAndEncodeUUIDv7();
    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('timeHex');
    expect(result).toHaveProperty('nonTimeHex');
    expect(result).toHaveProperty('timeBase64URL');
    expect(result).toHaveProperty('nonTimeBase64URL');
    expect(result).toHaveProperty('timeBase85');
    expect(result).toHaveProperty('nonTimeBase85');
    expect(result).toHaveProperty('timeUnicode');
    expect(result).toHaveProperty('nonTimeUnicode');
  });
});
```

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

This project is licensed under the MIT License.

---

## TODO List for Creating and Publishing an NPM Library

To create and publish this library while adhering to best practices, follow these steps:

### 1. Set Up a Private Repository

- **Create a New Repository**: Initialize a private repository on GitHub or another platform.
- **Initialize the Project**:

  ```bash
  mkdir bitpack-encoder
  cd bitpack-encoder
  npm init -y
  ```

- **Set Up Version Control**:

  ```bash
  git init
  git remote add origin https://github.com/yourusername/bitpack-encoder.git
  ```

### 2. Implement the Library

- **Project Structure**:

  ```
  bitpack-encoder/
  ├── src/
  │   └── index.js
  ├── tests/
  │   └── index.test.js
  ├── package.json
  ├── README.md
  ├── LICENSE
  └── .gitignore
  ```

- **Install Dependencies**:

  ```bash
  npm install uuid base-x
  npm install --save-dev vitest
  ```

- **Implement Encoding Functions in `src/index.js`**:

  ```javascript
  import { v7 as uuidv7 } from 'uuid';
  import baseX from 'base-x';

  const BASE85_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{|}~';
  const base85 = baseX(BASE85_ALPHABET);

  const unicodeMap = [...Array(256).keys()].map((i) => String.fromCodePoint(0x1F600 + (i % 80)));

  function bytesToUnicode(bytes) {
    return Array.from(bytes).map((byte) => unicodeMap[byte]).join('');
  }

  export function generateAndEncodeUUIDv7() {
    const uuid = uuidv7();
    const uuidBuffer = Buffer.from(uuid.replace(/-/g, ''), 'hex');

    const timeBytes = uuidBuffer.slice(0, 6);
    const nonTimeBytes = uuidBuffer.slice(6);

    return {
      uuid,
      timeHex: timeBytes.toString('hex'),
      nonTimeHex: nonTimeBytes.toString('hex'),
      timeBase64URL: timeBytes.toString('base64url'),
      nonTimeBase64URL: nonTimeBytes.toString('base64url'),
      timeBase85: base85.encode(timeBytes),
      nonTimeBase85: base85.encode(nonTimeBytes),
      timeUnicode: bytesToUnicode(timeBytes),
      nonTimeUnicode: bytesToUnicode(nonTimeBytes),
    };
  }
  ```

### 3. Write Tests Using Vitest

- **Create Tests in `tests/index.test.js`**:

  ```javascript
  import { describe, it, expect } from 'vitest';
  import { generateAndEncodeUUIDv7 } from '../src/index.js';

  describe('BitPack', () => {
    it('should generate and encode UUIDv7 correctly', () => {
      const result = generateAndEncodeUUIDv7();
      expect(result).toHaveProperty('uuid');
      expect(result).toHaveProperty('timeHex');
      expect(result).toHaveProperty('nonTimeHex');
      expect(result).toHaveProperty('timeBase64URL');
      expect(result).toHaveProperty('nonTimeBase64URL');
      expect(result).toHaveProperty('timeBase85');
      expect(result).toHaveProperty('nonTimeBase85');
      expect(result).toHaveProperty('timeUnicode');
      expect(result).toHaveProperty('nonTimeUnicode');
    });
  });
  ```

- **Update `package.json` Scripts**:

  ```json
  "scripts": {
    "test": "vitest"
  }
  ```

### 4. Update README.md

- Include usage examples, installation instructions, encoding tables, and API references.

### 5. Prepare for Public Release

- **Review Code**: Ensure code quality and adherence to best practices.
- **Add License**: Include an MIT `LICENSE` file.
- **Update `package.json`**: Fill out all necessary fields, including `name`, `version`, `description`, `repository`, `keywords`, `author`, `license`, and `homepage`.
- **Add Badges**: Include badges for npm version, license, build status, etc.

### 6. Set Up Continuous Integration

- **GitHub Actions**: Create a workflow file (e.g., `.github/workflows/ci.yml`) to run tests on push and pull requests.

### 7. Publish to npm

- **Make Repository Public**: Change the GitHub repository visibility to public.
- **Login to npm**:

  ```bash
  npm login
  ```

- **Publish the Package**:

  ```bash
  npm publish
  ```

### 8. Maintain the Package

- **Engage with Users**: Respond to issues and pull requests.
- **Update Dependencies**: Regularly check for updates and security patches.
- **Follow Semantic Versioning**: Use proper version numbers for updates.
- **Document Changes**: Keep a changelog to document updates and fixes.

## Conclusion

By using `bitpack-encoder`, you can streamline your work with UUIDs, making your applications more efficient and your codebase cleaner. The library provides flexibility in how you represent UUIDs, catering to different needs such as storage optimization, URL compatibility, and unique visual identifiers.

---

The project relies on various dependencies specified in its package configuration, including @actions/core, @octokit/rest,
acorn, axios, base64url, base85, base-x, chalk, commander, diff, dotenv, dotenv-expand, eslint-plugin-node, express,
fast-safe-stringify, js-yaml, jscodeshift, jsonrepair, keyv, keyv-file, lodash, openai, pino, recast, rxjs, tiktoken,
uuid, and vitest.


*/

// FIX?ME: Generate a simplified implementation in this file for the features in the top comment block, then add FIX?ME comments where changes for the next few foundational features could be added.
