# YARGS_CLI

## Crawl Summary
Installation via npm install --save yargs. Import statements import yargs from 'yargs' and import hideBin from 'yargs/helpers'. Core API signatures: hideBin(argv: string[]): string[], yargs(): YargsInstance. Methods: scriptName(name: string), usage(usage: string), command(cmd:string|array, description:string, builder?, handler?), positional(name:string, options:PositionalOptions), help([opt],[message]), parse(argv, [context],[callback]). PositionalOptions include type, describe, default, choices, demandOption. Fluent chaining pattern. Generated help menu based on options. Example code provided.

## Normalised Extract
Table of Contents
1 Installation
2 Basic Parser Setup
3 Defining Commands
4 Positional Arguments
5 Help Generation
6 Argument Parsing

1 Installation
Install yargs via npm
npm install --save yargs

2 Basic Parser Setup
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
Initialize parser
const parser = yargs()
Use hideBin to strip node and script path
const args = parser.parse(hideBin(process.argv))

3 Defining Commands
Method signature
.command(cmd: string | string[], description: string, builder?: (yargs) => YargsInstance, handler?: (argv) => void)
Usage example
parser.command(
  'hello [name]',
  'welcome ter yargs!',
  y => y.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' }),
  argv => console.log('hello', argv.name)
)

4 Positional Arguments
Use positional to declare arguments in command builders
.positional(name: string, options: { type: 'string' | 'number' | 'boolean'; describe: string; default?: any; choices?: any[]; demandOption?: boolean })
Example
builder.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' })

5 Help Generation
.help([opt], [message])
Generates --help option and auto prints usage

6 Argument Parsing
.parse(argv: string[], context?: object, callback?) returns parsed Arguments or Promise
.parse(hideBin(process.argv))

Use fluent chaining: scriptName, usage, command, help, parse.

## Supplementary Details
Configuration Options Summary

scriptName(name: string)
  Purpose: override the displayed script name in usage and help.
  Default: basename of process.argv[1]

usage(usage: string)
  Purpose: set usage instructions string, supports $0 placeholder.

command(cmd: string | string[], description: string, builder?: Function, handler?: Function)
  cmd patterns: '<cmd>' for required, '[cmd]' for optional, 'files...' for variadic.

positional(name: string, options: PositionalOptions)
  type: string | number | boolean
  describe: string
  default: any
  choices: array of allowed values
  demandOption: boolean to enforce presence

help(opt: string = 'help', message: string = 'Show help')
  Register help option and override default message.

parse(argv, context, callback)
  argv: array of strings
  context: optional object to use as this
  callback: err, argv, output => void
  Returns: parsed Arguments object or Promise<Arguments>

hideBin(argv: string[]) -> drops first two entries. Use hideBin(process.argv)

Fluent API returns same parser instance for chaining.


## Reference Details
API Specifications

Function hideBin(argv: string[]): string[]
  Parameters
    argv: array of process arguments including node and script path
  Returns
    array of strings containing user-supplied args only

Function yargs(): YargsInstance
  Returns
    YargsInstance with methods below

YargsInstance Methods

scriptName(name: string): YargsInstance
  name: string to display as command name in help

usage(usage: string): YargsInstance
  usage: string containing usage pattern, supports $0 placeholder

command(
  cmd: string | string[],
  description: string,
  builder?: (yargs: YargsInstance) => YargsInstance,
  handler?: (argv: Arguments) => void
): YargsInstance
  cmd patterns examples:
    'install <pkg>' required argument
    'remove [pkg]' optional argument
    'copy <src> [dest]' mixed
    'build [files...]' variadic
  builder: function to add options and positionals
  handler: function invoked with parsed argv

positional(
  name: string,
  options: {
    type: 'string' | 'number' | 'boolean',
    describe: string,
    default?: any,
    choices?: any[],
    demandOption?: boolean
  }
): YargsInstance

help(opt?: string, message?: string): YargsInstance
  opt: name of help flag, default 'help'
  message: help description, default 'Show help'

parse(
  argv: string[],
  context?: object,
  callback?: (err: Error, argv: Arguments, output: string) => void
): Arguments | Promise<Arguments>

Arguments Type
  argv: object mapping option names to values
  _: array of non-option arguments

Implementation Pattern

1 Create script file with shebang
2 import yargs and hideBin
3 Initialize parser: yargs()
4 Chain scriptName, usage, commands, help
5 Invoke parse(hideBin(process.argv))

