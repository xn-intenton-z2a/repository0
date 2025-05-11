# MINIMIST

## Crawl Summary
Minimist@2.0.1: Zero-dependency Node.js CLI argument parser. Installation via npm. Single function minimist(args, opts) returns object with '_', parsed flags based on opts: string, boolean, alias, default, unknown. Supports negation (--no-flag), repeated flags accumulate arrays. Configuration options: string[], boolean[], alias mapping, default values, unknown callback.

## Normalised Extract
Table of Contents
1. Installation
2. Core Function
3. Options Schema
4. Parsing Behavior
5. Use Cases

1. Installation
  npm install minimist@2.0.1 --save

2. Core Function
  minimist(args: string[], opts?: Opts): ParsedArgs

3. Options Schema
  Opts:
    string?: string[]
    boolean?: string[]
    alias?: Record<string,string[]>
    default?: Record<string,any>
    unknown?: (arg:string)=>boolean

4. Parsing Behavior
  - Strings: cast values to String when key in string[]
  - Booleans: cast values to Boolean when key in boolean[] or default boolean type
  - Alias: keys in alias map propagate values
  - Defaults: missing keys set to default
  - Negation: --no-key sets key to false
  - Arrays: repeated flags collect into array

5. Use Cases
  - Positional args in _ array
  - Named flags -> direct properties
  - Combined short flags expand
  - Unknown filter via callback


## Supplementary Details
Parameter Values and Defaults:
  string: []
  boolean: []
  alias: {}
  default: {}
  unknown: undefined
Implementation Steps:
  1. Call minimist with process.argv.slice(2) and opts
  2. Internally split args at '=' into key/value
  3. Apply type coercion per opts
  4. Handle negation prefix 'no-'
  5. Accumulate repeated flags
  6. Return object with parsed results


## Reference Details
Function Signature:
  function minimist(args: string[], opts?: {
    string?: string[];
    boolean?: string[];
    alias?: {[key:string]:string[]};
    default?: {[key:string]:any};
    unknown?: (arg:string)=>boolean;
  }): {
    _: string[];
    [key:string]: any;
  }

Full Example:
  const minimist = require('minimist')
  const opts = { alias:{f:['file']}, default:{verbose:false}, boolean:['verbose'] }
  const argv = minimist(process.argv.slice(2), opts)
  // Usage: node index.js -f config.json --verbose

Best Practices:
  - Declare boolean flags in boolean[] to prevent mis-parsing
  - Use alias arrays for shorthand
  - Provide default values to document expected options

Troubleshooting:
  Issue: Value starting with '-' parsed as flag
  Fix: Prefix positional args after '--'
    e.g. node app.js -- -value

  Issue: Unknown flags accepted
  Fix: Provide unknown callback to filter or reject invalid options
    unknown: (arg)=>{ throw Error('Unknown option ' + arg) }


## Information Dense Extract
minimist(args:string[],opts?:{string?:string[];boolean?:string[];alias?:Record<string,string[]>;default?:Record<string,any>;unknown?:(arg:string)=>boolean;}):{_:string[];[key:string]:any} install@2.0.1 npm i minimist parse rules: string->String, boolean->Boolean, alias propagates, default fills, --no-key = false, repeat->array, unknown callback filter. Best: list flags in boolean, set defaults, use alias, handle negation, prefix positional with --.

## Sanitised Extract
Table of Contents
1. Installation
2. Core Function
3. Options Schema
4. Parsing Behavior
5. Use Cases

1. Installation
  npm install minimist@2.0.1 --save

2. Core Function
  minimist(args: string[], opts?: Opts): ParsedArgs

3. Options Schema
  Opts:
    string?: string[]
    boolean?: string[]
    alias?: Record<string,string[]>
    default?: Record<string,any>
    unknown?: (arg:string)=>boolean

4. Parsing Behavior
  - Strings: cast values to String when key in string[]
  - Booleans: cast values to Boolean when key in boolean[] or default boolean type
  - Alias: keys in alias map propagate values
  - Defaults: missing keys set to default
  - Negation: --no-key sets key to false
  - Arrays: repeated flags collect into array

5. Use Cases
  - Positional args in _ array
  - Named flags -> direct properties
  - Combined short flags expand
  - Unknown filter via callback

## Original Source
minimist Argument Parser
https://github.com/substack/minimist

## Digest of MINIMIST

# MINIMIST 2.0.1 Documentation (Retrieved 2023-10-12)

## 1. Overview

Minimist is a zero-dependency argument parser for Node.js. It converts an array of strings into an object with key/value pairs.

## 2. Installation

```bash
npm install minimist@2.0.1 --save
```

## 3. Usage

```js
const minimist = require('minimist')

const argv = minimist(process.argv.slice(2), {
  string: ['name'],
  boolean: ['help', 'verbose'],
  alias: { h: 'help', v: 'verbose' },
  default: { verbose: false }
})

// argv: { _: [], name: 'Alice', help: false, verbose: false }
```

## 4. API Reference

### minimist(args: string[], opts?: Opts): ParsedArgs

Opts:
  string?: string[]                 Properties to always cast to String
  boolean?: string[]                Properties to always cast to Boolean
  alias?: { [key: string]: string[] }  Alias mapping
  default?: { [key: string]: any }     Default values
  unknown?: (arg: string) => boolean   Callback for unknown args

ParsedArgs:
  _: string[]       Non-option arguments
  [key: string]: any

## 5. Configuration Options

- string: Force parse arguments as strings.
- boolean: Force parse arguments as booleans.
- alias: Create aliases for options.
- default: Set default values.
- unknown: Filter unknown arguments.

## 6. Examples

1. Positional and Named Arguments
```bash
node app.js input.txt --name=Bob -v
``` 
```js
// argv: { _: ['input.txt'], name: 'Bob', v: true }
```

2. Negated Booleans
```bash
node app.js --no-verbose
```
```js
// argv: { _: [], verbose: false }
```

## 7. Edge Cases

- Values beginning with `-` are parsed as options unless preceded by `--`.
- Repeated flags accumulate in arrays.

## 8. Troubleshooting

### Unexpected Option Parsing
Command: `node app.js -abc`
Expected: `a: true, b: true, c: true`
If combined flags not split, ensure boolean array includes all single-letter flags.




## Attribution
- Source: minimist Argument Parser
- URL: https://github.com/substack/minimist
- License: MIT
- Crawl Date: 2025-05-11T00:40:18.990Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-05-11
