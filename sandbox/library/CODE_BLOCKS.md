# CODE_BLOCKS

## Crawl Summary
Indented code blocks: lines with ≥4-space indent form literal code content minus 4 spaces, cannot interrupt paragraphs without blank line, list indent takes precedence.  Fenced code blocks: opening fence /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/, closing fence /^ {0,3}(`{n,}|~{n,})[ \t]*$/, content unparsed text, indent removal equal to opening indent, info string allowed after opening fence, fence type and length must match, blocks interrupt paragraphs, no blank lines required.

## Normalised Extract
Table of Contents:
1. Indented Code Blocks
2. Fenced Code Blocks

1. Indented Code Blocks
Definition: lines with ≥4 spaces indentation constitute code block.  Blank-line-separated chunks.  Content = literal lines minus first 4 spaces.  Cannot start inside paragraph without blank line; list-indentation overrides.
Implementation details:
  - Detection regex: /^[ \t]{4,}/
  - Start: if prevLine is blank or non-paragraph, and line matches regex.
  - End: first non-blank line with <4 spaces indent.
  - Content extraction: strip exactly 4 leading spaces; retain extra spaces/tabs.

2. Fenced Code Blocks
Definition: opening fence = up to 3 spaces indent + ≥3 backticks or tildes; optional info string.  Closing fence: same char, length ≥ opening, ≤3 spaces indent.
Implementation details:
  - Opening regex: /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/
  - Info string: trim spaces/tabs from capture group 3.
  - Content lines: for each line until closing fence, remove min(N,lineIndent) spaces where N = indent of opening.
  - Closing regex: new RegExp(`^ {0,3}(${fenceChar}{${fenceLen},})[ \t]*$`)
  - Blocks may interrupt any block, no blank-line requirement.


## Supplementary Details
Implementation steps for parser:
1. Iterate lines of document sequentially.
2. At each line, check for fenced code opening with Opening regex. If match:
   a. Record fenceChar (` or ~), fenceLen = length(match[1]), indent = countLeadingSpaces(match[0]).
   b. Parse infoString = match[3].split(/\s+/)[0].
   c. Collect subsequent lines until a line matching closing regex: new RegExp(`^ {0,3}(${fenceChar}{${fenceLen},})[ \t]*$`).
   d. For each content line, strip up to indent spaces, append to code content.
3. If no fence, check for indented code start with /^[ \t]{4,}/ and (prevBlank||prevNotParagraph).
   a. Collect subsequent lines while /^[ \t]{4,}/ or blank.
   b. For each non-blank, strip first 4 spaces; append to code content. Blank lines preserved if indented.

Configuration options:
- Tab stops: 4 spaces in indented contexts.
- Max fence indent: 3 spaces.
- Min fence length: 3 characters.


## Reference Details
Regex patterns:
  INDENTED_CODE_OPEN: /^[ \t]{4,}.+$/
  FENCE_OPEN: /^ {0,3}(`{3,}|~{3,})([ \t]*)([^`~]*)$/
  FENCE_CLOSE: prefix '^ {0,3}(' + fenceChar.repeat(fenceLen) + ',) *$'
Parser pseudocode:
function parseDocument(lines) {
  let i=0;
  while(i<lines.length) {
    if(lines[i].match(FENCE_OPEN)) {
      let [fenceChar, fenceLen, info] = extractFence(lines[i]);
      i++;
      let content=[];
      while(i<lines.length && !isFenceClose(lines[i], fenceChar, fenceLen)) {
        content.push(stripIndent(lines[i], indent)); i++;
      }
      i++;
      yield {type:'fenced_code', infoString:info, content};
    } else if(lines[i].match(INDENTED_CODE_OPEN) && isBlockBoundary(lines[i-1])) {
      let content=[];
      while(i<lines.length && (lines[i].match(INDENTED_CODE_OPEN)||isBlank(lines[i]))) {
        if(!isBlank(lines[i])) content.push(lines[i].slice(4));
        else content.push('');
        i++;
      }
      yield {type:'indented_code', content};
    } else {
      // other block parsing
      i++;
    }
  }
}

