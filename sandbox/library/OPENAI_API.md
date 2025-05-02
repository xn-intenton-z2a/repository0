# OPENAI_API

## Crawl Summary
POST /v1/completions and /v1/chat/completions endpoints require model, prompt or messages, max_tokens, temperature. Authorization header with Bearer token is mandatory. SDK methods include createCompletion and createChatCompletion that return promise responses with detailed JSON structures detailing choices and usage. Error responses include 400, 401, 429, and 500 status codes.

## Normalised Extract
TABLE OF CONTENTS
1. Completions Endpoint
2. Chat Completions Endpoint
3. Authentication & Error Handling

1. Completions Endpoint
- Method: POST /v1/completions
- Parameters: model (string, required), prompt (string, required), max_tokens (number, optional), temperature (number, optional)
- Returns: JSON with 'choices' (array), 'usage'

2. Chat Completions Endpoint
- Method: POST /v1/chat/completions
- Parameters: model (string, required), messages (array of {role, content}, required), max_tokens (number, optional), temperature (number, optional)
- Returns: JSON object containing chat message details

3. Authentication & Error Handling
- Every request requires header: Authorization: Bearer YOUR_API_KEY
- Errors: 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limit), 500 (Server Error)

## Supplementary Details
Authentication must use Bearer token in all HTTP headers. The completions endpoint mandates a valid model name and prompt text. Optional configuration options include max_tokens (default varies per model) and temperature (default typically 1.0). For chat completions, messages must be formatted as an ordered array of message objects with explicit role designations ('system', 'user', 'assistant'). Thorough logging of request and response payloads is recommended for troubleshooting. Rate limiting is enforced; follow exponential backoff on 429 responses.

## Reference Details
API Specifications
Endpoint: POST /v1/completions
Parameters:
  - model: string (required)
  - prompt: string (required)
  - max_tokens: number (optional, default set by model)
  - temperature: number (optional, default 1.0)
Returns: { choices: Array<{ text: string, index: number }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }

Endpoint: POST /v1/chat/completions
Parameters:
  - model: string (required)
  - messages: Array<{ role: string, content: string }> (required)
  - max_tokens: number (optional, model dependent)
  - temperature: number (optional, default 1.0)
Returns: { choices: Array<{ message: { role: string, content: string }, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }

SDK Method Signatures
createCompletion(model: string, prompt: string, options?: { max_tokens?: number, temperature?: number }): Promise<CompletionResponse>
Where CompletionResponse = { choices: Array<{ text: string, index: number }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }

createChatCompletion(model: string, messages: Array<{ role: string, content: string }>, options?: { max_tokens?: number, temperature?: number }): Promise<ChatCompletionResponse>
Where ChatCompletionResponse = { choices: Array<{ message: { role: string, content: string }, finish_reason: string }>, usage: { prompt_tokens: number, completion_tokens: number, total_tokens: number } }

Configuration Options:
- Header: Authorization: Bearer YOUR_API_KEY
- Default timeout setting: 60 seconds in client libraries

Troubleshooting Procedures:
- On 400 errors, validate parameter formats
- On 401, check API key validity and usage limits
- On 429, implement exponential backoff: sleep for increasing intervals (e.g., 1s, 2s, 4s) and retry
- On 500, retry after 5 seconds; if persistent, consult service status

Best Practices:
- Use robust error handling in SDK wrappers
- Log full request and response payloads for error investigations
- Maintain updated API keys and monitor usage quotas

## Information Dense Extract
POST /v1/completions: model(string, req), prompt(string, req), max_tokens(number, default by model), temperature(number, default 1.0); returns JSON {choices[], usage{prompt_tokens, completion_tokens, total_tokens}}; POST /v1/chat/completions: model(string, req), messages(array<{role, content}>, req), max_tokens(number), temperature(number); Authorization: Bearer token required; SDK: createCompletion(model, prompt, {max_tokens, temperature}) returns Promise<CompletionResponse>; createChatCompletion(model, messages, {max_tokens, temperature}) returns Promise<ChatCompletionResponse>; error codes: 400, 401, 429, 500; troubleshooting: validate parameters, check API key, exponential backoff on 429, retry on 500

## Sanitised Extract
TABLE OF CONTENTS
1. Completions Endpoint
2. Chat Completions Endpoint
3. Authentication & Error Handling

1. Completions Endpoint
- Method: POST /v1/completions
- Parameters: model (string, required), prompt (string, required), max_tokens (number, optional), temperature (number, optional)
- Returns: JSON with 'choices' (array), 'usage'

2. Chat Completions Endpoint
- Method: POST /v1/chat/completions
- Parameters: model (string, required), messages (array of {role, content}, required), max_tokens (number, optional), temperature (number, optional)
- Returns: JSON object containing chat message details

3. Authentication & Error Handling
- Every request requires header: Authorization: Bearer YOUR_API_KEY
- Errors: 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limit), 500 (Server Error)

## Original Source
OpenAI API Reference
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# API OVERVIEW
Date Retrieved: 2023-10-06

# Endpoints
1. /v1/completions
   - Method: POST
   - Description: Generates completions for provided prompts
   - Parameters:
     - model (string, required): The model name to use (e.g., text-davinci-003)
     - prompt (string, required): Input text prompt
     - max_tokens (number, optional): Maximum number of tokens to generate
     - temperature (number, optional): Sampling temperature
   - Return: JSON object with fields such as choices (an array of generated completions) and usage details

2. /v1/chat/completions
   - Method: POST
   - Description: Generates chat-based completions for dialogue interactions
   - Parameters:
     - model (string, required): The model name (e.g., gpt-3.5-turbo)
     - messages (array, required): Array of message objects with roles and content
     - max_tokens (number, optional): Maximum tokens per response
     - temperature (number, optional): Sampling temperature
   - Return: JSON object with chat completions, including message role and content

# Authentication
- All endpoints require an Authorization header with a Bearer Token

# SDK Method Signatures
- createCompletion(model: string, prompt: string, options?: { max_tokens?: number, temperature?: number }): Promise<CompletionResponse>
- createChatCompletion(model: string, messages: Array<{ role: string, content: string }>, options?: { max_tokens?: number, temperature?: number }): Promise<ChatCompletionResponse>

# Error Handling
- Common HTTP errors include 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limit Exceeded), and 500 (Server Error)

# Code Example (Node.js using axios)
// const axios = require('axios');
// axios.post('https://api.openai.com/v1/completions', {
//   model: 'text-davinci-003',
//   prompt: 'Your prompt here',
//   max_tokens: 100,
//   temperature: 0.7
// }, {
//   headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
// }).then(response => console.log(response.data)).catch(error => console.error(error));


## Attribution
- Source: OpenAI API Reference
- URL: https://platform.openai.com/docs/api-reference
- License: License: N/A
- Crawl Date: 2025-05-02T00:21:23.847Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-02
