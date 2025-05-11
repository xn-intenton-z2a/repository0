sandbox/library/REUSABLE_WORKFLOWS.md
# sandbox/library/REUSABLE_WORKFLOWS.md
# REUSABLE_WORKFLOWS

## Crawl Summary
on.workflow_call trigger required; define inputs under on.workflow_call.inputs with type string|boolean|number and required flag; define secrets under on.workflow_call.secrets; call reusable workflow in jobs.<id>.uses syntax with repo path and ref; pass inputs via with: <input>: value; pass secrets via secrets: <secret>: ${{ secrets.X }} or secrets: inherit; supports matrix strategy by combining strategy.matrix and uses; maximum nest depth 4 levels; maximum 20 unique workflows per caller; env vars in workflow-level env contexts not propagated; use vars context for cross-workflow variables; GitHub-hosted runners billed and evaluated in caller context; self-hosted runners accessible from caller org; supported job keywords limited to name, uses, with, secrets, strategy, needs, if, concurrency, permissions; outputs mapped from steps to job to workflow and consumed with needs.job.outputs; re-run semantics differ for full vs partial re-runs; redirects unsupported resulting in failure.

## Normalised Extract
Table of Contents:
 1 Access Control
 2 Runner Assignment
 3 Workflow Call Event
 4 Inputs & Secrets Definition
 5 Invoking Reusable Workflows
 6 Matrix Strategy
 7 Supported Job Keywords
 8 Nesting Workflows
 9 Output Mapping
 10 Re-run Semantics

1 Access Control
  Conditions:
    • Same repo
    • Public repo with org permission
    • Private repo with explicit access policy

2 Runner Assignment
  GitHub-hosted:
    • runs-on evaluated in caller context
    • billing to caller
  Self-hosted:
    • accessible if in caller repo or org-provided

3 Workflow Call Event
  Syntax:
    on:
      workflow_call:

4 Inputs & Secrets Definition
  on.workflow_call.inputs:
    <id>:
      required: true|false
      type: string|boolean|number
  on.workflow_call.secrets:
    <id>:
      required: true|false

5 Invoking Reusable Workflows
  jobs.<job_id>.uses: owner/repo/.github/workflows/file@ref or ./.github/workflows/file
  jobs.<job_id>.with:<input_id>: ${ inputs }  
  jobs.<job_id>.secrets:<secret_id>: ${{ secrets }} or inherit

6 Matrix Strategy
  strategy.matrix:<key>: [values]
  uses and with accept matrix expressions

7 Supported Job Keywords
  name, uses, with, secrets, strategy, needs, if, concurrency, permissions

8 Nesting Workflows
  Maximum depth: 4 levels
  Secrets pass only one level at a time (inherit or explicit per job)

9 Output Mapping
  Step-level to job-level:
    steps:
      - id: s
        run: echo "key=value" >> $GITHUB_OUTPUT
    outputs:
      o: ${{ steps.s.outputs.key }}
  Job-level to workflow-level:
    on.workflow_call.outputs:<id>.value: ${ jobs.<job>.outputs.o }
  Consumption in caller:
    needs.<job>.outputs.<id>

10 Re-run Semantics
  Full re-run uses latest ref when not SHA
  Failed/specific job re-run uses original commit SHA

## Supplementary Details
Inputs:
  Type options: string (quoted YAML), boolean (true|false), number (integer|float)
  Required defaults to false
Secrets:
  Must be defined under on.workflow_call.secrets
  Cannot pass environment secrets via workflow_call
Refs:
  Use SHA for stability; tags override branches of same name
Env Variables:
  Workflow-level env contexts not shared; use outputs or vars context
Limits:
  Nest depth = 4; count includes top-level caller as level 1
  Unique workflows per file ≤ 20 (includes nested counts)
Permissions:
  Default GITHUB_TOKEN permissions apply if jobs.<id>.permissions omitted
  Called workflow can only reduce (not elevate) GITHUB_TOKEN permissions
Concurrency:
  Use distinct concurrency.group values in caller and called to avoid self-cancellation