Best practices:
- Use fence sequences longer than any in content to avoid premature closure.
- Normalize tabs to spaces before parsing, preserving literal tabs in code.
- Always treat fenced code as literal; skip inline parsing inside.

Troubleshooting:
Command: run spec_tests.py against your parser
Expected: all code-block conformance tests pass (exit code 0).
Example: python3 tools/spec_tests.py commonmark-parser.js
If failure at test 4.5.3, inspect fence length comparison logic.


## Information Dense Extract
Indented code: lines≥4-space indent→strip4spaces→literal content; must follow blank/non-paragraph; list indent wins.  Fenced code: opening /^ {0,3}(`{3,}|~{3,})( *)(info)?$/, info=first word trimmed; content until closing /^ {0,3}(${char}{len,}) *$/, strip up to opening indent spaces; no inline parsing; blank-line-agnostic; parser: detect open, record fenceChar,len, indent, collect lines, match close, strip indent, output code node.

## Sanitised Extract
Table of Contents:
1. Indented Code Blocks
2. Fenced Code Blocks

1. Indented Code Blocks
Definition: lines with 4 spaces indentation constitute code block.  Blank-line-separated chunks.  Content = literal lines minus first 4 spaces.  Cannot start inside paragraph without blank line; list-indentation overrides.
Implementation details:
  - Detection regex: /^[ 't]{4,}/
  - Start: if prevLine is blank or non-paragraph, and line matches regex.
  - End: first non-blank line with <4 spaces indent.
  - Content extraction: strip exactly 4 leading spaces; retain extra spaces/tabs.

2. Fenced Code Blocks
Definition: opening fence = up to 3 spaces indent + 3 backticks or tildes; optional info string.  Closing fence: same char, length  opening, 3 spaces indent.
Implementation details:
  - Opening regex: /^ {0,3}('{3,}|~{3,})([ 't]*)([^'~]*)$/
  - Info string: trim spaces/tabs from capture group 3.
  - Content lines: for each line until closing fence, remove min(N,lineIndent) spaces where N = indent of opening.
  - Closing regex: new RegExp('^ {0,3}(${fenceChar}{${fenceLen},})[ 't]*$')
  - Blocks may interrupt any block, no blank-line requirement.

## Original Source
CommonMark Specification
https://spec.commonmark.org/0.30/

## Digest of CODE_BLOCKS

# Indented Code Blocks
An indented code block consists of one or more indented chunks separated by blank lines.  An indented chunk is a sequence of non-blank lines each preceded by at least four spaces of indentation.  The content of the code block is the literal text of those lines including trailing line endings, minus four leading spaces per line.  A blank line is required before an indented code block if the preceding block is a paragraph; no blank line is needed before a following paragraph.  Additional spaces or tabs beyond the initial four remain in content.  If indentation could also indicate a list item, list-item interpretation takes precedence.

# Fenced Code Blocks
A fenced code block begins with an opening fence: at most three spaces of indentation, then at least three consecutive backticks (`) or tildes (~), not mixed, optionally followed by spaces/tabs and an info string.  The info string is trimmed and may include a language identifier as its first word.  The block ends at a closing fence of the same character and at least the same length, preceded by up to three spaces of indentation, followed only by spaces or tabs.  Content lines have up to N leading spaces removed, where N is the indentation of the opening fence.  Content is treated as literal text.  Fenced code can interrupt paragraphs and does not require blank lines before or after.

Current date: 2023-11-20
Data size retrieved: 26611114 bytes


## Attribution
- Source: CommonMark Specification
- URL: https://spec.commonmark.org/0.30/
- License: CC0-1.0
- Crawl Date: 2025-05-11T08:57:55.704Z
- Data Size: 26611114 bytes
- Links Found: 111897

## Retrieved
2025-05-11
