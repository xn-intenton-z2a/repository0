# CHAT_COMPLETIONS

## Crawl Summary
Endpoint POST /v1/chat/completions. Required: model(string), messages(array of {role,content,name?,function_call?}). Optional: temperature(0–2.0 default1.0), top_p(0–1 default1.0), n(int default1), stream(bool default false), stop(string|array), max_tokens(int), presence_penalty(-2.0–2.0 default0.0), frequency_penalty(-2.0–2.0 default0.0), logit_bias(map tokenId->bias), user(string), functions(array of {name,description,parameters}), function_call("none"|"auto"|{name}). Response: id,string; object,string; created,integer; model,string; usage:{prompt_tokens,completion_tokens,total_tokens}; choices:[{index,message:{role,content,name?,function_call?},finish_reason}].

## Normalised Extract
Table of Contents:
1. Endpoint Definition
2. Required Parameters
3. Optional Parameters
4. Response Structure
5. Error Handling

1. Endpoint Definition
URL: POST https://api.openai.com/v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

2. Required Parameters
model: string — model identifier (e.g., gpt-4, gpt-3.5-turbo)
messages: array of message objects. Each message: role:string (system|user|assistant|function), content:string, name?:string, function_call?:object

3. Optional Parameters
temperature: number [0.0,2.0] default 1.0
top_p: number [0.0,1.0] default 1.0
n: integer ≥1 default 1
stream: boolean default false
stop: string or array of strings default null
max_tokens: integer default model max
tpresence_penalty: number [-2.0,2.0] default 0.0
frequency_penalty: number [-2.0,2.0] default 0.0
logit_bias: object mapping token ID to integer bias [-100,100] default {}
user: string default null
functions: array of {name:string,description:string,parameters:JSONSchema} default none
function_call: "none"|"auto"|{name:string} default "none"

4. Response Structure
id: string
object: string = "chat.completion"
created: integer (unix timestamp)
model: string
usage: {prompt_tokens:int, completion_tokens:int, total_tokens:int}
choices: array of {index:int, message:{role:string, content:string, name?:string, function_call?:object}, finish_reason:string}

5. Error Handling
HTTP 400–499: client errors with JSON {error:{message:string, type:string, param:string|null, code:string|null}}
HTTP 401: invalid API key
HTTP 429: rate limit, implement exponential backoff
HTTP 500–599: server errors, retry with backoff

## Supplementary Details
Model IDs: gpt-4, gpt-4-0613, gpt-3.5-turbo, gpt-3.5-turbo-0613.
Max context tokens: 8192 for gpt-4, 4096 for gpt-3.5-turbo.
Rate limits: 3500 requests/min for gpt-3.5-turbo; 300 requests/min for gpt-4. Use client-side rate limiter.
Token counting: use tiktoken. Each message adds overhead: system/user/assistant role token count + content tokens.
Function calling: define functions array; to auto-invoke let function_call=auto; if the model returns function_call in response. Then send new request with updated messages including function call result.
Best practice: include system message first. Prune oldest user-assistant pairs when exceeding max_tokens - max_tokens parameter.
Logging: log usage.total_tokens for cost tracking. Set up counters per user.


## Reference Details
cURL Example:
curl https://api.openai.com/v1/chat/completions \
 -H "Authorization: Bearer $OPENAI_API_KEY" \
 -H "Content-Type: application/json" \
 -d '{"model":"gpt-3.5-turbo","messages":[{"role":"system","content":"You are helpful."},{"role":"user","content":"Hello!"}],"temperature":0.7,"max_tokens":100}'

Node.js SDK Example:
import OpenAI from "openai";
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const res = await openai.chat.completions.create({
 model: "gpt-3.5-turbo",
 messages: [
   {role: "system", content: "You are a helpful assistant."},
   {role: "user", content: "Translate 'Hello' to French."}
 ],
 temperature: 0.3,
 max_tokens: 50,
 stream: false
});
console.log(res.choices[0].message.content);

