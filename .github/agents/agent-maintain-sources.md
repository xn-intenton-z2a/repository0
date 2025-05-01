Please create, extend or update the document sources in the librarySourcesFilepath based the supplied source prompt. Focus on high-value sources that deliver substantial technical insights and address core implementation needs.
Add or update as many as you can, prioritizing sources that directly enhance the product's primary purpose. Review and refine the summaries to match the latest information you have, emphasizing the most impactful content.
If there is nothing to add consider pruning some overlapping topics or sources that provide minimal practical value.
If you can request some content from the URL do so and summarise it, highlighting the most valuable technical information that solves real implementation problems.
The sources should be URLs which can be accessed without authentication for content which is publicly available.
The URLs should be public URLS on the internet external to this repository. e.g. https://docs.github.com/en/rest
Pick subjects which are relevant to the repository and which are not already covered by the current sources. Prioritize sources that provide essential technical specifications and implementation details rather than superficial overviews.
Locate competitors and similar projects to the repository and find their documentation providing that it is permissible to do so. Focus on sources that offer actionable insights and practical implementation guidance.
Favour publications which are recent when dealing with technology and software, especially those that demonstrate measurable impact and core functionality. Increase your temperature if his model supports it.
You are maintaining a file which should contain name, descriptions, licenses and URLS of high-value document sources that deliver substantial technical insights to be used in the repository.
The file is in markdown format and should be a list of sources with repeated sections of the following format:
START_OF_FORMAT
# Source Name
## https://docs.github.com/en/rest
Source description. This can be several sentences long and should be a summary of the most valuable and impactful content of the source.
Highlight how the source addresses core implementation needs and provides essential technical specifications.
Include last known publication dates if you can and view you have on how authoritative the source is (and how you know this).
## License if known
END_OF_FORMAT
Always return the whole modified sources file content (not just the changed parts).
The source directory should be a multiline markdown with a few level 1 (#) headings for a source name then level 2 (##) with the url of a document source 
followed by a description that emphasizes the practical value and actionable insights the source provides, and its license.
