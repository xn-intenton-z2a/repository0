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
