# OPENAI_API

## Crawl Summary
Authorization with Bearer tokens required. POST /v1/completions endpoint accepts parameters: model (string), prompt (string or array), max_tokens (number), optional temperature (float), top_p (float), among others. Endpoints return responses with id, object, created timestamp, model details, choices array with text and finish_reason, and token usage statistics. Recommended security by keeping API key confidential and validating HTTP responses.

## Normalised Extract
Table of Contents:
1. Authentication
   - Use Authorization header with Bearer token: 'Authorization: Bearer YOUR_API_KEY'
2. Completions API (POST /v1/completions)
   - Parameters: model (string), prompt (string|string[]), max_tokens (number), temperature (number, optional), top_p (number, optional), n (number, optional), stream (boolean, optional), logprobs (number, optional), stop (string|string[], optional)
   - Response: { id: string, object: string, created: number, model: string, choices: [ { text: string, index: number, logprobs: any, finish_reason: string } ], usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }
3. Chat Completions API (POST /v1/chat/completions)
   - Parameters: model (string), messages (array of { role: 'system'|'user'|'assistant', content: string }), temperature (number, optional), top_p (number, optional), n (number, optional), stream (boolean, optional), stop (string|string[], optional)
   - Response: { id: string, object: string, created: number, choices: [ { index: number, message: { role: string, content: string }, finish_reason: string } ], usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }
4. Configuration Options
   - Content-Type header: application/json
   - Recommended default parameters: temperature ~ 0.7, minimal max_tokens to control costs
5. Troubleshooting Procedures
   - Testing with curl command
   - Verify HTTP status codes (e.g. 401 Unauthorized) and response JSON structure

## Supplementary Details
Authentication: API key provided via header 'Authorization: Bearer YOUR_API_KEY'.

POST /v1/completions:
Request Body Parameters:
- model: string (e.g., 'text-davinci-003')
- prompt: string or array of strings
- max_tokens: number (e.g., 50)
- temperature: number (default not set, recommended 0.7)
- top_p: number (default not set)
- n: number (number of completions to generate)
- stream: boolean (if true, returns partial progress)
- logprobs: number (if set, include log probabilities)
- stop: string or array (stop tokens)

POST /v1/chat/completions:
Request Body Parameters:
- model: string (specify chat model, e.g., 'gpt-3.5-turbo')
- messages: array of message objects { role: 'system'|'user'|'assistant', content: string }
- Optional parameters similar to completions endpoint

Configuration options:
- HTTP header 'Content-Type: application/json'
- Endpoint URLs are fixed: https://api.openai.com/v1/completions and https://api.openai.com/v1/chat/completions

Implementation steps:
1. Set API key and headers
2. Construct JSON payload with specified parameters
3. Make POST request to the appropriate endpoint
4. Capture and parse JSON response
5. Handle errors based on HTTP status codes and response body content

