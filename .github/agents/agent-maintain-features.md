---
description: Generate or update software feature specifications aligned with the mission
---

## Available Tools

The following tools are available during the Copilot SDK session:

- `read_file` — Read feature specs, mission file, source code, and library documents
- `write_file` — Create, update, or delete feature spec files (features/ directory, writable paths only)
- `list_files` — List files in a directory
- `list_issues` — List GitHub issues with optional state/label/sort filters (closed issues indicate completed features)
- `get_issue` — Get full details of a GitHub issue including comments
- `create_issue` — Create a new GitHub issue with title, body, and labels
- `list_prs` — List open pull requests for the repository
- `list_discussions` / `search_discussions` / `fetch_discussion` — Query GitHub Discussions
- `comment_on_issue` — Add a comment to a GitHub issue

Note: `run_tests` is excluded — this agent manages feature specifications, not code. `dispatch_workflow`, `close_issue`, `label_issue`, and `post_discussion_comment` are also excluded.

Note: This session has a tool-call cap derived from the `max-tokens-per-maintain` config (~5000 tokens per tool call). Be concise and avoid unnecessary tool calls to stay within budget.

## Context Provided

The task handler passes the following context in the prompt:

- **Mission text** — Full contents of MISSION.md
- **Current feature files** — Count and list of existing feature files with approximate sizes (e.g. "HTTP_SERVER.md (~12 lines, 480 bytes)")
- **Library documents** — Count and list of library docs with sizes (for inspiration and reference)
- **Feature limit** — Maximum number of feature files allowed (from config)
- **Writable paths** — Which file paths you may write to
- **Read-only paths** — Which file paths are for context only (do not modify)
- **Token budget constraint** — Approximate token budget displayed in the constraints section. Be concise to stay within budget.
- **Agent instructions** — Task-specific instructions (or default: "Maintain the feature set by creating, updating, or pruning features")
- **Attachments** — intentïon.md log file and/or screenshot (if available)

## Feature Generation

Please generate the name and specification for a software feature which will be added or updated to action the supplied feature prompt.
Features must advance the mission stated in MISSION.md. Aim for achievable outcomes within a single repository, not a grandiose vision or bloated feature set.

You may only create features to only change the source file, test file, README file, dependencies file, and examples directory content. You may not create features that request new files, delete existing files, or change the other files provided in the prompt context.
If there are more than the maximum number of features in the repository, you may delete a feature but preferably, you should identify an existing feature that is most similar or related to the new feature and modify it to incorporate aspects of the new feature.
All existing features could be retained, with one being enhanced to move towards accommodating the new feature.

Avoid code examples in the feature that themselves quote or escape.
Don't use any Markdown shell or code escape sequences in the feature text.
Don't use any quote escape sequences in the feature text.

Generally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape
sequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.

The feature will be iterated upon to incrementally advance the mission. New features should be thematically distinct from other features.
If a significant feature of the repository is not present in the current feature set, please add it either to a new feature or an existing feature.
Before adding a new feature ensure that this feature is distinct from any other feature in the repository, otherwise update an existing feature.
When updating an existing feature, ensure that the existing aspects are not omitted in the response, provide the full feature spec.
The feature name should be one or two words in SCREAMING_SNAKECASE.
Use library documents for inspiration and as resources for the detail of the feature.
Consider the contents of the library documents for similar products and avoid duplication where we can use a library.
Any new feature should not be similar to any of the rejected features and steer existing features away from the rejected features.
The feature spec should be a detailed description of the feature, compatible with the guidelines in CONTRIBUTING.md.
You may also just update a feature spec to bring it to a high standard matching other features in the repository.
A feature can be added based on a behaviour already present in the repository described within the guidelines in CONTRIBUTING.md.
Features must be achievable in a single software repository not part of a corporate initiative.
The feature spec should be a multiline markdown with a few level 1 headings.
The feature must be compatible with the mission statement in MISSION.md and ideally realise part of the value in the mission.

## Context Gathering

Before generating or updating features, gather context:

1. **Check GitHub Discussions** — use `search_discussions` to find user feature requests and feedback. Users often suggest features or express priorities in discussions that should inform which features to create or prioritise.
2. **Read intentïon.md** (attached) — examine the narrative for which features have been successfully implemented and which have caused problems. Propose features that build on successful patterns rather than repeating problematic ones.
3. **Review open issues** — use `list_issues` to see what work is already planned. Avoid creating features that duplicate existing issue scope.
The feature must be something that can be realised in a single source file (as below), ideally just as a library, CLI tool or possibly an HTTP API in combination with infrastructure as code deployment.
The repository also has a website in `src/web/` that uses the JS library. When proposing features, consider:
- The library API (`src/lib/main.js`) and its exports
- How the feature could be demonstrated on the website — features should be visible and interactive
- Unit tests (`tests/unit/`) that verify exact behaviour at the API level
- Behaviour tests (`tests/behaviour/`) that verify features work at a high navigational level through the website
- All layers (library, tests, website, web tests, behaviour tests) must change together in a single transform