Implementation Steps:
 1 Create `.github/workflows/reusable.yml` with on.workflow_call
 2 Define inputs and secrets under workflow_call
 3 Reference inputs/secrets in job steps using ${{ inputs.X }} and ${{ secrets.Y }}
 4 In calling workflow, add job with uses pointing to reusable.yml@ref
 5 Pass inputs via with:, secrets via secrets: or inherit
 6 For matrices, include strategy.matrix alongside uses
 7 Map and expose outputs in reusable; consume via needs in caller


## Reference Details
Complete Keywords and Structure:
```yaml
on:
  workflow_call:
    inputs:
      <input_id>:
        required: true|false
        type: string|boolean|number
    secrets:
      <secret_id>:
        required: true|false
    outputs:
      <output_id>:
        description: "text"
        value: ${{ jobs.<job>.outputs.<job_output> }}
jobs:
  <job_id>:
    name: <string>
    runs-on: <runner_label>
    needs: [<other_job_ids>]
    if: <expression>
    uses: owner/repo/.github/workflows/<file>.yml@<ref>
    with:
      <input_id>: <value>
    secrets:
      <secret_id>: ${{ secrets.<secret> }}
    secrets: inherit
    strategy:
      matrix:
        <key>: [<values>]
    concurrency:
      group: <string>
      cancel-in-progress: true|false
    permissions:
      <scope>: read|write
```
Example Reusable Workflow:
```yaml
name: Labeler Reusable
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      token:
        required: true
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.token }}
          configuration-path: ${{ inputs.config-path }}
```
Example Caller Workflow:
```yaml
name: Call Labeler
on: [pull_request]
jobs:
  label-job:
    uses: octo-org/repo/.github/workflows/labeler.yml@main
    with:
      config-path: .github/labeler.yml
    secrets:
      token: ${{ secrets.GITHUB_TOKEN }}
```
Matrix Invocation:
```yaml
jobs:
  matrix-deploy:
    strategy:
      matrix:
        env: [dev,stage,prod]
    uses: org/repo/.github/workflows/deploy.yml@v2
    with:
      target-env: ${{ matrix.env }}
```
Output Mapping in Reusable:
```yaml
on:
  workflow_call:
    outputs:
      result:
        value: ${{ jobs.build.outputs.build_id }}
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      build_id: ${{ steps.setid.outputs.id }}
    steps:
      - id: setid
        run: echo "id=12345" >> $GITHUB_OUTPUT
```
Consume Outputs:
```yaml
jobs:
  generate:
    uses: org/repo/.github/workflows/build.yml@v1
  report:
    runs-on: ubuntu-latest
    needs: generate
    steps:
      - run: echo ${{ needs.generate.outputs.result }}
```
Best Practices:
- Pin reusable workflows to commit SHA for stability.
- Define minimal permissions in caller jobs to adhere to least privilege.
- Use concurrency.group to prevent overlapping runs.
- Use secrets: inherit for same-org workflows when passing all secrets.
Troubleshooting:
- Error "could not resolve action": verify owner/repo and ref existence.
- Permission denied on calling workflow: check repo Settings > Actions > General > Allow select actions and reusable workflows.
- Rerun fails due to ref drift: use pinned SHA or tag.
- Nested call inaccessible: ensure each repository has access policy granting caller.


## Information Dense Extract
on.workflow_call trigger with inputs(id,type,required),secrets(id,required),outputs(id,description,value);jobs.<id>.uses syntax owner/repo/.github/workflows/file@ref or ./path (no refs/heads);with.<input_id>:value,secrets.<secret_id>:$GITHUB_TOKEN or inherit;strategy.matrix for multi-run;max depth=4,max unique=20;env contexts not shared,use vars;GitHub-hosted runners billed in caller context,self-hosted from caller repo/org;supported job keywords(name,uses,with,secrets,strategy,needs,if,concurrency,permissions);outputs: map step->job->workflow then needs.<job>.outputs;rerun semantics: full uses latest ref if non-SHA,partial uses original SHA;no redirects;permissions can only be downgraded.

## Sanitised Extract
Table of Contents:
 1 Access Control
 2 Runner Assignment
 3 Workflow Call Event
 4 Inputs & Secrets Definition
 5 Invoking Reusable Workflows
 6 Matrix Strategy
 7 Supported Job Keywords
 8 Nesting Workflows
 9 Output Mapping
 10 Re-run Semantics

