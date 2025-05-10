# JSYAML

## Crawl Summary
Installation via npm, CLI flags, methods: load, loadAll, dump with full option sets, supported schemas, tag styles, YAML types mapping.

## Normalised Extract
Table of Contents
1. Installation
2. CLI Usage
3. API Methods
   3.1 load
   3.2 loadAll
   3.3 dump
4. Schemas
5. Tag Styles
6. Supported Types

1. Installation
npm install js-yaml
npm install -g js-yaml

2. CLI Usage
Command: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

3. API Methods
3.1 load(string, options)
options:
  filename: string|null (default null)
  onWarning: function(YAMLException)
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA (default DEFAULT_SCHEMA)
  json: boolean (default false)
Returns: object|string|number|null|undefined or throws YAMLException

3.2 loadAll(string, iterator, options)
iterator: function(doc)
Returns: void or array of documents

3.3 dump(object, options)
options:
  indent: number (default 2)
  noArrayIndent: boolean (default false)
  skipInvalid: boolean (default false)
  flowLevel: number (default -1)
  styles: map<string,string>
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA
  sortKeys: boolean|function
  lineWidth: number (default 80)
  noRefs: boolean (default false)
  noCompatMode: boolean (default false)
  condenseFlow: boolean (default false)
  quotingType: '"' or "'" (default '\'')
  forceQuotes: boolean (default false)
  replacer: function(key,value)
Returns: string

4. Schemas
FAILSAFE_SCHEMA: strings, arrays, objects
JSON_SCHEMA: JSON types
CORE_SCHEMA: same as JSON_SCHEMA
DEFAULT_SCHEMA: all YAML types

5. Tag Styles
!!null: "~"|"null"|"NULL"|"Null"|""
!!int: "0b..."|"0o..."|"decimal"|"0x..."
!!bool: "true"|"false" in cases
!!float: ".nan"|".inf"

6. Supported Types
null, bool, int, float, binary, timestamp, omap, pairs, set, str, seq, map

## Supplementary Details
Schemas definitions: FAILSAFE (strings, arrays, objects), JSON (JSON types), CORE (JSON), DEFAULT (all). Filename option used in error messages. onWarning callback receives YAMLException. json=true makes duplicate keys override. dump.skipInvalid skips non-serializable types. flowLevel controls transition to flow style. styles map tag to style. sortKeys can be comparator. lineWidth max length. noRefs disables references. noCompatMode disables YAML1.1 compat. condenseFlow removes spaces. quotingType sets wrapper. forceQuotes quotes all strings. replacer applied like JSON.stringify.

## Reference Details
// load
function load(string, options?) => any
Parameters:
  string: input YAML
  options.filename: string|null
  options.onWarning(e: YAMLException): void
  options.schema: Schema
  options.json: boolean
Throws: YAMLException

// loadAll
function loadAll(string, iterator, options?) => any[]|void
Parameters:
  string: input
  iterator(doc:any): void
  options same as load

// dump
function dump(object:any, options?) => string
Parameters:
  indent: number
  noArrayIndent: boolean
  skipInvalid: boolean
  flowLevel: number
  styles: Record<string,string>
  schema: Schema
  sortKeys: boolean|function
  lineWidth: number
  noRefs: boolean
  noCompatMode: boolean
  condenseFlow: boolean
  quotingType: '"'|'\''
  forceQuotes: boolean
  replacer(key,value): any

Best Practices:
- Use DEFAULT_SCHEMA unless strict JSON needed
- Set skipInvalid=true to ignore functions
- Set sortKeys for predictable output
- Use flowLevel=0 for full flow style
- Use condenseFlow for URL query params

Troubleshooting:
Command: js-yaml file.yml
Error: YAMLException: at line X, column Y
Fix: Validate indentation, ensure proper key-value syntax
Use --trace to see stack

## Information Dense Extract
install npm js-yaml|global for CLI; CLI flags -h,-v,-c,-t; API load(string,options{filename, onWarning, schema, json})->any|throws YAMLException; loadAll(string,iterator,options)->any[]|void; dump(obj,options{indent, noArrayIndent, skipInvalid, flowLevel, styles, schema, sortKeys, lineWidth, noRefs, noCompatMode, condenseFlow, quotingType, forceQuotes, replacer})->string; schemas=FAILSAFE(only str,arr,obj), JSON, CORE(JSON), DEFAULT(all); json:true overrides dup keys; skipInvalid:true skips non-serializable; flowLevel controls style transition; styles:tag->style; sortKeys:boolean|fn; quotingType="'"|"\""; condenseFlow removes spaces; supported tags: !!null,!!int,!!bool,!!float with style variants; types: null,bool,int,float,binary,timestamp,omap,pairs,set,str,seq,map.