Example Complete Implementation
#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs()
  .scriptName('my-cli')
  .usage('$0 <cmd> [options]')
  .command(
    'greet <user>',
    'Greet a user',
    y => y.positional('user', { type: 'string', describe: 'username' }),
    argv => console.log('Hello', argv.user)
  )
  .help()
  .strict()
  .fail((msg, err) => {
    if (err) throw err
    console.error(msg)
    process.exit(1)
  })
  .parse(hideBin(process.argv))

Best Practices

Use strict() to enforce defined commands and options
Use fail() for custom error handling
Chain command definitions before help and parse
Always hideBin(process.argv) for accurate parsing

Troubleshooting

Unknown command error:
  Run with --help to view available commands
  Example output:
    my-cli <cmd> [options]

Validate positional defaults and types
Check that builder functions return yargs instance


## Information Dense Extract
install yargs via npm install --save yargs import yargs from 'yargs' import { hideBin } from 'yargs/helpers' core methods: hideBin(argv:string[]):string[] yargs():YargsInstance scriptName(name:string) usage(usage:string) command(cmd:string|string[],desc:string,builder?:Function,handler?:Function) positional(name:string,{type:string|number|boolean,describe:string,default?:any,choices?:any[],demandOption?:boolean}) help(opt?:string,msg?:string) parse(argv:string[],context?:object,callback?:Function):Arguments|Promise. Fluent pattern: yargs().scriptName().usage().command().help().parse(hideBin(process.argv)). Use strict(), fail() for validations. Example code included.

## Sanitised Extract
Table of Contents
1 Installation
2 Basic Parser Setup
3 Defining Commands
4 Positional Arguments
5 Help Generation
6 Argument Parsing

1 Installation
Install yargs via npm
npm install --save yargs

2 Basic Parser Setup
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
Initialize parser
const parser = yargs()
Use hideBin to strip node and script path
const args = parser.parse(hideBin(process.argv))

3 Defining Commands
Method signature
.command(cmd: string | string[], description: string, builder?: (yargs) => YargsInstance, handler?: (argv) => void)
Usage example
parser.command(
  'hello [name]',
  'welcome ter yargs!',
  y => y.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' }),
  argv => console.log('hello', argv.name)
)

4 Positional Arguments
Use positional to declare arguments in command builders
.positional(name: string, options: { type: 'string' | 'number' | 'boolean'; describe: string; default?: any; choices?: any[]; demandOption?: boolean })
Example
builder.positional('name', { type: 'string', default: 'Cambi', describe: 'the name to say hello to' })

5 Help Generation
.help([opt], [message])
Generates --help option and auto prints usage

6 Argument Parsing
.parse(argv: string[], context?: object, callback?) returns parsed Arguments or Promise
.parse(hideBin(process.argv))

Use fluent chaining: scriptName, usage, command, help, parse.

## Original Source
Yargs CLI Argument Parser
https://yargs.js.org/docs/

## Digest of YARGS_CLI

# Yargs CLI Argument Parser

## Installation

Install via npm

npm install --save yargs

## Getting Started Example

#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

yargs()
  .scriptName('pirate-parser')
  .usage('$0 <cmd> [args]')
  .command(
    'hello [name]',
    'welcome ter yargs!',
    builder => builder.positional('name', {
      type    : 'string',
      default : 'Cambi',
      describe: 'the name to say hello to'
    }),
    argv => console.log('hello', argv.name, 'welcome to yargs!')
  )
  .help()
  .parse(hideBin(process.argv))

## Core Method Signatures

Function hideBin(argv: string[]): string[]

Function yargs(): YargsInstance

Method scriptName(name: string): YargsInstance
Method usage(usage: string): YargsInstance
Method command(cmd: string | string[], description: string, builder?: (yargs: YargsInstance) => YargsInstance, handler?: (argv: Arguments) => void): YargsInstance
Method positional(name: string, options: PositionalOptions): YargsInstance
Method help(opt?: string, message?: string): YargsInstance
Method parse(argv: string[], context?: object, callback?: (err: Error, argv: Arguments, output: string) => void): Arguments | Promise<Arguments>

## Configuration Options

PositionalOptions:
  type         string | number | boolean
  describe     string
  default?     any
  choices?     any[]
  demandOption? boolean

## Usage Patterns

Use hideBin to strip node and script path from process.argv.
Chain scriptName, usage, command, positional, help, parse in fluent API.

## Current Version and License

Yargs · v17 · MIT License


## Attribution
- Source: Yargs CLI Argument Parser
- URL: https://yargs.js.org/docs/
- License: License: MIT
- Crawl Date: 2025-05-09T00:39:24.675Z
- Data Size: 348060 bytes
- Links Found: 34

## Retrieved
2025-05-09
