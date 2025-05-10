# OPENAI_API

## Crawl Summary
Completions endpoint POST /v1/completions parameters model prompt max_tokens temperature top_p n stream logprobs stop response fields id object created model choices usage. Chat completions POST /v1/chat/completions parameters model messages temperature top_p n stream stop max_tokens presence_penalty frequency_penalty logit_bias response fields id object created model choices usage. Audio transcription/translations endpoints POST /v1/audio/transcriptions POST /v1/audio/translations fields file model prompt response_format response text. Embeddings POST /v1/embeddings fields model input response data usage.

## Normalised Extract
Table of Contents
 1 Completions API
 2 Chat Completions API
 3 Audio Endpoints
 4 Embeddings API

1 Completions API
  POST /v1/completions
  Required headers Authorization Bearer YOUR_API_KEY Content-Type application/json
  Body parameters
    model string text-davinci-003 text-curie-001 text-babbage-001 text-ada-001
    prompt string or array of strings
    max_tokens integer default 16 max 2048
    temperature number default 1 range 0–2
    top_p number default 1 range 0–1
    n integer default 1
    stream boolean default false
    logprobs integer range 0–5
    stop string or array
  Response fields
    id string
    object string completions
    created integer epoch
    model string
    choices array of { text string index integer logprobs object finish_reason string }
    usage { prompt_tokens completion_tokens total_tokens }

2 Chat Completions API
  POST /v1/chat/completions
  Headers as above
  Body parameters
    model string gpt-4 gpt-4-32k gpt-3.5-turbo gpt-3.5-turbo-0301
    messages array of { role string system user assistant content string }
    temperature number default 1 range 0–2
    top_p number default 1 range 0–1
    n integer default 1
    stream boolean default false
    stop string or array
    max_tokens integer
    presence_penalty number default 0 range -2–2
    frequency_penalty number default 0 range -2–2
    logit_bias object mapping token_id to bias number -100–100
  Response fields
    id object created model choices usage

3 Audio Endpoints
  POST /v1/audio/transcriptions or /v1/audio/translations
  multipart/form-data fields file whisper-1 prompt response_format default json temperature default 0
  Response text field with result

4 Embeddings API
  POST /v1/embeddings
  Body parameters model input
  Response data array of embeddings usage


## Supplementary Details
Authentication
  All requests must include header Authorization: Bearer YOUR_API_KEY
Rate Limits
  Completions and Chat endpoints: 60 requests per minute default unless upgraded
  Embeddings: 20 requests per minute
  Audio: 10 requests per minute
Timeouts
  Default HTTP client timeout 300 seconds
  Retry on 429 with exponential backoff starting 500ms doubling up to 8s max retries 5
Error codes
  400 bad_request malformed JSON or invalid parameters
  401 unauthorized invalid API key
  403 forbidden insufficient permissions
  404 not_found invalid endpoint or resource
  429 rate_limit_exceeded
  500 internal_error retryable


## Reference Details
JavaScript Node SDK Method Signatures
  createCompletion(options: { model: string; prompt?: string|string[]; max_tokens?: number; temperature?: number; top_p?: number; n?: number; stream?: boolean; logprobs?: number; stop?: string|string[]; }, config?: RequestConfig): Promise<CompletionResponse>
  createChatCompletion(options: { model: string; messages: { role: string; content: string }[]; temperature?: number; top_p?: number; n?: number; stream?: boolean; stop?: string|string[]; max_tokens?: number; presence_penalty?: number; frequency_penalty?: number; logit_bias?: Record<string, number>; }, config?: RequestConfig): Promise<ChatCompletionResponse>
  createEmbedding(options: { model: string; input: string|string[]; }, config?: RequestConfig): Promise<EmbeddingResponse>
  createTranscription(file: Blob|File, model: string, options?: { prompt?: string; response_format?: string; temperature?: number }, config?: RequestConfig): Promise<TranscriptionResponse>

Implementation Pattern
  import OpenAI from 'openai'
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const response = await openai.createChatCompletion({ model: 'gpt-3.5-turbo', messages: [ { role: 'system', content: 'You are an assistant.' }, { role: 'user', content: 'Hello' } ] })
  console.log(response.choices[0].message.content)

Configuration Options
  apiKey source environment variable OPENAI_API_KEY
  baseURL override default https://api.openai.com
  timeout override default 300000 ms

Best Practices
  Stream responses for large outputs using stream true and pipe to event handlers
  Use logit_bias for fine control of token selection
  Batch inputs for embeddings to reduce overhead

Troubleshooting
  429 errors: implement retry with exponential backoff
    code sample
      for attempt in 1..5
        try request break on success
        catch if status 429 wait 2^(attempt-1)*500ms continue
  401 errors: verify API key env variable matches account dashboard
  404 errors: confirm endpoint path matches sdk method or raw URL


