# MINIMIST

## Crawl Summary
parse(argv: string[], opts?: MinimistOptions) returns ParsedArgs. Options: string[], boolean[], alias mapping, default values, unknown callback, stopEarly flag, “--” inclusion. ParsedArgs contains _ array and coerced values: numeric conversion, negated booleans via no- prefix.

## Normalised Extract
Table of Contents
1 Function Signature
2 Options Interface
3 Parsed Output Structure
4 Usage Examples

1 Function Signature
 Signature parse(argv: string[], opts?: Options): ParsedArgs

2 Options Interface
 string: keys forced as strings, no numeric coercion
 boolean: keys forced as booleans
 alias: mapping primary key to alias or aliases
 default: default values per key
 unknown: callback(argName, argValue)→false to omit unknown flags
 stopEarly: true stops at first non-option token
 "--": true includes tokens after -- in _ array

3 Parsed Output Structure
 _: array of non-option arguments
 key values: string or number or boolean or arrays thereof
 Numeric tokens matching /^(?:-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?)$/ auto-coerce to Number unless in string list
 Flags prefixed with no- set corresponding boolean flag to false

4 Usage Examples
 var argv = require('minimist')(process.argv.slice(2), { boolean:['help'], alias:{h:'help'}, default:{help:false}, string:['config'], unknown:(k,v)=>k.length===1, stopEarly:false, "--":true });

## Supplementary Details
Default values
 stopEarly default: false
 "--" default: false
 unknown default: undefined (all unknown keys retained)
 string default: []
 boolean default: []
 alias default: {}
 default default: {}

Type coercion
 Numeric tokens recognized by regex convert to Number unless key listed in string option
 Boolean flags default to false unless present; negation by prefixing no- sets false

Implementation steps
 1 import parse: var parse=require('minimist')
 2 slice argv: process.argv.slice(2)
 3 call parse with options
 4 read parsed values from returned object

Common patterns
 - Use alias to support short and long flags
 - Use default to ensure required flags always exist
 - Enforce type with string and boolean lists
 - Provide unknown to filter unwanted flags
 - Use stopEarly when mixing options and positional args
 - Enable "--" when you need to preserve subcommand args


## Reference Details
API Specifications
 parse(argv: string[], opts?: MinimistOptions): ParsedArgs

MinimistOptions interface
 interface MinimistOptions {
   string?: string | string[]
   boolean?: string | string[]
   alias?: { [key: string]: string | string[] }
   default?: { [key: string]: string | number | boolean | Array<string | number | boolean> }
   unknown?: (argName: string, argValue: string) => boolean
   stopEarly?: boolean
   "--"?: boolean
 }

ParsedArgs type
 interface ParsedArgs {
   _: string[]
   [key: string]: string | number | boolean | Array<string | number | boolean>
 }

Code Examples
 // example.js
 var parse = require('minimist');
 var argv = parse(process.argv.slice(2), {
   string: ['config','env'],
   boolean: ['help','dryRun'],
   alias: { c:'config', h:'help', d:'dryRun' },
   default: { env:'development', dryRun:false, timeout:5000 },
   unknown: function(argName, argValue) {
     if (/^\w+$/.test(argName)) return true;
     console.error('Unknown flag',argName);
     return false;
   },
   stopEarly: false,
   "--": true
 });
 console.log('Config:', argv.config);
 console.log('Flags:', argv.help, argv.dryRun);
 console.log('Positional args:', argv._);

Implementation pattern
 1 define options object inline or import from config
 2 slice process.argv
 3 call parse to get args
 4 destructure named flags and positional args

Configuration options
 string: array of key names, default []
 boolean: array of key names, default []
 alias: object map, default {}
 default: object map of default values, default {}
 unknown: function signature, default undefined
 stopEarly: boolean, default false
 "--": boolean, default false

Best practices
 - Always slice process.argv before parsing
 - Explicitly define types for flags used in code
 - Provide default values to avoid undefined checks
 - Use alias to unify short/long options
 - Filter unknown flags to prevent typos
 - Use stopEarly when chaining subcommands

