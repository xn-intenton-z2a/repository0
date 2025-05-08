# AGENT_CONFIG

## Crawl Summary
YAML schema for agentic-lib workflows configuration defining schedule identifier, file path mappings with write permissions and limits, npm build/test/start commands, issue and branch attempt limits, web doc root, sandbox reset path, and discussion bot seed file.

## Normalised Extract
Table of Contents
1 schedule
2 paths mapping
3 execution commands
4 issue and attempt limits
5 web publishing
6 sandbox configuration
7 discussionBot configuration

1 schedule
 schedule: schedule-2

2 paths mapping
 missionFilepath.path = MISSION.md
 librarySourcesFilepath.path = sandbox/SOURCES.md, permissions = write, limit = 16
 libraryDocumentsPath.path = sandbox/library/, permissions = write, limit = 64
 featuresPath.path = sandbox/features/, permissions = write, limit = 8
 contributingFilepath.path = CONTRIBUTING.md
 targetTestsPath.path = sandbox/tests/, permissions = write
 otherTestsPaths.paths = [tests/unit/]
 targetSourcePath.path = sandbox/source/, permissions = write
 otherSourcePaths.paths = [src/lib/]
 dependenciesFilepath.path = package.json, permissions = write
 documentationPath.path = sandbox/docs/, permissions = write
 formattingFilepath.path = .prettierrc
 lintingFilepath.path = eslint.config.js
 readmeFilepath.path = README.md

3 execution commands
 buildScript = npm run build
testScript = npm test
mainScript = npm run start

4 issue and attempt limits
 featureDevelopmentIssuesWipLimit = 3
 maintenanceIssuesWipLimit = 3
 attemptsPerBranch = 2
 attemptsPerIssue = 1

5 web publishing
 docRoot = public

6 sandbox configuration
 sandboxReset = true
 sandboxPath = sandbox

7 discussionBot configuration
 seedDiscussionFilepath = SEED_DISCUSSION.md

## Supplementary Details
Workflows load agentic-lib.yml at repository root. 'schedule' selects the predefined schedule in schedule-2. 'paths' mapping provides filepaths and permission controls used by elaborator, engineer, and maintainer workflows; 'limit' enforces maximum document count. Execution commands invoked in CI: buildScript, testScript, mainScript. Issue and attempt limits control how many concurrent issues and retries per branch and issue: 3 issues WIP, 2 attempts per branch, 1 per issue. 'docRoot' passed to publish-web.yml for GitHub Pages. 'sandboxReset' and 'sandboxPath' reset and locate sandbox directory. 'seedDiscussionFilepath' used by discussionBot workflows to seed new threads.

## Reference Details
JSON Schema:
{
  type: 'object',
  properties: {
    schedule: { type: 'string', enum: ['schedule-1','schedule-2','schedule-3'] },
    paths: {
      type: 'object',
      properties: {
        missionFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        librarySourcesFilepath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        libraryDocumentsPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        featuresPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } }, limit: { type: 'integer' } }, required: ['path','permissions','limit'] },
        contributingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        targetTestsPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        otherTestsPaths: { type: 'object', properties: { paths: { type: 'array', items: { type: 'string' } } }, required: ['paths'] },
        targetSourcePath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        otherSourcePaths: { type: 'object', properties: { paths: { type: 'array', items: { type: 'string' } } }, required: ['paths'] },
        dependenciesFilepath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        documentationPath: { type: 'object', properties: { path: { type: 'string' }, permissions: { type: 'array', items: { type: 'string' } } }, required: ['path','permissions'] },
        formattingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        lintingFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] },
        readmeFilepath: { type: 'object', properties: { path: { type: 'string' } }, required: ['path'] }
      },
      required: ['missionFilepath','librarySourcesFilepath','libraryDocumentsPath','featuresPath']
    },
    buildScript: { type: 'string' },
    testScript: { type: 'string' },
    mainScript: { type: 'string' },
    featureDevelopmentIssuesWipLimit: { type: 'integer', minimum: 1 },
    maintenanceIssuesWipLimit: { type: 'integer', minimum: 1 },
    attemptsPerBranch: { type: 'integer', minimum: 1 },
    attemptsPerIssue: { type: 'integer', minimum: 1 },
    docRoot: { type: 'string' },
    sandbox: { type: 'object', properties: { sandboxReset: { type: 'boolean' }, sandboxPath: { type: 'string' } }, required: ['sandboxReset','sandboxPath'] },
    discussionBot: { type: 'object', properties: { seedDiscussionFilepath: { type: 'string' } }, required: ['seedDiscussionFilepath'] }
  },
  required: ['schedule','paths','buildScript','testScript','mainScript']
}

Example Usage in JS:
import fs from 'fs'
import yaml from 'yaml'
const config = yaml.parse(fs.readFileSync('agentic-lib.yml','utf8'))
// validate config against schema before running workflows

