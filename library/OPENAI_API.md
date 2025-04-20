# OPENAI_API

## Crawl Summary
Endpoint: POST /v1/completions (URL: https://api.openai.com/v1/completions). Request parameters include model (string), prompt (string), max_tokens (number), temperature (number), and top_p (number). Response includes id, object, created, model, and a choices array with text, index, logprobs, and finish_reason. Node.js SDK example using axios, configuration defaults, and troubleshooting steps using curl are provided.

## Normalised Extract
Table of Contents:
1. Endpoints and Methods
   - URL: https://api.openai.com/v1/completions
   - HTTP Method: POST
   - Required Headers: Content-Type: application/json, Authorization: Bearer YOUR_API_KEY
2. Request Parameters
   - model: string (e.g., 'text-davinci-003')
   - prompt: string
   - max_tokens: number (default 100)
   - temperature: number (default 0.7)
   - top_p: number (default 1)
3. Response Structure
   - id: string
   - object: string
   - created: number
   - model: string
   - choices: Array of objects with properties (text, index, logprobs, finish_reason)
4. SDK Method Example
   - Function: createCompletion(prompt: string)
   - Returns a Promise resolving to the API response object
5. Configuration Options
   - API_BASE_URL: https://api.openai.com/v1
   - DEFAULT_MODEL: text-davinci-003
   - DEFAULT_MAX_TOKENS: 100
   - DEFAULT_TEMPERATURE: 0.7
   - DEFAULT_TOP_P: 1
6. Troubleshooting Procedures
   - Verify API key validity
   - Check rate limits
   - Use curl commands for debugging

Detailed Information:
1. Endpoints and Methods:
   - POST endpoint at https://api.openai.com/v1/completions requires proper authorization.

2. Request Parameters:
   - JSON object containing: model, prompt, max_tokens, temperature, top_p.

3. Response Structure:
   - JSON object with fields id, object, created, model, and choices (with text, index, logprobs, finish_reason).

4. SDK Method Example (Node.js):
   - Uses axios to make an HTTP POST request. Handles errors with try/catch.

5. Configuration Options:
   - Set defaults for model, max_tokens, temperature, and top_p for consistent API calls.

6. Troubleshooting Procedures:
   - Utilize curl to test endpoints and verify header and JSON payload correctness.


## Supplementary Details
Technical Specifications:

- Parameter Details:
  - model: Use 'text-davinci-003' as default. Other models like 'text-curie-001' may also be used.
  - prompt: A required string for text generation.
  - max_tokens: Determines the maximum length of the generated text, default set to 100.
  - temperature: Controls randomness (0 = deterministic, 1 = creative), default is 0.7.
  - top_p: Used for nucleus sampling, default is 1.

- Implementation Steps:
  1. Configure HTTP POST request to https://api.openai.com/v1/completions.
  2. Set headers: 'Content-Type' to application/json and 'Authorization' with your API key.
  3. Construct the JSON payload with required parameters.
  4. Execute the request and parse the JSON response.
  5. Implement error handling to catch and log failures.

- Node.js Code Example:

```javascript
const axios = require('axios');

async function createCompletion(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
      top_p: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createCompletion };
```

- Troubleshooting Command Example:

```bash
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"model": "text-davinci-003", "prompt": "Hello world!", "max_tokens": 100, "temperature": 0.7, "top_p": 1}'
```


## Reference Details
Complete API Specifications:

1. Endpoint:
   POST https://api.openai.com/v1/completions

2. Required HTTP Headers:
   - Content-Type: application/json
   - Authorization: Bearer YOUR_API_KEY

3. Request Body Schema:
   {
     model: string,        // e.g., "text-davinci-003"
     prompt: string,       // Text input provided by user
     max_tokens: number,   // Optional, default 100
     temperature: number,  // Optional, default 0.7 (range: 0 to 1)
     top_p: number         // Optional, default 1
   }

4. Response Body Schema:
   {
     id: string,
     object: string,
     created: number,
     model: string,
     choices: [
       {
         text: string,
         index: number,
         logprobs: object|null,
         finish_reason: string
       }
     ]
   }

5. SDK Method Signature (Node.js):

/**
 * Create a completion using the OpenAI API.
 * @param {string} prompt - The prompt string for text generation.
 * @returns {Promise<{
 *   id: string,
 *   object: string,
 *   created: number,
 *   model: string,
 *   choices: Array<{ text: string, index: number, logprobs: object|null, finish_reason: string }>
 * }>} Promise resolving to the API response object.
 */
async function createCompletion(prompt) { ... }

6. Full Code Example:

```javascript
const axios = require('axios');

async function createCompletion(prompt) {
  const response = await axios.post('https://api.openai.com/v1/completions', {
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 100,
    temperature: 0.7,
    top_p: 1
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    }
  });
  return response.data;
}

module.exports = { createCompletion };
```

7. Configuration Options and Defaults:
   - API_BASE_URL: "https://api.openai.com/v1"
   - DEFAULT_MODEL: "text-davinci-003"
   - DEFAULT_MAX_TOKENS: 100
   - DEFAULT_TEMPERATURE: 0.7
   - DEFAULT_TOP_P: 1

8. Best Practices:
   - Securely manage your API key.
   - Implement robust error handling and logging.
   - Use retry mechanisms for transient errors.
   - Test using curl or Postman prior to integration.

9. Troubleshooting Procedures:
   - Validate API endpoint and parameters.
   - Check for proper API key scope and usage limits.
   - Use commands similar to the provided curl example to debug.
   - Inspect error messages and HTTP status codes for precise issues.


## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Documentation

*Retrieved on: 2023-10-04*

Attribution: Data sourced from https://platform.openai.com/docs/api-reference

## Endpoints

**POST /v1/completions**

- URL: https://api.openai.com/v1/completions
- Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: Bearer YOUR_API_KEY

## Request Parameters

```json
{
  "model": "text-davinci-003",  // string, e.g., 'text-davinci-003'
  "prompt": "Your prompt text here",  // string
  "max_tokens": 100,              // number, default 100
  "temperature": 0.7,             // number, range 0 to 1
  "top_p": 1                      // number, typically 1
}
```

## Response Structure

```json
{
  "id": "cmpl-xxxxxxxxxxxx",
  "object": "text_completion",
  "created": 1610078130,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "Generated text...",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ]
}
```

## SDK Methods

### Node.js Example using Axios

```javascript
const axios = require('axios');

/**
 * Create a text completion using OpenAI API.
 * @param {string} prompt - The prompt string for completion.
 * @returns {Promise<Object>} The API response object containing completion details.
 */
async function createCompletion(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.7,
      top_p: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_API_KEY`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { createCompletion };
```

## Configuration Options

- API_BASE_URL: "https://api.openai.com/v1"
- DEFAULT_MODEL: "text-davinci-003"
- DEFAULT_MAX_TOKENS: 100
- DEFAULT_TEMPERATURE: 0.7
- DEFAULT_TOP_P: 1

## Troubleshooting

1. Verify that your API key is valid and has the necessary permissions.
2. Check rate limiting and ensure you are not exceeding usage quotas.
3. Debug using curl:

```bash
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"model": "text-davinci-003", "prompt": "Hello, world!", "max_tokens": 100, "temperature": 0.7, "top_p": 1}'
```


## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference
- License: N/A
- Crawl Date: 2025-04-20T20:27:02.624Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-20
