# JS_YAML

## Crawl Summary
JS-YAML is a YAML 1.2 parser and writer for JavaScript. It supports installation via npm, comes with a CLI tool and provides API methods load(), loadAll(), and dump() with comprehensive configuration options. load() parses a single document accepting options like filename (default null), onWarning (default null), schema (default DEFAULT_SCHEMA), and json (default false). dump() serializes objects with options including indent (2), noArrayIndent (false), skipInvalid (false), flowLevel (-1), sortKeys (false), and lineWidth (80). It supports multiple YAML types and styles for standard tags (e.g., !!null, !!bool, !!int, !!float) along with caveats for usage of objects as keys.

## Normalised Extract
Table of Contents:
1. Installation
   - npm install js-yaml
   - npm install -g js-yaml for CLI
2. CLI Usage
   - Command: js-yaml [-h] [-v] [-c] [-t] file
   - Arguments: file (YAML document), options: -h, -v, -c, -t
3. API Methods
   a. load(string[, options])
      - Returns: object, string, number, null, undefined
      - Options: filename (default null), onWarning (default null), schema (default DEFAULT_SCHEMA), json (default false)
   b. loadAll(string[, iterator][, options])
      - Returns: Array of documents or applies iterator per document
   c. dump(object[, options])
      - Options: indent (2), noArrayIndent (false), skipInvalid (false), flowLevel (-1), styles (tag style mapping), schema (DEFAULT_SCHEMA), sortKeys (false), lineWidth (80), noRefs (false), noCompatMode (false), condenseFlow (false), quotingType ('), forceQuotes (false), replacer (callback function)
4. YAML Types and Styles
   - Standard tags: !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!seq, !!map, !!str
   - Style examples for !!null: canonical (~), lowercase (null), uppercase (NULL), camelcase (Null)
5. Caveats and Enterprise
   - Objects/arrays as keys are stringified
   - Multi-document support: load() not supported; use loadAll() instead
   - Enterprise support via Tidelift

Implementation Details:
- For parsing: use yaml.load(fs.readFileSync('/path/example.yml', 'utf8')) in try-catch
- For multi-document parsing: yaml.loadAll(data, iteratorFunction)
- For dumping: yaml.dump(object, options) with detailed configuration provided


## Supplementary Details
API Options Detailed:
load():
  • filename: string (default null)
  • onWarning: function (default null)
  • schema: use FAILSAFE_SCHEMA, JSON_SCHEMA, CORE_SCHEMA, or DEFAULT_SCHEMA (default DEFAULT_SCHEMA)
  • json: boolean (default false), enables JSON.parse compatibility

loadAll():
  • Accepts an optional iterator to process each document

dump():
  • indent: number (default 2)
  • noArrayIndent: boolean (default false)
  • skipInvalid: boolean (default false) - skips dumping unsupported types
  • flowLevel: number (default -1)
  • styles: object mapping tags to styles (e.g., '!!null': 'canonical')
  • schema: schema selection (default DEFAULT_SCHEMA)
  • sortKeys: boolean or function (default false)
  • lineWidth: number (default 80, -1 for unlimited)
  • noRefs: boolean (default false)
  • noCompatMode: boolean (default false)
  • condenseFlow: boolean (default false)
  • quotingType: string, either ' or " (default is single quote)
  • forceQuotes: boolean (default false)
  • replacer: function for key/value serialization

Configuration Impacts:
- Adjusting indent and lineWidth impacts readabilty of output
- Changing sortKeys can help create deterministic output
- Enabling json mode affects how duplicate keys are managed
- Using specific schemas affects allowed YAML types and tag resolutions


## Reference Details
Full API Specifications:
1. load(string[, options]) -> Returns: object | string | number | null | undefined, Throws: YAMLException
   Options:
     - filename: string; default: null
     - onWarning: function(YAMLException); default: null
     - schema: one of {FAILSAFE_SCHEMA, JSON_SCHEMA, CORE_SCHEMA, DEFAULT_SCHEMA}; default: DEFAULT_SCHEMA
     - json: boolean; default: false
   Example Usage:
     const yaml = require('js-yaml');
     const fs = require('fs');
     try {
       const doc = yaml.load(fs.readFileSync('/home/ixti/example.yml', 'utf8'));
       console.log(doc);
     } catch (e) {
       console.log(e);
     }

2. loadAll(string[, iterator][, options]) -> Returns: Array of documents; if iterator provided, iterates over each document
   Example Usage:
     yaml.loadAll(data, function(doc){
       console.log(doc);
     });

3. dump(object[, options]) -> Returns: YAML string, Throws: exception if unsupported types encountered unless skipInvalid is true
   Options:
     - indent: number; default: 2
     - noArrayIndent: boolean; default: false
     - skipInvalid: boolean; default: false
     - flowLevel: number; default: -1
     - styles: object mapping tag to style; e.g., {'!!null': 'canonical'}
     - schema: schema selection; default: DEFAULT_SCHEMA
     - sortKeys: boolean or function; default: false
     - lineWidth: number; default: 80 (use -1 for unlimited)
     - noRefs: boolean; default: false
     - noCompatMode: boolean; default: false
     - condenseFlow: boolean; default: false
     - quotingType: string (' or "); default: '
     - forceQuotes: boolean; default: false
     - replacer: function(key, value)
   Example Usage:
     const yamlStr = yaml.dump(object, {
       indent: 2,
       sortKeys: true,
       styles: {'!!null': 'canonical'}
     });

Detailed Troubleshooting Procedures:
   - If load() throws YAMLException, check file encoding and schema option.
   - For duplicate keys with json set to false, error is thrown; set json: true to override.
   - For unsupported types during dump(), either remove functions/regexps or set skipInvalid: true.
   - Verify configuration by logging options and testing with minimal documents.

Configuration Options Effects:
   indent: affects whitespace in output (default: 2 spaces)
   lineWidth: limits line length (default: 80, set to -1 for no limit)
   sortKeys: produces deterministic output when true
   quotingType and forceQuotes: control how strings are quoted in output


## Information Dense Extract
Installation:npm install js-yaml; CLI: npm install -g js-yaml; Usage: js-yaml [-h] [-v] [-c] [-t] file; API: load(string, {filename:null, onWarning:null, schema:DEFAULT_SCHEMA, json:false}), loadAll(string, [iterator], {same as load}), dump(object, {indent:2, noArrayIndent:false, skipInvalid:false, flowLevel:-1, styles:{}, schema:DEFAULT_SCHEMA, sortKeys:false, lineWidth:80, noRefs:false, noCompatMode:false, condenseFlow:false, quotingType:'', forceQuotes:false, replacer:function}); YAML Tags: !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!seq, !!map, !!str; Style examples: '!!null': canonical, lowercase, uppercase, camelcase; Caveats: No support for complex keys (objects, arrays) - uses toString(); Use loadAll for multi-document YAML; Troubleshoot YAMLException and duplicate keys using options; Full SDK method signatures provided.

## Sanitised Extract
Table of Contents:
1. Installation
   - npm install js-yaml
   - npm install -g js-yaml for CLI
2. CLI Usage
   - Command: js-yaml [-h] [-v] [-c] [-t] file
   - Arguments: file (YAML document), options: -h, -v, -c, -t
3. API Methods
   a. load(string[, options])
      - Returns: object, string, number, null, undefined
      - Options: filename (default null), onWarning (default null), schema (default DEFAULT_SCHEMA), json (default false)
   b. loadAll(string[, iterator][, options])
      - Returns: Array of documents or applies iterator per document
   c. dump(object[, options])
      - Options: indent (2), noArrayIndent (false), skipInvalid (false), flowLevel (-1), styles (tag style mapping), schema (DEFAULT_SCHEMA), sortKeys (false), lineWidth (80), noRefs (false), noCompatMode (false), condenseFlow (false), quotingType ('), forceQuotes (false), replacer (callback function)
4. YAML Types and Styles
   - Standard tags: !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!seq, !!map, !!str
   - Style examples for !!null: canonical (~), lowercase (null), uppercase (NULL), camelcase (Null)
5. Caveats and Enterprise
   - Objects/arrays as keys are stringified
   - Multi-document support: load() not supported; use loadAll() instead
   - Enterprise support via Tidelift

Implementation Details:
- For parsing: use yaml.load(fs.readFileSync('/path/example.yml', 'utf8')) in try-catch
- For multi-document parsing: yaml.loadAll(data, iteratorFunction)
- For dumping: yaml.dump(object, options) with detailed configuration provided

## Original Source
js-yaml Documentation
https://github.com/nodeca/js-yaml

## Digest of JS_YAML

# JS-YAML Documentation

Retrieved: 2023-10-27

## Installation

- For Node.js apps: npm install js-yaml
- For CLI inspection: npm install -g js-yaml

## CLI Usage

usage: js-yaml [-h] [-v] [-c] [-t] file

Positional:
- file: YAML document file

Optional:
- -h, --help: Display help message
- -v, --version: Show version
- -c, --compact: Compact error display
- -t, --trace: Show stack trace on error

## API Methods

### load(string[, options])
- Description: Parses a string as a single YAML document.
- Return: plain object, string, number, null or undefined
- Throws: YAMLException on error
- Options:
  - filename (default: null): string used for file path in error/warning messages
  - onWarning (default: null): function callback(YAMLException) for warnings
  - schema (default: DEFAULT_SCHEMA): Schema to use (options: FAILSAFE_SCHEMA, JSON_SCHEMA, CORE_SCHEMA, DEFAULT_SCHEMA)
  - json (default: false): if true, duplicate keys override values instead of throwing error

### loadAll(string[, iterator][, options])
- Description: Parses a multi-document YAML string.
- Return: Array of documents or applies iterator function to each document
- Parameters same as load regarding options.

### dump(object[, options])
- Description: Serializes an object to a YAML document.
- Throws: Exception if object contains unsupported types (e.g., regexps, functions), unless skipInvalid is true
- Options:
  - indent (default: 2): indentation width in spaces
  - noArrayIndent (default: false): if true, no extra indent for array elements
  - skipInvalid (default: false): skip invalid types without throwing error
  - flowLevel (default: -1): nesting level to switch from block to flow style (-1 for block style always)
  - styles: map for tag styles (e.g., '!!null': 'canonical')
  - schema (default: DEFAULT_SCHEMA): schema to use
  - sortKeys (default: false): if true, keys are sorted; accepts function for custom sort
  - lineWidth (default: 80): maximum line width (-1 for unlimited)
  - noRefs (default: false): if true, duplicate objects are not converted to references
  - noCompatMode (default: false): if true, adjustments for YAML 1.1 are disabled
  - condenseFlow (default: false): if true, flow sequences are condensed
  - quotingType (default: '): quoting style for strings
  - forceQuotes (default: false): if true, forces quoting for all non-key strings
  - replacer: function (key, value) used recursively on each key/value

## Supported YAML Types and Styles

Standard YAML tags and corresponding types:
- !!null -> null
- !!bool -> boolean values (styles: lowercase -> "true", "false"; uppercase -> "TRUE", "FALSE"; camelcase -> "True", "False")
- !!int -> number (styles: binary, octal, decimal, hexadecimal with examples: "0b1", "0o1", "1", "0x1")
- !!float -> number with styles (lowercase ".nan" , ".inf"; uppercase ".NAN", ".INF"; camelcase ".NaN", ".Inf")
- !!binary -> buffer (base64 encoded string)
- !!timestamp -> date (format: 'YYYY-...')
- !!omap, !!pairs, !!set, !!seq, !!map, !!str for collections and strings

## JavaScript-Specific and Caveats

- JS-YAML supports extra types via js-yaml-js-types
- Caveat: Objects or arrays used as keys are stringified via toString() method
- Multi-document sources are not supported by load() and throw an error; use loadAll() instead
- Implicit block mapping key's properties reading is not supported

## Enterprise

- js-yaml is available with commercial support through Tidelift Subscription

## Attribution & Data Size

- Data Size: 848452 bytes
- Links Found: 5396
- No errors encountered during crawl


## Attribution
- Source: js-yaml Documentation
- URL: https://github.com/nodeca/js-yaml
- License: MIT License
- Crawl Date: 2025-05-02T17:53:24.061Z
- Data Size: 848452 bytes
- Links Found: 5396

## Retrieved
2025-05-02
