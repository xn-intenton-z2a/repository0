# JSYAML

## Crawl Summary
Installation: npm install js-yaml; CLI: js-yaml [-h|v|c|t] file. API: load(input:string,options?), loadAll(input:string,iterator?,options?), dump(obj,options?) with full options list. Schemas: FAILSAFE, JSON, CORE, DEFAULT. LoadOptions: filename, onWarning, schema, json. DumpOptions: indent, noArrayIndent, skipInvalid, flowLevel, styles, schema, sortKeys, lineWidth, noRefs, noCompatMode, condenseFlow, quotingType, forceQuotes, replacer. Tag styles per YAML types. Supported tags. Caveats on mapping keys.

## Normalised Extract
Table of Contents:
1. Installation & CLI
2. Schema Definitions
3. load()
4. loadAll()
5. dump()
6. Tag Styles
7. Supported YAML Types
8. JS-Specific Tags
9. Caveats

1. Installation & CLI
   - npm install js-yaml
   - npm install -g js-yaml
   - CLI usage: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] file

2. Schema Definitions
   FAILSAFE_SCHEMA: strings, arrays, plain objects
   JSON_SCHEMA: JSON-supported types
   CORE_SCHEMA: alias for JSON_SCHEMA
   DEFAULT_SCHEMA: all YAML 1.2 types

3. load(input: string, options?: {
     filename?: string = null
     onWarning?: (warn: YAMLException) => void = null
     schema?: Schema = DEFAULT_SCHEMA
     json?: boolean = false
   }): any throws YAMLException
   - Returns: object|string|number|null|undefined
   - Throws on multi-document source

4. loadAll(input: string, iterator?: (doc:any)=>void, options?: LoadOptions): any[]|void
   - Returns array if iterator omitted
   - Calls iterator(doc) per document

5. dump(obj: any, options?: {
     indent?: number = 2
     noArrayIndent?: boolean = false
     skipInvalid?: boolean = false
     flowLevel?: number = -1
     styles?: Record<string,string> = {}
     schema?: Schema = DEFAULT_SCHEMA
     sortKeys?: boolean|Function = false
     lineWidth?: number = 80
     noRefs?: boolean = false
     noCompatMode?: boolean = false
     condenseFlow?: boolean = false
     quotingType?: "'"|"\"" = '\u0027'
     forceQuotes?: boolean = false
     replacer?: (key:string,value:any)=>any
   }): string

6. Tag Styles
   !!null: canonical->~, lowercase->null, uppercase->NULL, camelcase->Null, empty->""
   !!int: binary->0b1, octal->0o1, decimal->1, hexadecimal->0x1
   !!bool: lowercase->true, uppercase->TRUE, camelcase->True
   !!float: lowercase->.nan, uppercase->.NAN, camelcase->.NaN

7. Supported YAML Types
   !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!str, !!seq, !!map

8. JS-Specific Tags via js-yaml-js-types

9. Caveats
   - Objects/arrays used as keys get stringified
   - Duplicate implicit block mapping keys cannot be read

## Supplementary Details
LoadOptions defaults: filename=null, onWarning=null, schema=DEFAULT_SCHEMA, json=false. DumpOptions defaults: indent=2, noArrayIndent=false, skipInvalid=false, flowLevel=-1, styles={}, schema=DEFAULT_SCHEMA, sortKeys=false, lineWidth=80, noRefs=false, noCompatMode=false, condenseFlow=false, quotingType="'", forceQuotes=false, replacer=undefined. Installation steps: npm install js-yaml, npm install -g js-yaml. CLI flags – help, version, compact, trace. Schema URLs: FAILSAFE: https://www.yaml.org/spec/1.2/spec.html#id2802346; JSON: https://www.yaml.org/spec/1.2/spec.html#id2803231; CORE: https://www.yaml.org/spec/1.2/spec.html#id2804923. Behavior notes: load throws on multiple docs; dump skips invalid when skipInvalid=true; condenseFlow for URL params formatting; noCompatMode to disable YAML1.1 booleans quoting.

## Reference Details
// Import
const yaml = require('js-yaml');
const fs = require('fs');