SDK Method Signature:
create(params: {
 model: string;
 messages: Array<{role: string; content: string; name?: string; function_call?: object}>;
 temperature?: number;
 top_p?: number;
 n?: number;
 stream?: boolean;
 stop?: string|string[];
 max_tokens?: number;
 presence_penalty?: number;
 frequency_penalty?: number;
 logit_bias?: Record<string, number>;
 user?: string;
 functions?: Array<{name: string; description: string; parameters: object}>;
 function_call?: string|{name: string};
}): Promise<{
 id: string;
 object: string;
 created: number;
 model: string;
 usage: {prompt_tokens: number; completion_tokens: number; total_tokens: number};
 choices: Array<{
   index: number;
   message: {role: string; content: string; name?: string; function_call?: object};
   finish_reason: string;
 }>;
}>;

Troubleshooting Procedures:
1. Rate Limit Errors (429): implement exponential backoff: wait intervals [1s,2s,4s,8s,16s], max 5 retries.
2. Authentication Errors (401): verify OPENAI_API_KEY is set; run `echo $OPENAI_API_KEY`.
3. Validation Errors (400): inspect error.param and error.message in response. Example: missing messages array.
4. JSON Parse Errors: ensure payload is valid JSON. Test via `curl -i` to inspect headers and body.
5. Token Limit Errors: if total_tokens > model context, reduce message length or lower max_tokens. Check usage.total_tokens.

Configuration Options:
- TIMEOUT: custom request timeout in ms, default 60_000.
- RETRY_COUNT: default 3.
- LOG_LEVEL: info|warn|error, default info.
- PROXY: http(s) proxy URL.

Best Practices:
- Always include system message for context.
- Use streaming for low-latency use cases: handle server-sent events.
- Monitor usage.total_tokens for cost insights.
- Pre-validate function_call schema client-side using JSON schema validation.



## Information Dense Extract
POST /v1/chat/completions Authorization:Bearer token JSON body: {model:string,messages:[{role:(system|user|assistant|function),content:string,name?:string,function_call?:object}],temperature:float0–2=1,top_p:float0–1=1,n:int=1,stream:bool=false,stop:string|string[]=null,max_tokens:int,presence_penalty:float-2–2=0,frequency_penalty:float-2–2=0,logit_bias:{tokenId:int-100–100},user:string,functions:[{name:string,description:string,parameters:JSONSchema}],function_call:"none"|"auto"|{name:string}}. Response: {id:string,object:string,created:int,model:string,usage:{prompt_tokens:int,completion_tokens:int,total_tokens:int},choices:[{index:int,message:{role:string,content:string,name?:string,function_call?:object},finish_reason:string}]}. SDK: openai.chat.completions.create(params):Promise<response>. cURL and Node.js examples above. Rate limit 429→exponential backoff. Context limits: gpt-4 8192, gpt-3.5-turbo 4096 tokens. JSON schema validation for functions. Logging usage.total_tokens. Use system prompts. Prune messages to fit context. Streaming via SSE. Troubleshoot 400,401,429,500 with status code checks.

## Sanitised Extract
Table of Contents:
1. Endpoint Definition
2. Required Parameters
3. Optional Parameters
4. Response Structure
5. Error Handling

1. Endpoint Definition
URL: POST https://api.openai.com/v1/chat/completions
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

2. Required Parameters
model: string  model identifier (e.g., gpt-4, gpt-3.5-turbo)
messages: array of message objects. Each message: role:string (system|user|assistant|function), content:string, name?:string, function_call?:object

3. Optional Parameters
temperature: number [0.0,2.0] default 1.0
top_p: number [0.0,1.0] default 1.0
n: integer 1 default 1
stream: boolean default false
stop: string or array of strings default null
max_tokens: integer default model max
tpresence_penalty: number [-2.0,2.0] default 0.0
frequency_penalty: number [-2.0,2.0] default 0.0
logit_bias: object mapping token ID to integer bias [-100,100] default {}
user: string default null
functions: array of {name:string,description:string,parameters:JSONSchema} default none
function_call: 'none'|'auto'|{name:string} default 'none'

