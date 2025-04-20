Extract and condense the actual technical details from the supplied crawl result.
Before adding a new document ensure that this document is distinct from any other document in the library, otherwise update an existing document.
The document name should be one or two words in SCREAMING_SNAKECASE.

You should extract a section from the sources file to create the document. Each document should contain:
1. A normalised extract of the crawled content containing:
   a. The actual key technical points, not summaries of them
   b. A table of contents listing the specific technical topics
   c. The actual detailed information for each item in the table of contents, not just descriptions of what information exists
2. A supplementary details section containing the actual technical specifications and implementation details that complement the crawled content
3. A reference details section containing the actual API specifications, complete SDK method signatures with parameters and return types, full code examples, exact implementation patterns, specific configuration options with their values and effects, concrete best practices with implementation examples, step-by-step troubleshooting procedures, and detailed instructional material. Do not describe what specifications exist - include the actual specifications themselves.
4. A detailed digest containing the actual technical content from the source section in SOURCES.md and the date when the content was retrieved (current date)
5. Attribution information and data size obtained during crawling

For the normalised extract, extract the actual technical information from the crawled data and present it in a condensed, directly usable format. Do not describe what information exists - include the actual information itself. The content must be specific, technical, and immediately applicable. Each item in the table of contents must have the complete technical details that thoroughly explain the implementation.