Troubleshooting procedures
 Command: node example.js --port abc
 Expected: argv.port = NaN or string if port listed in string
 Verification: console.log(typeof argv.port,argv.port)
 Command: node example.js --no-dryRun
 Expected: argv.dryRun === false
 Verify: console.log('dryRun',argv.dryRun)
 Command: node example.js unknownFlag
 Without unknown filter: argv.unknownFlag = true
 With unknown returning false: unknownFlag omitted
 Verify: console.log(argv.unknownFlag)


## Information Dense Extract
parse(argv:string[],opts?:{string?:string|string[];boolean?:string|string[];alias?:Record<string,string|string[]>;default?:Record<string,number|string|boolean|Array<number|string|boolean>>;unknown?:(name:string,value:string)=>boolean;stopEarly?:boolean;"--"?:boolean}):{_:string[];[k:string]:string|number|boolean|Array<string|number|boolean>} Numeric tokens matching /^(?:-?\d+(?:\.\d+)?)$/ auto-coerce to Number unless key in string; boolean flags default false, negated via no- prefix; stopEarly stops at first non-option; "--" retains tokens after separator; alias maps keys; default supplies values; unknown callback filters flags.

## Sanitised Extract
Table of Contents
1 Function Signature
2 Options Interface
3 Parsed Output Structure
4 Usage Examples

1 Function Signature
 Signature parse(argv: string[], opts?: Options): ParsedArgs

2 Options Interface
 string: keys forced as strings, no numeric coercion
 boolean: keys forced as booleans
 alias: mapping primary key to alias or aliases
 default: default values per key
 unknown: callback(argName, argValue)false to omit unknown flags
 stopEarly: true stops at first non-option token
 '--': true includes tokens after -- in _ array

3 Parsed Output Structure
 _: array of non-option arguments
 key values: string or number or boolean or arrays thereof
 Numeric tokens matching /^(?:-?(?:[0-9]|[1-9][0-9]+)(?:'.[0-9]+)?)$/ auto-coerce to Number unless in string list
 Flags prefixed with no- set corresponding boolean flag to false

4 Usage Examples
 var argv = require('minimist')(process.argv.slice(2), { boolean:['help'], alias:{h:'help'}, default:{help:false}, string:['config'], unknown:(k,v)=>k.length===1, stopEarly:false, '--':true });

## Original Source
minimist Argument Parser
https://github.com/substack/minimist

## Digest of MINIMIST

# parse

Signature
  parse(argv: string[], opts?: MinimistOptions): ParsedArgs

Parameters
  argv    Array<string> of arguments to parse
  opts?   MinimistOptions object (below)

Returns
  ParsedArgs object (properties and _ array)

# MinimistOptions

Properties
  string     string | string[]    keys to force as strings (no number coercion)
  boolean    string | string[]    keys to force as booleans
  alias      Record<string, string | string[]>    map primary keys to aliases
  default    Record<string, string | number | boolean | Array<string | number | boolean>>    default values for keys
  unknown    (argName: string, argValue: string) => boolean    return false to omit unknown keys
  stopEarly  boolean    if true, stop parsing on first non-option
  "--"      boolean    if true, populate args after “--” in _ array instead of ignoring

# ParsedArgs

Properties
  _          string[]    non-option arguments
  [key: string]: string | boolean | number | string[] | boolean[] | number[]    parsed option values

Coercion rules
  Numeric token regex: /^(?:-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?)$/ converts to Number unless key in string list
  Negated booleans: flags prefixed with "no-" set boolean false

# Examples

Example 1: Basic usage
  var parse = require('minimist');
  var argv = parse(process.argv.slice(2));

Example 2: With options
  var argv = require('minimist')(
    process.argv.slice(2),
    {
      boolean: ['help'],
      alias: { v: 'version', h: 'help' },
      default: { help: false, port: 3000 },
      string: ['config'],
      unknown: function(argName, argValue) { return argName.length === 1; },
      stopEarly: false,
      "--": true
    }
  );

## Attribution
- Source: minimist Argument Parser
- URL: https://github.com/substack/minimist
- License: MIT
- Crawl Date: 2025-05-15T03:34:27.908Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-15