4. Response Structure
id: string
object: string = 'chat.completion'
created: integer (unix timestamp)
model: string
usage: {prompt_tokens:int, completion_tokens:int, total_tokens:int}
choices: array of {index:int, message:{role:string, content:string, name?:string, function_call?:object}, finish_reason:string}

5. Error Handling
HTTP 400499: client errors with JSON {error:{message:string, type:string, param:string|null, code:string|null}}
HTTP 401: invalid API key
HTTP 429: rate limit, implement exponential backoff
HTTP 500599: server errors, retry with backoff

## Original Source
OpenAI Chat Completions API Reference
https://platform.openai.com/docs/api-reference/chat

## Digest of CHAT_COMPLETIONS

# OpenAI Chat Completions API Reference
Date retrieved: 2024-06-15
Data Size: 0 bytes
Links Found: 0

# HTTP Request
POST https://api.openai.com/v1/chat/completions

# Request Parameters
| Name             | Type                       | Required | Description                                                                                       | Default |
|------------------|----------------------------|----------|---------------------------------------------------------------------------------------------------|---------|
| model            | string                     | yes      | ID of the model to use (e.g., "gpt-4", "gpt-3.5-turbo")                                        | —       |
| messages         | array of message objects   | yes      | List of messages forming the conversation. Each message: {role: string, content: string, name?: string, function_call?: object} | —       |
| temperature      | number (float)             | no       | Sampling temperature between 0.0 and 2.0. Higher values produce more random outputs.               | 1.0     |
| top_p            | number (float)             | no       | Nucleus sampling probability mass.                                                               | 1.0     |
| n                | integer                    | no       | Number of completions to generate for each input.                                                 | 1       |
| stream           | boolean                    | no       | If true, partial message deltas will be sent as data-only server-sent events.                     | false   |
| stop             | string or array of strings | no       | Up to 4 sequences where the API will stop generating further tokens.                              | null    |
| max_tokens       | integer                    | no       | Maximum number of tokens to generate in the completion.                                           | (model default) |
| presence_penalty | number (float)             | no       | Positive penalty decreases the model’s likelihood to talk about new topics. Range –2.0 to 2.0.     | 0.0     |
| frequency_penalty| number (float)             | no       | Positive penalty decreases the model's likelihood to repeat the same line verbatim. Range –2.0 to 2.0.| 0.0  |
| logit_bias       | map<string,int>            | no       | Modify likelihood of specified tokens. Map token ID to bias value between –100 and 100.            | {}      |
| user             | string                     | no       | A unique identifier for the end-user, helps OpenAI monitor and detect abuse.                       | null    |
| functions        | array of function objects  | no       | Definitions for function calling: {name: string, description: string, parameters: JSON schema}.    | none    |
| function_call    | string or object           | no       | Controls function calling. "none": no call, "auto": let model decide, or {name: string} to force a call.| "none" |

# Response
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0301",
  "usage": {
    "prompt_tokens": 13,
    "completion_tokens": 7,
    "total_tokens": 20
  },
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Hello there!"},
      "finish_reason": "stop"
    }
  ]
}
```

# SDK Method Signature (Node.js)
```js
openai.chat.completions.create({
  model: string,
  messages: Array<{role: string, content: string, name?: string, function_call?: object}>,
  temperature?: number,
  top_p?: number,
  n?: number,
  stream?: boolean,
  stop?: string|string[],
  max_tokens?: number,
  presence_penalty?: number,
  frequency_penalty?: number,
  logit_bias?: Record<string, number>,
  user?: string,
  functions?: Array<{name: string, description: string, parameters: object}>,
  function_call?: string|{name: string}
}): Promise<ChatCompletion>
```

## Attribution
- Source: OpenAI Chat Completions API Reference
- URL: https://platform.openai.com/docs/api-reference/chat
- License: License: OpenAI API Terms
- Crawl Date: 2025-05-13T00:40:03.758Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-13
