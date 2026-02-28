Extract and condense the most valuable and impactful technical details from the supplied crawl result. Focus on information that delivers substantial user value and addresses core implementation needs.
Before adding a new document, ensure that this document is distinct from any other document in the library, otherwise update an existing document. Prioritize content that directly enhances the product's primary purpose rather than superficial or redundant information.
The document name should be one or two words in SCREAMING_SNAKECASE.

You should extract a section from the sources file to create the document. Each document should contain high-value, actionable content that solves real implementation problems. Focus on:

1. A normalised extract of the crawled content containing:
   a. The most impactful key technical points that directly enable implementation, not summaries of them
   b. A focused table of contents listing the specific technical topics that provide the greatest practical value
   c. The actual detailed information for each item in the table of contents, prioritizing content that enables immediate application
2. A supplementary details section containing the essential technical specifications and implementation details that complement the crawled content and address core functionality needs
3. A reference details section containing the critical API specifications, complete SDK method signatures with parameters
   and return types, exact implementation patterns, specific configuration options with their values
   and effects, concrete best practices with implementation examples, step-by-step troubleshooting procedures, and
   detailed instructional material. Focus on specifications that deliver substantial user value. Do not describe what specifications exist, include the actual specifications themselves.
4. A detailed digest containing the most valuable technical content from the source section in SOURCES.md and the date when the
   content was retrieved (current date)
5. Attribution information and data size obtained during crawling

The normalised extract may describe APIs but should avoid code examples that themselves quote or escape.
Don't use any Markdown shell or code escape sequences in the normalised extract.
Don't use any quote escape sequences in the normalised extract.

Generally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape
sequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.

For the normalised extract, extract the most valuable technical information from the crawled data and present it in a condensed,
directly usable format that solves real implementation problems. Focus on high-impact content that enables immediate application.
Do not describe what information exists, include the actual information itself. The content must be specific, technical,
and immediately applicable to core functionality needs. Each item in the table of contents must have the essential
technical details that thoroughly explain the implementation while prioritizing content that delivers substantial user value.