// Reading a single document
try {
  const input = fs.readFileSync('example.yml','utf8');
  const data: any = yaml.load(input, {
    filename: 'example.yml',
    onWarning: function(warn) { console.warn('YAML Warning:',warn.message); },
    schema: yaml.JSON_SCHEMA,
    json: true
  });
  console.log(data);
} catch (e) {
  if(e instanceof yaml.YAMLException) {
    console.error('YAML Error at', e.mark, e.message);
  } else {
    throw e;
  }
}

// Reading multiple documents
const docs: any[] = [];
yaml.loadAll(fs.readFileSync('multi.yml','utf8'), function(doc) { docs.push(doc); }, { schema: yaml.CORE_SCHEMA });

// Writing YAML
const obj = { name: 'test', list: [1,2,'three'] };
const yamlStr: string = yaml.dump(obj, {
  indent: 4,
  noArrayIndent: true,
  skipInvalid: true,
  flowLevel: 2,
  styles: {'!!null':'empty'},
  sortKeys: (a,b) => a.localeCompare(b),
  lineWidth: 120,
  condenseFlow: true,
  quotingType: '"',
  forceQuotes: true,
  replacer: (key,value) => value===null?'NULL':value
});
fs.writeFileSync('out.yml', yamlStr, 'utf8');

// Troubleshooting Commands
// Validate syntax
js-yaml -c example.yml
// Expected: no output if valid, error message if invalid

// Dump error with trace
js-yaml -t invalid.yml
// Expected: stack trace with file and line numbers

// Best Practices
// 1. Always specify 'schema' explicitly in load
// 2. Use 'skipInvalid' to avoid exceptions on functions/regexps
// 3. Use 'sortKeys' function for reproducible outputs
// 4. Use 'noCompatMode' to enforce YAML1.2 quoting rules


## Information Dense Extract
install:npm i js-yaml;cli:js-yaml[-h][-v][-c][-t]file;import:const yaml=require('js-yaml');load(input:string,options{filename?:string,null;onWarning?fn;schema?:Schema=DEFAULT_SCHEMA;json?:boolean=false}):object|string|number|null|undefined throws YAMLException;loadAll(input,iterator?,options):any[]|void;dump(obj,options{indent=2;noArrayIndent=false;skipInvalid=false;flowLevel=-1;styles={};schema=DEFAULT_SCHEMA;sortKeys=false;lineWidth=80;noRefs=false;noCompatMode=false;condenseFlow=false;quotingType="'";forceQuotes=false;replacer?fn}):string;schemas:FAILSAFE,JSON,CORE,DEFAULT;tagStyles:!!null(canonical->~,...),!!int(binary->0b1,...),!!bool(lowercase->true,...),!!float(lowercase->.nan,...);types:!!null,!!bool,!!int,!!float,!!binary,!!timestamp,!!omap,!!pairs,!!set,!!str,!!seq,!!map;caveats:objects/arrays keys stringified;multi-doc load throws;use skipInvalid for invalid types

## Sanitised Extract
Table of Contents:
1. Installation & CLI
2. Schema Definitions
3. load()
4. loadAll()
5. dump()
6. Tag Styles
7. Supported YAML Types
8. JS-Specific Tags
9. Caveats

1. Installation & CLI
   - npm install js-yaml
   - npm install -g js-yaml
   - CLI usage: js-yaml [-h|--help] [-v|--version] [-c|--compact] [-t|--trace] file

2. Schema Definitions
   FAILSAFE_SCHEMA: strings, arrays, plain objects
   JSON_SCHEMA: JSON-supported types
   CORE_SCHEMA: alias for JSON_SCHEMA
   DEFAULT_SCHEMA: all YAML 1.2 types

3. load(input: string, options?: {
     filename?: string = null
     onWarning?: (warn: YAMLException) => void = null
     schema?: Schema = DEFAULT_SCHEMA
     json?: boolean = false
   }): any throws YAMLException
   - Returns: object|string|number|null|undefined
   - Throws on multi-document source

4. loadAll(input: string, iterator?: (doc:any)=>void, options?: LoadOptions): any[]|void
   - Returns array if iterator omitted
   - Calls iterator(doc) per document