1 Access Control
  Conditions:
     Same repo
     Public repo with org permission
     Private repo with explicit access policy

2 Runner Assignment
  GitHub-hosted:
     runs-on evaluated in caller context
     billing to caller
  Self-hosted:
     accessible if in caller repo or org-provided

3 Workflow Call Event
  Syntax:
    on:
      workflow_call:

4 Inputs & Secrets Definition
  on.workflow_call.inputs:
    <id>:
      required: true|false
      type: string|boolean|number
  on.workflow_call.secrets:
    <id>:
      required: true|false

5 Invoking Reusable Workflows
  jobs.<job_id>.uses: owner/repo/.github/workflows/file@ref or ./.github/workflows/file
  jobs.<job_id>.with:<input_id>: ${ inputs }  
  jobs.<job_id>.secrets:<secret_id>: ${{ secrets }} or inherit

6 Matrix Strategy
  strategy.matrix:<key>: [values]
  uses and with accept matrix expressions

7 Supported Job Keywords
  name, uses, with, secrets, strategy, needs, if, concurrency, permissions

8 Nesting Workflows
  Maximum depth: 4 levels
  Secrets pass only one level at a time (inherit or explicit per job)

9 Output Mapping
  Step-level to job-level:
    steps:
      - id: s
        run: echo 'key=value' >> $GITHUB_OUTPUT
    outputs:
      o: ${{ steps.s.outputs.key }}
  Job-level to workflow-level:
    on.workflow_call.outputs:<id>.value: ${ jobs.<job>.outputs.o }
  Consumption in caller:
    needs.<job>.outputs.<id>

10 Re-run Semantics
  Full re-run uses latest ref when not SHA
  Failed/specific job re-run uses original commit SHA

## Original Source
Reusing Workflows in GitHub Actions
https://docs.github.com/en/actions/using-workflows/reusing-workflows

## Digest of REUSABLE_WORKFLOWS

# Retrieved: 2024-07-30

# Access to Reusable Workflows
A reusable workflow can be invoked if one of the following conditions is met:
- Caller and called workflows reside in the same repository.
- Called workflow is in a public repository and organization allows public reusable workflows.
- Called workflow is in a private repository with explicit access policy permitting the caller.

# Using Runners
## GitHub-hosted
- Assignment evaluated using caller context only.
- Billing associated with caller repository.
- Cannot use GitHub-hosted runners from the called repository.

## Self-hosted
- Called workflows in same user/org can access self-hosted runners in:
  • Caller repository
  • Caller repository’s organization (if made available)

# Limitations
- Maximum of 4 nested workflow levels (caller + 3 reusable).
- Maximum 20 unique reusable workflows per top-level workflow (includes nested trees).
- Workflow-level env variables in caller are not propagated to called workflows.
- Workflow-level env variables in called workflows are not accessible to caller.
- GITHUB_ENV cannot pass values from caller job to called job steps.
- Use "vars" context for cross-workflow variables at org/repo/environment level.

# Creating a Reusable Workflow
File location: `.github/workflows/<file>.yml`
Required trigger:
```yaml
on:
  workflow_call:
```

# Defining Inputs and Secrets
```yaml
on:
  workflow_call:
    inputs:
      config-path:
        required: true
        type: string
    secrets:
      personal_access_token:
        required: true
```
Reference within job steps:
```yaml
jobs:
  job1:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.personal_access_token }}
          configuration-path: ${{ inputs.config-path }}
```

# Calling a Reusable Workflow
Within a job definition:
```yaml
jobs:
  deploy:
    uses: octo-org/repo/.github/workflows/reusable.yml@main
    with:
      config-path: .github/config.yml
    secrets:
      personal_access_token: ${{ secrets.PAT }}
```
Syntax options:
- `{owner}/{repo}/.github/workflows/{file}@{ref}`
- `./.github/workflows/{file}` (same repo, same commit)

# Matrix Strategy
```yaml
jobs:
  deploy-matrix:
    strategy:
      matrix:
        target: [dev,stage,prod]
    uses: octocat/octo-repo/.github/workflows/deployment.yml@v1
    with:
      target: ${{ matrix.target }}
```

# Supported Job Keywords
jobs.<job_id> may include only:
- name
- uses
- with, with.<input_id>
- secrets, secrets.<secret_id>, secrets: inherit
- strategy
- needs
- if
- concurrency
- permissions

