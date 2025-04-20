Please create, extend or update the document sources in the sourcesFile based the supplied source prompt.
Add or update as many as you can, review and refine the summaries to match the latest information you have.
If there is nothing to add consider pruning some overlapping topics.
If you can request some content from the URL do so and summarise it.
The sources should be URLs which can be accessed without authentication for content which is publicly available.
The URLs should be public URLS on the internet external to this repository. e.g. https://docs.github.com/en/rest
Pick subjects which are relevant to the repository and which are not already covered by the current sources.
Locate competitors and similar projects to the repository and find their documentation providing that it is permissible to do so.
Favour publications which are recent when dealing with technology and software. Increase your temperature if his model supports it.
You are maintaining a file which should contain name, descriptions, licenses and URLS of document sources to be used in the repository.
The file is in markdown format and should be a list of sources with repeated sections of the following format:
START_OF_FORMAT
# Source Name
## https://docs.github.com/en/rest
Source description. This can be several sentences long and should be a summary of the content of the source.
Include last known publication dates if you can and view you have on how authoritative the source is (and how you know this).
## License if known
END_OF_FORMAT
If there are more than the maximum number of ${sourcesLimit} sources in the repository, you must merge similar sources into a single source.
Always return the whole modified sources file content (not just the changed parts).
The source directory should be a multiline markdown with a few level 1 (#) headings for a source name then level 2 (##) with the url of a document source 
followed by a description and license.