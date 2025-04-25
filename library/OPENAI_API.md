# OPENAI_API

## Crawl Summary
Crawled Content Details: Data Size: 0 bytes, no links, source URL: https://platform.openai.com/docs. No technical content available from crawl; metadata only.

## Normalised Extract
Table of Contents:
1. Authentication and Headers
   - Use API key in HTTP header: Authorization: Bearer <API_KEY>
2. Endpoints
   - /v1/completions: For text completions using parameters such as model, prompt, temperature, and max_tokens.
   - /v1/chat/completions: For chat-based completions that require a messages array.
3. Request Parameters
   - model: string (e.g., "gpt-3.5-turbo")
   - prompt: string for completions or messages: array of objects each with role (string) and content (string)
   - temperature: number (default 1) to adjust randomness
   - top_p: number (default 1) for nucleus sampling
   - n: integer (default 1) specifies number of completions
   - stream: boolean (default false) enables streaming
   - stop: string or array of strings to indicate stop sequences
   - max_tokens: integer specifying maximum token count for output
4. Response Format
   - id: string identifier
   - object: object type string
   - created: numeric timestamp
   - choices: array of objects containing completion details (message and finish_reason)
   - usage: object detailing token usage (prompt_tokens, completion_tokens, total_tokens)
5. SDK Methods
   - openai.ChatCompletion.create(model: string, messages: array, temperature?: number, top_p?: number, n?: number, stream?: boolean, stop?: string|array, max_tokens?: number)
     Returns an object with id, object, created, choices, and usage

## Supplementary Details
Implementation and Configuration Details:
- Set environment variable OPENAI_API_KEY with your API key.
- Request headers require Content-Type: application/json and Authorization: Bearer <API_KEY>.
- JSON payload construction must include required fields such as model and either prompt or messages.
- Default parameter values: temperature=1, top_p=1, n=1, stream=false.
- Operation Steps:
  1. Configure API key and endpoint URL.
  2. Build JSON payload with necessary parameters.
  3. Execute HTTP POST request.
  4. Validate response status and handle errors using retry logic if needed.
- Best Practices:
  - Log complete API requests and responses for debugging.
  - monitor and adjust parameters based on usage and token limits.
- Troubleshooting:
  - Use command-line curl for endpoint testing:
    curl https://api.openai.com/v1/chat/completions -H 'Content-Type: application/json' -H 'Authorization: Bearer YOUR_API_KEY' -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}'
  - Inspect HTTP status codes and error messages for guidance.

## Reference Details
API Specifications:
Method: openai.ChatCompletion.create
Parameters:
  - model: string (required), e.g., "gpt-3.5-turbo"
  - messages: array of objects { role: string, content: string } (required)
  - temperature: number (optional, default 1)
  - top_p: number (optional, default 1)
  - n: number (optional, default 1)
  - stream: boolean (optional, default false)
  - stop: string or array (optional)
  - max_tokens: number (optional)
Return:
  - Object with properties:
      id: string
      object: string
      created: number (timestamp)
      choices: array of objects [{ message: { role: string, content: string }, finish_reason: string }]
      usage: object { prompt_tokens: number, completion_tokens: number, total_tokens: number }

Example Code (Python):
import openai
response = openai.ChatCompletion.create(
    model='gpt-3.5-turbo',
    messages=[{'role': 'user', 'content': 'Hello, world!'}],
    temperature=0.7,
    max_tokens=150
)

Example Code (NodeJS):
const openai = require('openai');
openai.ChatCompletion.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Hello, world!' }],
  temperature: 0.7,
  max_tokens: 150
}).then(response => console.log(response));

## Information Dense Extract
Auth: API key via header 'Authorization: Bearer <API_KEY>'; Endpoints: /v1/completions, /v1/chat/completions; Params: model (string), prompt/messages, temperature (default 1), top_p (default 1), n (default 1), stream (false), stop, max_tokens; Response: {id, object, created, choices[{message, finish_reason}], usage}; SDK: openai.ChatCompletion.create(model, messages, temperature?, top_p?, n?, stream?, stop?, max_tokens?)

## Sanitised Extract
Table of Contents:
1. Authentication and Headers
   - Use API key in HTTP header: Authorization: Bearer <API_KEY>
2. Endpoints
   - /v1/completions: For text completions using parameters such as model, prompt, temperature, and max_tokens.
   - /v1/chat/completions: For chat-based completions that require a messages array.
3. Request Parameters
   - model: string (e.g., 'gpt-3.5-turbo')
   - prompt: string for completions or messages: array of objects each with role (string) and content (string)
   - temperature: number (default 1) to adjust randomness
   - top_p: number (default 1) for nucleus sampling
   - n: integer (default 1) specifies number of completions
   - stream: boolean (default false) enables streaming
   - stop: string or array of strings to indicate stop sequences
   - max_tokens: integer specifying maximum token count for output
4. Response Format
   - id: string identifier
   - object: object type string
   - created: numeric timestamp
   - choices: array of objects containing completion details (message and finish_reason)
   - usage: object detailing token usage (prompt_tokens, completion_tokens, total_tokens)
5. SDK Methods
   - openai.ChatCompletion.create(model: string, messages: array, temperature?: number, top_p?: number, n?: number, stream?: boolean, stop?: string|array, max_tokens?: number)
     Returns an object with id, object, created, choices, and usage

## Original Source
OpenAI API Documentation
https://platform.openai.com/docs

## Digest of OPENAI_API

# OpenAI API Documentation
Retrieved Date: 2023-10-05
Attribution: Source: OpenAI API Documentation (Entry 6), Data Size: 0 bytes

# Authentication
- API key required; set header Authorization as 'Bearer <API_KEY>'

# Endpoints
- /v1/completions
- /v1/chat/completions

# Request Parameters
- model (string): e.g., "gpt-3.5-turbo"
- prompt (string) for completions or messages (array) for chat completions
- temperature (number): controls randomness (default: 1)
- top_p (number): nucleus sampling parameter (default: 1)
- n (integer): number of completions (default: 1)
- stream (boolean): whether to stream partial results (default: false)
- stop (string or array): stop sequence(s)
- max_tokens (integer): maximum tokens in output

# Response Structure
- id (string)
- object (string)
- created (timestamp)
- choices (array): contains completion objects with fields like message and finish_reason
- usage (object): includes prompt_tokens, completion_tokens, and total_tokens

## Attribution
- Source: OpenAI API Documentation
- URL: https://platform.openai.com/docs
- License: License: Varies
- Crawl Date: 2025-04-25T00:37:50.678Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-25