## Sanitised Extract
Table of Contents
1. Installation
2. CLI Usage
3. API Methods
   3.1 load
   3.2 loadAll
   3.3 dump
4. Schemas
5. Tag Styles
6. Supported Types

1. Installation
npm install js-yaml
npm install -g js-yaml

2. CLI Usage
Command: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

3. API Methods
3.1 load(string, options)
options:
  filename: string|null (default null)
  onWarning: function(YAMLException)
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA (default DEFAULT_SCHEMA)
  json: boolean (default false)
Returns: object|string|number|null|undefined or throws YAMLException

3.2 loadAll(string, iterator, options)
iterator: function(doc)
Returns: void or array of documents

3.3 dump(object, options)
options:
  indent: number (default 2)
  noArrayIndent: boolean (default false)
  skipInvalid: boolean (default false)
  flowLevel: number (default -1)
  styles: map<string,string>
  schema: FAILSAFE_SCHEMA|JSON_SCHEMA|CORE_SCHEMA|DEFAULT_SCHEMA
  sortKeys: boolean|function
  lineWidth: number (default 80)
  noRefs: boolean (default false)
  noCompatMode: boolean (default false)
  condenseFlow: boolean (default false)
  quotingType: ''' or ''' (default '''')
  forceQuotes: boolean (default false)
  replacer: function(key,value)
Returns: string

4. Schemas
FAILSAFE_SCHEMA: strings, arrays, objects
JSON_SCHEMA: JSON types
CORE_SCHEMA: same as JSON_SCHEMA
DEFAULT_SCHEMA: all YAML types

5. Tag Styles
!!null: '~'|'null'|'NULL'|'Null'|''
!!int: '0b...'|'0o...'|'decimal'|'0x...'
!!bool: 'true'|'false' in cases
!!float: '.nan'|'.inf'

6. Supported Types
null, bool, int, float, binary, timestamp, omap, pairs, set, str, seq, map

## Original Source
js-yaml Documentation
https://github.com/nodeca/js-yaml

## Digest of JSYAML

# JS-YAML Technical Digest (Retrieved 2024-07-12)

## Installation

npm install js-yaml
npm install -g js-yaml  # for CLI

## CLI Usage

js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] <file>

- --compact: errors in compact mode
- --trace: show stack trace

## API Methods

### load(string, options)
Signature: load(string: string, options?: {
  filename?: string;
  onWarning?: (e: YAMLException) => void;
  schema?: Schema;
  json?: boolean;
}) : any

### loadAll(string, iterator?, options?)
Signature: loadAll(string: string, iterator?: (doc: any) => void, options?: {
  filename?: string;
  onWarning?: (e: YAMLException) => void;
  schema?: Schema;
  json?: boolean;
}) : any[] | void

### dump(object, options?)
Signature: dump(object: any, options?: {
  indent?: number;
  noArrayIndent?: boolean;
  skipInvalid?: boolean;
  flowLevel?: number;
  styles?: Record<string,string>;
  schema?: Schema;
  sortKeys?: boolean | ((a:any,b:any)=>number);
  lineWidth?: number;
  noRefs?: boolean;
  noCompatMode?: boolean;
  condenseFlow?: boolean;
  quotingType?: '"' | "'";
  forceQuotes?: boolean;
  replacer?: (key:any,value:any)=>any;
}) : string

## Schemas

- FAILSAFE_SCHEMA
- JSON_SCHEMA
- CORE_SCHEMA
- DEFAULT_SCHEMA

## Styles by Tag

Tag       Canonical Lowercase Uppercase Camelcase Empty
!!null    ~         null      NULL      Null      ''
!!int     binary    octal     decimal   hex      -
!!bool    true/false TRUE/FALSE True/False -        -
!!float   .nan/.inf .nan/.inf .NAN/.INF .NaN/.Inf -

## Supported Types

- null, bool, number, string, buffer, date, array, object, pairs, omap, set


## Attribution
- Source: js-yaml Documentation
- URL: https://github.com/nodeca/js-yaml
- License: License: MIT
- Crawl Date: 2025-05-10T20:57:13.656Z
- Data Size: 1012204 bytes
- Links Found: 5597

## Retrieved
2025-05-10
