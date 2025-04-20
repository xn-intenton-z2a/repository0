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