## Reference Details
API Endpoint: POST https://api.openai.com/v1/completions
Method: postCompletions(request: { model: string, prompt: string | string[], max_tokens: number, temperature?: number, top_p?: number, n?: number, stream?: boolean, logprobs?: number, stop?: string | string[] }) returns Response<{ id: string, object: string, created: number, model: string, choices: Array<{ text: string, index: number, logprobs: any, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>

API Endpoint: POST https://api.openai.com/v1/chat/completions
Method: postChatCompletions(request: { model: string, messages: Array<{ role: 'system'|'user'|'assistant', content: string }>, temperature?: number, top_p?: number, n?: number, stream?: boolean, stop?: string | string[] }) returns Response<{ id: string, object: string, created: number, choices: Array<{ index: number, message: { role: string, content: string }, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }>

Example Code (Curl):
curl https://api.openai.com/v1/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{ "model": "text-davinci-003", "prompt": "Say hello", "max_tokens": 50 }'

Error Handling: Check HTTP 401 for invalid API key, 400 for malformed requests; log response body for detailed error messages.

Best Practices:
- Keep API key secure and do not hardcode in source code.
- Validate JSON payload before sending.
- Monitor token usage to manage costs.
- Use streaming for large responses to reduce latency.

Troubleshooting Steps:
1. Verify API key is valid and active.
2. Use curl or Postman to test endpoint manually.
3. Check network connectivity and endpoint URL.
4. Ensure request JSON matches API specification.
5. Consult HTTP response codes and error messages for further diagnosis.

## Information Dense Extract
POST /v1/completions: model(string), prompt(string|string[]), max_tokens(number), temperature(number, optional), top_p(number, optional), n(number, optional), stream(boolean, optional), logprobs(number, optional), stop(string|string[], optional) -> returns {id, object, created, model, choices[{text, index, logprobs, finish_reason}], usage{prompt_tokens, completion_tokens, total_tokens}}; POST /v1/chat/completions: model(string), messages([{role, content}]), temperature, top_p, n, stream, stop options -> returns {id, object, created, choices[{index, message:{role, content}, finish_reason}], usage}; Headers: Content-Type=application/json, Authorization=Bearer YOUR_API_KEY; Best practices include using secure key storage, validating JSON structure, monitoring token usage; Troubleshooting via curl testing and HTTP error code analysis.

## Sanitised Extract
Table of Contents:
1. Authentication
   - Use Authorization header with Bearer token: 'Authorization: Bearer YOUR_API_KEY'
2. Completions API (POST /v1/completions)
   - Parameters: model (string), prompt (string|string[]), max_tokens (number), temperature (number, optional), top_p (number, optional), n (number, optional), stream (boolean, optional), logprobs (number, optional), stop (string|string[], optional)
   - Response: { id: string, object: string, created: number, model: string, choices: [ { text: string, index: number, logprobs: any, finish_reason: string } ], usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }
3. Chat Completions API (POST /v1/chat/completions)
   - Parameters: model (string), messages (array of { role: 'system'|'user'|'assistant', content: string }), temperature (number, optional), top_p (number, optional), n (number, optional), stream (boolean, optional), stop (string|string[], optional)
   - Response: { id: string, object: string, created: number, choices: [ { index: number, message: { role: string, content: string }, finish_reason: string } ], usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }
4. Configuration Options
   - Content-Type header: application/json
   - Recommended default parameters: temperature ~ 0.7, minimal max_tokens to control costs
5. Troubleshooting Procedures
   - Testing with curl command
   - Verify HTTP status codes (e.g. 401 Unauthorized) and response JSON structure

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs/api-reference/introduction

## Digest of OPENAI_API

# OPENAI API DOCUMENTATION
Date Retrieved: 2023-10-05

# Authentication
- All API calls require Authorization header with Bearer token.
- Header: Authorization: Bearer YOUR_API_KEY

# Endpoints
## POST /v1/completions
- Description: Generate text completions based on provided prompts.
- Method Signature: postCompletions(request: {
    model: string,
    prompt: string | string[],
    max_tokens: number,
    temperature?: number,
    top_p?: number,
    n?: number,
    stream?: boolean,
    logprobs?: number,
    stop?: string | string[]
  }) : Response<{
    id: string,
    object: string,
    created: number,
    model: string,
    choices: Array<{ text: string, index: number, logprobs: any, finish_reason: string }>,
    usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
  }>

## POST /v1/chat/completions
- Description: Generate chat-based completions.
- Method Signature: postChatCompletions(request: {
    model: string,
    messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>,
    temperature?: number,
    top_p?: number,
    n?: number,
    stream?: boolean,
    stop?: string | string[]
  }) : Response<{
    id: string,
    object: string,
    created: number,
    choices: Array<{ index: number, message: { role: string, content: string }, finish_reason: string }>,
    usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number }
  }>

# Configuration and Best Practices
- Content-Type: application/json for all requests.
- Use secure practices to keep API keys private.
- Recommended defaults: max_tokens minimal value to control cost, temperature around 0.7.
- For debugging, capture HTTP error codes and response bodies.

# Troubleshooting
- Use curl command for testing: curl https://api.openai.com/v1/completions -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_API_KEY" -d '{ "model": "text-davinci-003", "prompt": "Say hello", "max_tokens": 50 }'
- Check for HTTP 401 errors indicating authorization issues.
- Validate JSON structure in request body for common syntax errors.

# Attribution
- Data Size: 0 bytes from crawl metadata
- Source: OpenAI API Documentation (Entry 3)

## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs/api-reference/introduction
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-02T20:22:13.547Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-02