## Information Dense Extract
Completions POST/v1/completions model prompt max_tokens temperature top_p n stream logprobs stop; returns id object created model choices[{text index finish_reason}] usage. Chat POST/v1/chat/completions model messages[{role content}] temperature top_p n stream stop max_tokens presence_penalty frequency_penalty logit_bias; returns id object created model choices[{message{role content}}] usage. Embeddings POST/v1/embeddings model input; returns data[{embedding index}] usage. Audio transcription/translations POST/v1/audio/transcriptions POST/v1/audio/translations file whisper-1 prompt response_format temperature; returns text. Auth header Bearer API_KEY. Rate limits completions 60rpm embeddings20rpm audio10rpm. SDK methods createCompletion createChatCompletion createEmbedding createTranscription detailed above. Retry 429 exponential backoff starting500ms max5. Timeout default300s.

## Sanitised Extract
Table of Contents
 1 Completions API
 2 Chat Completions API
 3 Audio Endpoints
 4 Embeddings API

1 Completions API
  POST /v1/completions
  Required headers Authorization Bearer YOUR_API_KEY Content-Type application/json
  Body parameters
    model string text-davinci-003 text-curie-001 text-babbage-001 text-ada-001
    prompt string or array of strings
    max_tokens integer default 16 max 2048
    temperature number default 1 range 02
    top_p number default 1 range 01
    n integer default 1
    stream boolean default false
    logprobs integer range 05
    stop string or array
  Response fields
    id string
    object string completions
    created integer epoch
    model string
    choices array of { text string index integer logprobs object finish_reason string }
    usage { prompt_tokens completion_tokens total_tokens }

2 Chat Completions API
  POST /v1/chat/completions
  Headers as above
  Body parameters
    model string gpt-4 gpt-4-32k gpt-3.5-turbo gpt-3.5-turbo-0301
    messages array of { role string system user assistant content string }
    temperature number default 1 range 02
    top_p number default 1 range 01
    n integer default 1
    stream boolean default false
    stop string or array
    max_tokens integer
    presence_penalty number default 0 range -22
    frequency_penalty number default 0 range -22
    logit_bias object mapping token_id to bias number -100100
  Response fields
    id object created model choices usage

3 Audio Endpoints
  POST /v1/audio/transcriptions or /v1/audio/translations
  multipart/form-data fields file whisper-1 prompt response_format default json temperature default 0
  Response text field with result

4 Embeddings API
  POST /v1/embeddings
  Body parameters model input
  Response data array of embeddings usage

## Original Source
OpenAI API Reference
https://platform.openai.com/docs/api-reference

## Digest of OPENAI_API

# OpenAI API Reference
Retrieved on 2024-07-07
Crawled Data Size 0 bytes Links Found 0 Error None

# Completions
Endpoint
  POST /v1/completions
Headers
  Authorization: Bearer YOUR_API_KEY
  Content-Type: application/json
Request Body Fields
  model string required   available values text-davinci-003 text-curie-001 text-babbage-001 text-ada-001
  prompt string or array optional
  max_tokens integer optional default 16 min 1 max 2048
  temperature number optional min 0 max 2 default 1
  top_p number optional min 0 max 1 default 1
  n integer optional default 1
  stream boolean optional default false
  logprobs integer optional min 0 max 5
  stop string or array optional
Response
  id string
  object string completions
  created integer epoch time
  model string
  choices array of choice objects with fields text string index integer logprobs object finish_reason string
  usage object prompt_tokens integer completion_tokens integer total_tokens integer

# Chat Completions
Endpoint
  POST /v1/chat/completions
Headers same as completions
Request Body Fields
  model string required   available values gpt-4 gpt-4-32k gpt-3.5-turbo gpt-3.5-turbo-0301
  messages array required each message object:
    role string required values system user assistant
    content string required
  temperature number optional default 1
  top_p number optional default 1
  n integer optional default 1
  stream boolean optional default false
  stop string or array optional
  max_tokens integer optional default null
  presence_penalty number optional min -2 max 2 default 0
  frequency_penalty number optional min -2 max 2 default 0
  logit_bias object optional key string token id value number between -100 and 100
Response
  id string
  object string chat.completion
  created integer epoch time
  model string
  choices array of choice objects with fields index integer message object with role and content finish_reason string
  usage object prompt_tokens integer completion_tokens integer total_tokens integer

# Audio Processing
Endpoint
  POST /v1/audio/transcriptions and /v1/audio/translations
Headers
  Content-Type multipart/form-data
Request Fields
  file file required mp3 wav m4a etc
  model string required whisper-1
  prompt string optional
  response_format string optional values json text srt verbose_json vtt default json
  temperature number optional default 0
Response
  text string transcription or translation

# Embeddings
Endpoint
  POST /v1/embeddings
Request Body Fields
  model string required text-embedding-3-small text-embedding-3-large
  input string or array required
Response
  data array of embedding objects each with index integer embedding array of floats
  usage object prompt_tokens integer total_tokens integer

Attribution OpenAI Platform API Reference


## Attribution
- Source: OpenAI API Reference
- URL: https://platform.openai.com/docs/api-reference
- License: License: governed by OpenAI API Terms of Service
- Crawl Date: 2025-05-10T16:57:01.160Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-10