5. dump(obj: any, options?: {
     indent?: number = 2
     noArrayIndent?: boolean = false
     skipInvalid?: boolean = false
     flowLevel?: number = -1
     styles?: Record<string,string> = {}
     schema?: Schema = DEFAULT_SCHEMA
     sortKeys?: boolean|Function = false
     lineWidth?: number = 80
     noRefs?: boolean = false
     noCompatMode?: boolean = false
     condenseFlow?: boolean = false
     quotingType?: '''|'''' = ''u0027'
     forceQuotes?: boolean = false
     replacer?: (key:string,value:any)=>any
   }): string

6. Tag Styles
   !!null: canonical->~, lowercase->null, uppercase->NULL, camelcase->Null, empty->''
   !!int: binary->0b1, octal->0o1, decimal->1, hexadecimal->0x1
   !!bool: lowercase->true, uppercase->TRUE, camelcase->True
   !!float: lowercase->.nan, uppercase->.NAN, camelcase->.NaN

7. Supported YAML Types
   !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!str, !!seq, !!map

8. JS-Specific Tags via js-yaml-js-types

9. Caveats
   - Objects/arrays used as keys get stringified
   - Duplicate implicit block mapping keys cannot be read

## Original Source
js-yaml Documentation
https://github.com/nodeca/js-yaml

## Digest of JSYAML

# JS-YAML Technical Digest (Retrieved: 2024-06-05)

## 1. Installation & CLI

npm install js-yaml

npm install -g js-yaml    
Usage: js-yaml [-h] [-v] [-c] [-t] file

Options:
  -h, --help       Show help and exit
  -v, --version    Show version
  -c, --compact    Display errors compactly
  -t, --trace      Show stack trace on error

## 2. Core API Methods

### 2.1 load(string[, options])
Signature:
  yaml.load(input: string, options?: LoadOptions): any
Throws: YAMLException
Return Types: object | string | number | null | undefined

LoadOptions:
  filename?: string       default: null
  onWarning?: (warn: YAMLException) => void    default: null
  schema?: Schema         default: DEFAULT_SCHEMA
  json?: boolean          default: false

Schemas:
  FAILSAFE_SCHEMA  strings, arrays, plain objects
  JSON_SCHEMA      JSON types
  CORE_SCHEMA      same as JSON_SCHEMA
  DEFAULT_SCHEMA   all YAML types

Behavior:
  throws on multi-document input
  supports regex, functions only via custom tags

### 2.2 loadAll(string[, iterator, options])
Signature:
  yaml.loadAll(input: string, iterator?: (doc: any) => void, options?: LoadOptions): any[] | void

Behavior:
  returns array if iterator omitted
  applies iterator(doc) per document

### 2.3 dump(object[, options])
Signature:
  yaml.dump(obj: any, options?: DumpOptions): string

DumpOptions:
  indent?: number               default: 2
  noArrayIndent?: boolean       default: false
  skipInvalid?: boolean         default: false
  flowLevel?: number            default: -1
  styles?: Record<string,string>default: {}
  schema?: Schema               default: DEFAULT_SCHEMA
  sortKeys?: boolean|Function    default: false
  lineWidth?: number            default: 80
  noRefs?: boolean              default: false
  noCompatMode?: boolean        default: false
  condenseFlow?: boolean        default: false
  quotingType?: "'"|"\""  default: '\u0027'
  forceQuotes?: boolean         default: false
  replacer?: (key: string, value: any) => any

## 3. Tag Styles Table

| Tag    | Styles           | Default => Output  |
|--------|------------------|--------------------|
| !!null | canonical, ...   | canonical -> ~     |
| !!int  | binary, octal... | decimal => '42'    |
| !!bool | lowercase, ...   | lowercase => true  |
| !!float| lowercase, ...   | lowercase => .nan  |

## 4. Supported Types

Standard:
  !!null, !!bool, !!int, !!float, !!binary, !!timestamp, !!omap, !!pairs, !!set, !!str, !!seq, !!map

JS-specific: via js-yaml-js-types

## 5. Caveats

- Objects/arrays as keys are stringified
- Implicit block mapping key duplication unsupported


## Attribution
- Source: js-yaml Documentation
- URL: https://github.com/nodeca/js-yaml
- License: License: MIT
- Crawl Date: 2025-05-10T13:05:00.365Z
- Data Size: 572595 bytes
- Links Found: 4593

## Retrieved
2025-05-10