# Nesting Reusable Workflows
Depth: up to 4 levels.
Example in called workflow:
```yaml
jobs:
  inner:
    uses: octo-org/repo/.github/workflows/another.yml@v1
```
Secrets propagate only one level at a time.

# Outputs from Reusable Workflows
Define job-level outputs:
```yaml
jobs:
  example_job:
    runs-on: ubuntu-latest
    outputs:
      o1: ${{ steps.s1.outputs.first }}
      o2: ${{ steps.s2.outputs.second }}
    steps:
      - id: s1
        run: echo "first=hello" >> $GITHUB_OUTPUT
      - id: s2
        run: echo "second=world" >> $GITHUB_OUTPUT
```
Map to workflow outputs:
```yaml
on:
  workflow_call:
    outputs:
      firstword:
        value: ${{ jobs.example_job.outputs.o1 }}
      secondword:
        value: ${{ jobs.example_job.outputs.o2 }}
```
Consume in caller:
```yaml
jobs:
  job2:
    needs: job1
    runs-on: ubuntu-latest
    steps:
      - run: echo ${{ needs.job1.outputs.firstword }} ${{ needs.job1.outputs.secondword }}
```

# Troubleshooting
- Redirects not supported: workflows fail if owner/name changes.
- Permission errors: ensure Actions settings permit reusable workflows and access policy on private repos.
- Re-run behavior:
  • Re-running all jobs uses latest ref if not SHA.
  • Re-running failed/specific jobs uses same SHA as first run.

# Attribution
Source: GitHub Actions "Reusing workflows" documentation
Data Size: 948149 bytes


## Attribution
- Source: Reusing Workflows in GitHub Actions
- URL: https://docs.github.com/en/actions/using-workflows/reusing-workflows
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T18:29:47.647Z
- Data Size: 948149 bytes
- Links Found: 16506

## Retrieved
2025-05-10
sandbox/library/OPENAI_API.md
# sandbox/library/OPENAI_API.md
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
sandbox/library/ZOD_CORE.md
# sandbox/library/ZOD_CORE.md
# ZOD_CORE

## Crawl Summary
Basic schema creation: z.string(), z.number(), z.boolean(), z.date(), z.object(), z.array(), z.union(), etc. Coercion methods map inputs via JS constructors. String validations: min, max, length, email, url, uuid, regex, datetime(options). Number validations: min/gte, max/lte, gt, lt, int, positive, nonnegative, negative, nonpositive, multipleOf. Parsing methods: .parse, .parseAsync, .safeParse, .safeParseAsync, .spa alias. Error handling via safeParse and flatten().

## Normalised Extract
Table of Contents:
1. Schema Creation
2. Primitive Types
3. Coercion
4. String Validations
5. Number Validations
6. Parsing Methods

1. Schema Creation
- import { z } from "zod";
- z.string(): ZodString
- z.number(): ZodNumber
- z.object(shape: Record<string,ZodType>): ZodObject
- z.array(type: ZodType): ZodArray
- z.union([types...]): ZodUnion

