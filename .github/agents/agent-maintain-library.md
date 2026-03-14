---
description: Extract and condense technical details from sources into library documents
---

## Available Tools

The following tools are available during the Copilot SDK session:

- `read_file` — Read SOURCES.md, existing library documents, mission file, and other repository files
- `write_file` — Create, update, or delete library documents (library/ directory) and SOURCES.md (writable paths only)
- `list_files` — List files in a directory
- `run_command` — Run shell commands (e.g., `curl` to fetch URL content for extraction)

Note: This agent does NOT have a dedicated `web_search` tool. To fetch content from URLs in SOURCES.md, use `run_command` with `curl`. The Copilot SDK model may have some implicit browsing capability, but do not rely on it — use `curl` explicitly.

Note: `run_tests` is excluded — this agent manages library documents, not code. `dispatch_workflow`, `close_issue`, `label_issue`, and `post_discussion_comment` are also excluded.

Note: This session has a tool-call cap derived from the `max-tokens-per-maintain` config (~5000 tokens per tool call). Be concise and avoid unnecessary tool calls to stay within budget.

## Context Provided

The task handler operates in two modes depending on the state of SOURCES.md:

**Mode 1 — When SOURCES.md has URLs:**
- **Source list** — Full contents of SOURCES.md with URLs to crawl
- **Current library documents** — Count and list of existing library docs with sizes (e.g. "PLAYWRIGHT.md (~25 lines, 1000 bytes)")
- **Library limit** — Maximum number of library documents allowed (from config)
- **Task** — Extract technical content from each source URL into library documents. Create, update, or remove docs to match the sources.

**Mode 2 — When SOURCES.md is empty or has no URLs:**
- **Mission text** — Full contents of MISSION.md
- **Current SOURCES.md** — The current (empty) content
- **Task** — Research the mission topic and populate SOURCES.md with 3-8 relevant reference URLs (official docs, Wikipedia, MDN, npm packages).

**Common to both modes:**
- **Writable paths** — Which file paths you may write to
- **Read-only paths** — Which file paths are for context only (do not modify)
- **Token budget constraint** — Approximate token budget displayed in the constraints section
- **Agent instructions** — Task-specific instructions (or default: "Maintain the library by updating documents from sources")
- **Attachments** — intentïon.md log file and/or screenshot (if available)

## Extraction Guidelines

Extract and condense the technical details from the supplied crawl result that are relevant to the mission.
Before adding a new document, ensure that this document is distinct from any other document in the library, otherwise update an existing document.
The document name should be one or two words in SCREAMING_SNAKECASE.

You should extract a section from the sources file to create the document. Each document should contain actionable technical content. Focus on:

1. A normalised extract of the crawled content containing:
   a. The key technical points that directly enable implementation, not summaries of them
   b. A focused table of contents listing the specific technical topics covered
   c. The actual detailed information for each item in the table of contents
2. A supplementary details section containing the technical specifications and implementation details that complement the crawled content
3. A reference details section containing the critical API specifications, complete SDK method signatures with parameters
   and return types, exact implementation patterns, specific configuration options with their values
   and effects, concrete best practices with implementation examples, step-by-step troubleshooting procedures, and
   detailed instructional material. Do not describe what specifications exist, include the actual specifications themselves.
4. A detailed digest containing the technical content from the source section in SOURCES.md and the date when the
   content was retrieved (current date)
5. Attribution information and data size obtained during crawling

The normalised extract may describe APIs but should avoid code examples that themselves quote or escape.
Don't use any Markdown shell or code escape sequences in the normalised extract.
Don't use any quote escape sequences in the normalised extract.

Generally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape
sequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.

For the normalised extract, extract the technical information from the crawled data and present it in a condensed,
directly usable format.
Do not describe what information exists, include the actual information itself. The content must be specific and technical.
Each item in the table of contents must have the technical details that thoroughly explain the implementation.

## Context Gathering

Before extracting library documents, gather context:

1. **Check GitHub Discussions** — use `search_discussions` to find technical context and user questions about the project's dependencies and tools. These discussions often contain implementation details that complement crawled content.
2. **Read intentïon.md** (attached) — look for technical challenges encountered during iterations. These highlight which library details are most needed by the transformation agents and should be prioritised in documentation.
