# EJS_CORE

## Crawl Summary
Scriptlet tags: <% code %>, <%= value %>, <%- value %>. Compiles templates to JavaScript functions and caches them in memory keyed by filename. Rendering errors throw JavaScript exceptions including template file path and line number. Active open source development on GitHub.

## Normalised Extract
Table of Contents
1 Syntax
2 Performance
3 Debugging

1 Syntax
   Use JavaScript in scriptlet tags to control output:
     <% code %> for logic without rendering output
     <%= value %> for HTML-escaped output
     <%- value %> for raw HTML output

2 Performance
   Template files are compiled into JS functions once and stored in an in-memory cache keyed by the template file path, reducing compilation overhead on repeated renders.

3 Debugging
   Runtime errors during template rendering throw standard JavaScript exceptions augmented with the originating template file path and line number for precise troubleshooting.

## Supplementary Details
Uses three scriptlet tag forms: control-flow, escaped output, raw output. In-memory cache holds compiled template functions; cache invalidated when template file changes. Exceptions include message: 'Error in template at TEMPLATE_PATH:LINE:COLUMN'. Community contributions via GitHub repository ejs/ejs.

## Reference Details
None of the core API method signatures or configuration options were available in the provided crawl content.

## Information Dense Extract
Syntax: <% code %>, <%= value %>, <%- value %>. Cache: compiled JS functions per template file in memory. Errors: JS exceptions with template path and line number. Active development: GitHub repository with issue/PR support.

## Sanitised Extract
Table of Contents
1 Syntax
2 Performance
3 Debugging

1 Syntax
   Use JavaScript in scriptlet tags to control output:
     <% code %> for logic without rendering output
     <%= value %> for HTML-escaped output
     <%- value %> for raw HTML output

2 Performance
   Template files are compiled into JS functions once and stored in an in-memory cache keyed by the template file path, reducing compilation overhead on repeated renders.

3 Debugging
   Runtime errors during template rendering throw standard JavaScript exceptions augmented with the originating template file path and line number for precise troubleshooting.

## Original Source
EJS Templating Engine
https://ejs.co/#docs

## Digest of EJS_CORE

# Syntax

Use plain JavaScript in scriptlet tags:

<% code %>    control flow without output
<%= value %>  escaped output
<%- value %>  unescaped output

# Performance

EJS caches compiled JavaScript functions per template file in memory. Cache is keyed by the template filename.

# Debugging

Errors during rendering throw JavaScript exceptions with template file path and line number included.

# Community

Library is under active development with issue and pull request support on GitHub.

Retrieved 2024-06-30 from https://ejs.co/#docs
Data Size: 8029 bytes
Links Found: 26

## Attribution
- Source: EJS Templating Engine
- URL: https://ejs.co/#docs
- License: License: MIT
- Crawl Date: 2025-05-13T06:29:53.711Z
- Data Size: 8029 bytes
- Links Found: 26

## Retrieved
2025-05-13