2. Primitive Types
- z.bigint(), z.boolean(), z.date(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

3. Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.bigint(): BigInt(input)
- z.coerce.date(): new Date(input)

4. String Validations
signature: z.string().method(params?) returns ZodString
dot methods:
min(length:number,{message?:string}), max(length,{message}), length(exact,{message}), email({message}), url({message}), uuid({message}), regex(regexp,{message}), datetime({offset:boolean,local:boolean,precision:number},{message})
ex: z.string().min(5,{message:"Min 5"}).email()

5. Number Validations
methods on z.number():
min(value:number,{message}), max(value,{message}), gt(value,{message}), lt(value,{message}), int({message}), positive({message}), nonnegative({message}), negative({message}), nonpositive({message}), multipleOf(value,{message})
ex: z.number().min(0).max(10).multipleOf(2)

6. Parsing Methods
.parse(data:unknown): T throws ZodError
.parseAsync(data:unknown): Promise<T>
.safeParse(data): { success:true; data:T }|{success:false; error:ZodError}
.safeParseAsync(data): Promise<...>
.spa(data): alias safeParseAsync

## Supplementary Details
Requirements: TypeScript 4.5+, tsconfig.json with strict:true. Installation: npm install zod | yarn add zod | deno add npm:zod | bun add zod | pnpm add zod. For canary: install zod@canary. Import: import { z } from "zod". Strict mode ensures type inference matches schema. Use .coerce methods for input conversion. Use .safeParse/async to avoid exceptions. Call .flatten().fieldErrors to extract field-level error messages.

## Reference Details
API Specifications:
Function: z.string(): ZodString
Function: z.number(): ZodNumber
Function: z.coerce.string(): ZodString
Interfaces:
interface ZodString {
  min(minLength: number, params?: { message?: string }): ZodString;
  max(maxLength: number, params?: { message?: string }): ZodString;
  length(exact: number, params?: { message?: string }): ZodString;
  email(params?: { message?: string }): ZodString;
  url(params?: { message?: string }): ZodString;
  uuid(params?: { message?: string }): ZodString;
  regex(regex: RegExp, params?: { message?: string }): ZodString;
  datetime(options?: { offset?: boolean; local?: boolean; precision?: number }, params?: { message?: string }): ZodString;
}
interface ZodNumber {
  min(value: number, params?: { message?: string }): ZodNumber;
  max(value: number, params?: { message?: string }): ZodNumber;
  gt(value: number, params?: { message?: string }): ZodNumber;
  lt(value: number, params?: { message?: string }): ZodNumber;
  int(params?: { message?: string }): ZodNumber;
  positive(params?: { message?: string }): ZodNumber;
  nonnegative(params?: { message?: string }): ZodNumber;
  negative(params?: { message?: string }): ZodNumber;
  nonpositive(params?: { message?: string }): ZodNumber;
  multipleOf(value: number, params?: { message?: string }): ZodNumber;
}
Parsing Methods:
parse(data: unknown): T throws ZodError
parseAsync(data: unknown): Promise<T>
safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>
spa(input: unknown): Promise<{ success: boolean }>
Implementation Pattern:
const schema = z.object({ id: z.string().uuid(), age: z.number().int().nonnegative() }).strict();
const { success, data, error } = await schema.spa(inputPayload);
if (!success) console.error(error.format()); else handle(data);

Best Practices:
• Enable strict mode in tsconfig to ensure type inference.
• Use .strict() on objects to disallow extra keys.
• Use .catchall() to validate unknown fields with a fallback schema.
• Prefer .safeParseAsync over try/catch around parse.

Troubleshooting:
Command: npx ts-node parse.ts
Error: ZodError: Required
→ Ensure input matches schema, use .optional() or .nullable() for missing fields.
Error: Non-Promise type
→ For promise schemas use .parseAsync or .safeParseAsync.


## Information Dense Extract
z.string(): ZodString; z.number(): ZodNumber; z.coerce.string()→String(input); z.coerce.number()→Number(input); z.string().min(n,{message})/.max(n)/.length(n)/.email()/.url()/.uuid()/.regex(r)/.datetime({offset?:boolean,local?:boolean,precision?:number}); z.number().min(n)/.max(n)/.gt(n)/.lt(n)/.int()/.positive()/.nonnegative()/.negative()/.nonpositive()/.multipleOf(n); parse(data:unknown):T throws; parseAsync(data):Promise<T>; safeParse(data):{success,data}|{success,error}; safeParseAsync; spa alias; install via npm/yarn/pnpm; import {z} from "zod"; tsconfig strict:true; use .safeParseAsync().flatten().fieldErrors; object.strict(); object.catchall(); array.min()/max()/nonempty(); union, tuple, map, set available.

## Sanitised Extract
Table of Contents:
1. Schema Creation
2. Primitive Types
3. Coercion
4. String Validations
5. Number Validations
6. Parsing Methods

1. Schema Creation
- import { z } from 'zod';
- z.string(): ZodString
- z.number(): ZodNumber
- z.object(shape: Record<string,ZodType>): ZodObject
- z.array(type: ZodType): ZodArray
- z.union([types...]): ZodUnion

2. Primitive Types
- z.bigint(), z.boolean(), z.date(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

3. Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.bigint(): BigInt(input)
- z.coerce.date(): new Date(input)

4. String Validations
signature: z.string().method(params?) returns ZodString
dot methods:
min(length:number,{message?:string}), max(length,{message}), length(exact,{message}), email({message}), url({message}), uuid({message}), regex(regexp,{message}), datetime({offset:boolean,local:boolean,precision:number},{message})
ex: z.string().min(5,{message:'Min 5'}).email()

5. Number Validations
methods on z.number():
min(value:number,{message}), max(value,{message}), gt(value,{message}), lt(value,{message}), int({message}), positive({message}), nonnegative({message}), negative({message}), nonpositive({message}), multipleOf(value,{message})
ex: z.number().min(0).max(10).multipleOf(2)

6. Parsing Methods
.parse(data:unknown): T throws ZodError
.parseAsync(data:unknown): Promise<T>
.safeParse(data): { success:true; data:T }|{success:false; error:ZodError}
.safeParseAsync(data): Promise<...>
.spa(data): alias safeParseAsync

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_CORE

# Basic Usage

```typescript
import { z } from "zod";

const mySchema = z.string();
// parse throws on invalid
const result1: string = mySchema.parse("tuna");
// safeParse returns { success, data } or { success, error }
const safe1 = mySchema.safeParse(12);
// safe1: { success: false; error: ZodError }
```

# Primitives

- z.string(): ZodString instance
- z.number(): ZodNumber instance
- z.bigint(): ZodBigInt
- z.boolean(): ZodBoolean
- z.date(): ZodDate
- z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

# Coercion for Primitives

```typescript
const s = z.coerce.string();
s.parse(12); // "12"
s.parse(true); // "true"
z.coerce.number().min(0);
```
Coercion mapping: z.coerce.string() → String(input)
z.coerce.number() → Number(input)
z.coerce.boolean() → Boolean(input)
z.coerce.bigint() → BigInt(input)
z.coerce.date() → new Date(input)

# String Validations

Method signatures:
- .min(length: number, params?: { message?: string }): ZodString
- .max(length: number, params?: { message?: string }): ZodString
- .length(exact: number, params?: { message?: string }): ZodString
- .email(params?: { message?: string }): ZodString
- .url(params?: { message?: string }): ZodString
- .uuid(params?: { message?: string }): ZodString
- .regex(regex: RegExp, params?: { message?: string }): ZodString
- .datetime(options?: { offset?: boolean; local?: boolean; precision?: number }, params?: { message?: string }): ZodString

Examples:
```typescript
z.string().min(5, { message: "Too short" }).max(10)
const dt = z.string().datetime({ offset: true, precision: 3 });
dt.parse("2020-01-01T00:00:00+02:00");
```

# Number Validations

Method signatures:
- .min(value: number, params?: { message?: string }): ZodNumber (alias .gte)
- .max(value: number, params?: { message?: string }): ZodNumber (alias .lte)
- .gt(value: number, params?: { message?: string }): ZodNumber
- .lt(value: number, params?: { message?: string }): ZodNumber
- .int(params?: { message?: string }): ZodNumber
- .positive(params?: { message?: string }): ZodNumber
- .nonnegative(params?: { message?: string }): ZodNumber
- .negative(params?: { message?: string }): ZodNumber
- .nonpositive(params?: { message?: string }): ZodNumber
- .multipleOf(value: number, params?: { message?: string }): ZodNumber
```
```typescript
z.number().min(0).max(100).multipleOf(5)
z.number().int().positive()
```

# Parsing Methods

```typescript
.parse(data: unknown): T // throws ZodError
.parseAsync(data: unknown): Promise<T>
.safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
.safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>
.spa(data): alias for safeParseAsync
```

Error handling:
```typescript
const res = schema.safeParse(input);
if (!res.success) {
  console.error(res.error.flatten().fieldErrors);
} else {
  use(res.data);
}
```

## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-10T09:44:29.003Z
- Data Size: 905457 bytes
- Links Found: 6164

## Retrieved
2025-05-10
sandbox/library/JSYAML.md
# sandbox/library/JSYAML.md
# JSYAML

## Crawl Summary
Installation via npm, CLI flags, methods: load, loadAll, dump with full option sets, supported schemas, tag styles, YAML types mapping.

## Normalised Extract
Table of Contents
1. Installation
2. CLI Usage
3. API Methods
   3.1 load
   3.2 loadAll
   3.3 dump
4. Schemas
5. Tag Styles
6. Supported Types

1. Installation
npm install js-yaml
npm install -g js-yaml

2. CLI Usage
Command: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

3. API Methods
3.1 load(string, options)
options:
  filename: string|null (default null)
  onWarning: function(YAMLException)
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA (default DEFAULT_SCHEMA)
  json: boolean (default false)
Returns: object|string|number|null|undefined or throws YAMLException

3.2 loadAll(string, iterator, options)
iterator: function(doc)
Returns: void or array of documents

3.3 dump(object, options)
options:
  indent: number (default 2)
  noArrayIndent: boolean (default false)
  skipInvalid: boolean (default false)
  flowLevel: number (default -1)
  styles: map<string,string>
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA
  sortKeys: boolean|function
  lineWidth: number (default 80)
  noRefs: boolean (default false)
  noCompatMode: boolean (default false)
  condenseFlow: boolean (default false)
  quotingType: '"' or "'" (default '\'')
  forceQuotes: boolean (default false)
  replacer: function(key,value)
Returns: string

4. Schemas
FAILSAFE_SCHEMA: strings, arrays, objects
JSON_SCHEMA: JSON types
CORE_SCHEMA: same as JSON_SCHEMA
DEFAULT_SCHEMA: all YAML types

5. Tag Styles
!!null: "~"|"null"|"NULL"|"Null"|""
!!int: "0b..."|"0o..."|"decimal"|"0x..."
!!bool: "true"|"false" in cases
!!float: ".nan"|".inf"

6. Supported Types
null, bool, int, float, binary, timestamp, omap, pairs, set, str, seq, map

## Supplementary Details
Schemas definitions: FAILSAFE (strings, arrays, objects), JSON (JSON types), CORE (JSON), DEFAULT (all). Filename option used in error messages. onWarning callback receives YAMLException. json=true makes duplicate keys override. dump.skipInvalid skips non-serializable types. flowLevel controls transition to flow style. styles map tag to style. sortKeys can be comparator. lineWidth max length. noRefs disables references. noCompatMode disables YAML1.1 compat. condenseFlow removes spaces. quotingType sets wrapper. forceQuotes quotes all strings. replacer applied like JSON.stringify.

## Reference Details
// load
function load(string, options?) => any
Parameters:
  string: input YAML
  options.filename: string|null
  options.onWarning(e: YAMLException): void
  options.schema: Schema
  options.json: boolean
Throws: YAMLException

// loadAll
function loadAll(string, iterator, options?) => any[]|void
Parameters:
  string: input
  iterator(doc:any): void
  options same as load

// dump
function dump(object:any, options?) => string
Parameters:
  indent: number
  noArrayIndent: boolean
  skipInvalid: boolean
  flowLevel: number
  styles: Record<string,string>
  schema: Schema
  sortKeys: boolean|function
  lineWidth: number
  noRefs: boolean
  noCompatMode: boolean
  condenseFlow: boolean
  quotingType: '"'|'\''
  forceQuotes: boolean
  replacer(key,value): any

Best Practices:
- Use DEFAULT_SCHEMA unless strict JSON needed
- Set skipInvalid=true to ignore functions
- Set sortKeys for predictable output
- Use flowLevel=0 for full flow style
- Use condenseFlow for URL query params

Troubleshooting:
Command: js-yaml file.yml
Error: YAMLException: at line X, column Y
Fix: Validate indentation, ensure proper key-value syntax
Use --trace to see stack

## Information Dense Extract
install npm js-yaml|global for CLI; CLI flags -h,-v,-c,-t; API load(string,options{filename, onWarning, schema, json})->any|throws YAMLException; loadAll(string,iterator,options)->any[]|void; dump(obj,options{indent, noArrayIndent, skipInvalid, flowLevel, styles, schema, sortKeys, lineWidth, noRefs, noCompatMode, condenseFlow, quotingType, forceQuotes, replacer})->string; schemas=FAILSAFE(only str,arr,obj), JSON, CORE(JSON), DEFAULT(all); json:true overrides dup keys; skipInvalid:true skips non-serializable; flowLevel controls style transition; styles:tag->style; sortKeys:boolean|fn; quotingType="'"|"\""; condenseFlow removes spaces; supported tags: !!null,!!int,!!bool,!!float with style variants; types: null,bool,int,float,binary,timestamp,omap,pairs,set,str,seq,map.

## Sanitised Extract
Table of Contents
1. Installation
2. CLI Usage
3. API Methods
   3.1 load
   3.2 loadAll
   3.3 dump
4. Schemas
5. Tag Styles
6. Supported Types

1. Installation
npm install js-yaml
npm install -g js-yaml

2. CLI Usage
Command: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

3. API Methods
3.1 load(string, options)
options:
  filename: string|null (default null)
  onWarning: function(YAMLException)
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA (default DEFAULT_SCHEMA)
  json: boolean (default false)
Returns: object|string|number|null|undefined or throws YAMLException

3.2 loadAll(string, iterator, options)
iterator: function(doc)
Returns: void or array of documents

3.3 dump(object, options)
options:
  indent: number (default 2)
  noArrayIndent: boolean (default false)
  skipInvalid: boolean (default false)
  flowLevel: number (default -1)
  styles: map<string,string>
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA
  sortKeys: boolean|function
  lineWidth: number (default 80)
  noRefs: boolean (default false)
  noCompatMode: boolean (default false)
  condenseFlow: boolean (default false)
  quotingType: ''' or ''' (default '''')
  forceQuotes: boolean (default false)
  replacer: function(key,value)
Returns: string

4. Schemas
FAILSAFE_SCHEMA: strings, arrays, objects
JSON_SCHEMA: JSON types
CORE_SCHEMA: same as JSON_SCHEMA
DEFAULT_SCHEMA: all YAML types

5. Tag Styles
!!null: '~'|'null'|'NULL'|'Null'|''
!!int: '0b...'|'0o...'|'decimal'|'0x...'
!!bool: 'true'|'false' in cases
!!float: '.nan'|'.inf'

6. Supported Types
null, bool, int, float, binary, timestamp, omap, pairs, set, str, seq, map

## Original Source
js-yaml Documentation
https://github.com/nodeca/js-yaml

## Digest of JSYAML

# JS-YAML Technical Digest (Retrieved 2024-07-12)

## Installation

npm install js-yaml
npm install -g js-yaml  # for CLI

## CLI Usage

js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

- --compact: errors in compact mode
- --trace: show stack trace

## API Methods

### load(string, options)
Signature: load(string: string, options?: {
  filename?: string;
  onWarning?: (e: YAMLException) => void;
  schema?: Schema;
  json?: boolean;
}) : any

### loadAll(string, iterator?, options?)
Signature: loadAll(string: string, iterator?: (doc: any) => void, options?: {
  filename?: string;
  onWarning?: (e: YAMLException) => void;
  schema?: Schema;
  json?: boolean;
}) : any[] | void

### dump(object, options?)
Signature: dump(object: any, options?: {
  indent?: number;
  noArrayIndent?: boolean;
  skipInvalid?: boolean;
  flowLevel?: number;
  styles?: Record<string,string>;
  schema?: Schema;
  sortKeys?: boolean | ((a:any,b:any)=>number);
  lineWidth?: number;
  noRefs?: boolean;
  noCompatMode?: boolean;
  condenseFlow?: boolean;
  quotingType?: '"' | "'";
  forceQuotes?: boolean;
  replacer?: (key:any,value:any)=>any;
}) : string

## Schemas

- FAILSAFE_SCHEMA
- JSON_SCHEMA
- CORE_SCHEMA
- DEFAULT_SCHEMA

## Styles by Tag

Tag       Canonical Lowercase Uppercase Camelcase Empty
!!null    ~         null      NULL      Null      ''
!!int     binary    octal     decimal   hex      -
!!bool    true/false TRUE/FALSE True/False -        -
!!float   .nan/.inf .nan/.inf .NAN/.INF .NaN/.Inf -

## Supported Types

- null, bool, number, string, buffer, date, array, object, pairs, omap, set


## Attribution
- Source: js-yaml Documentation
- URL: https://github.com/nodeca/js-yaml
- License: License: MIT
- Crawl Date: 2025-05-10T20:57:13.656Z
- Data Size: 1012204 bytes
- Links Found: 5597

## Retrieved
2025-05-10