// sample GitHub Actions call
jobs:
  run_build:
    uses: ./.github/workflows/publish-web.yml@main
    with:
      docRoot: public


## Information Dense Extract
schedule=schedule-2; path.mission=MISSION.md; path.librarySources=sandbox/SOURCES.md perms=[write] limit=16; path.libraryDocs=sandbox/library/ perms=[write] limit=64; path.features=sandbox/features/ perms=[write] limit=8; contributing=CONTRIBUTING.md; tests.target=sandbox/tests/ perms=[write]; tests.other=[tests/unit/]; source.target=sandbox/source/ perms=[write]; source.other=[src/lib/]; deps=package.json perms=[write]; docs=sandbox/docs/ perms=[write]; formatting=.prettierrc; linting=eslint.config.js; readme=README.md; build=npm run build; test=npm test; start=npm run start; issueWIP=3; maintenanceWIP=3; attempts.branch=2; attempts.issue=1; webRoot=public; sandbox.reset=true; sandbox.path=sandbox; discussion.seed=SEED_DISCUSSION.md

## Sanitised Extract
Table of Contents
1 schedule
2 paths mapping
3 execution commands
4 issue and attempt limits
5 web publishing
6 sandbox configuration
7 discussionBot configuration

1 schedule
 schedule: schedule-2

2 paths mapping
 missionFilepath.path = MISSION.md
 librarySourcesFilepath.path = sandbox/SOURCES.md, permissions = write, limit = 16
 libraryDocumentsPath.path = sandbox/library/, permissions = write, limit = 64
 featuresPath.path = sandbox/features/, permissions = write, limit = 8
 contributingFilepath.path = CONTRIBUTING.md
 targetTestsPath.path = sandbox/tests/, permissions = write
 otherTestsPaths.paths = [tests/unit/]
 targetSourcePath.path = sandbox/source/, permissions = write
 otherSourcePaths.paths = [src/lib/]
 dependenciesFilepath.path = package.json, permissions = write
 documentationPath.path = sandbox/docs/, permissions = write
 formattingFilepath.path = .prettierrc
 lintingFilepath.path = eslint.config.js
 readmeFilepath.path = README.md

3 execution commands
 buildScript = npm run build
testScript = npm test
mainScript = npm run start

4 issue and attempt limits
 featureDevelopmentIssuesWipLimit = 3
 maintenanceIssuesWipLimit = 3
 attemptsPerBranch = 2
 attemptsPerIssue = 1

5 web publishing
 docRoot = public

6 sandbox configuration
 sandboxReset = true
 sandboxPath = sandbox

7 discussionBot configuration
 seedDiscussionFilepath = SEED_DISCUSSION.md

## Original Source
intentïon agentic-lib Workflows
https://github.com/xn-intenton-z2a/agentic-lib

## Digest of AGENT_CONFIG

# Agent Configuration Schema

Date Retrieved: 2025-04-02

## schedule

schedule: schedule-2

## paths mapping

missionFilepath:
  path: MISSION.md

librarySourcesFilepath:
  path: sandbox/SOURCES.md
  permissions: [write]
  limit: 16

libraryDocumentsPath:
  path: sandbox/library/
  permissions: [write]
  limit: 64

featuresPath:
  path: sandbox/features/
  permissions: [write]
  limit: 8

contributingFilepath:
  path: CONTRIBUTING.md

targetTestsPath:
  path: sandbox/tests/
  permissions: [write]

otherTestsPaths:
  paths: [tests/unit/]

targetSourcePath:
  path: sandbox/source/
  permissions: [write]

otherSourcePaths:
  paths: [src/lib/]

dependenciesFilepath:
  path: package.json
  permissions: [write]

documentationPath:
  path: sandbox/docs/
  permissions: [write]

formattingFilepath:
  path: .prettierrc

lintingFilepath:
  path: eslint.config.js

readmeFilepath:
  path: README.md

## execution commands

buildScript: npm run build
testScript: npm test
mainScript: npm run start

env keys required by workflows: CHATGPT_API_SECRET_KEY, GITHUB_TOKEN

## issue and attempt limits

featureDevelopmentIssuesWipLimit: 3
maintenanceIssuesWipLimit: 3
attemptsPerBranch: 2
attemptsPerIssue: 1

## web publishing

docRoot: public

## sandbox configuration

sandboxReset: true
sandboxPath: sandbox

## discussionBot configuration

seedDiscussionFilepath: SEED_DISCUSSION.md


## Attribution
- Source: intentïon agentic-lib Workflows
- URL: https://github.com/xn-intenton-z2a/agentic-lib
- License: License: MIT
- Crawl Date: 2025-05-08T18:31:05.022Z
- Data Size: 682118 bytes
- Links Found: 4507

## Retrieved
2025-05-08
