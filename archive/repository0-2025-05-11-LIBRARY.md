sandbox/library/MINIMATCH.md
# sandbox/library/MINIMATCH.md
# MINIMATCH

## Crawl Summary
minimatch converts glob patterns to RegExp: minimatch(path, pattern, options) returns boolean. Core API: filter returns predicate, match filters arrays, makeRe compiles RegExp, escape/unescape handle magic chars. Minimatch class exposes pattern, options, set (expanded segments), regexp, negate, comment, empty. Options(default false): debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes,optimizationLevel(0|1|2),platform. Supports brace expansion, extglob, **, posix classes. Windows: patterns use '/', UNC special handling preserving '//' prefix and case rules. makeRe returns false on invalid patterns. matchOne for internal partial matching. hasMagic() detects glob meta.

## Normalised Extract
Table of Contents
1 Installation and Import
2 Core Functions
3 Minimatch Class
4 API Methods and Signatures
5 Configuration Options

1 Installation and Import
npm install minimatch
ESM: import { minimatch } from 'minimatch'
CJS: const { minimatch } = require('minimatch')

2 Core Functions
minimatch(path: string, pattern: string, options?: Options): boolean    Tests path against pattern
minimatch.filter(pattern: string, options?: Options): (path: string) => boolean    Returns predicate for Array.filter
minimatch.match(list: string[], pattern: string, options?: Options): string[]    Returns matched subset or [pattern] if nonull
minimatch.makeRe(pattern: string, options?: Options): RegExp | false    Compiles pattern
minimatch.escape(pattern: string, options?: Options): string    Escapes glob chars
minimatch.unescape(pattern: string, options?: Options): string    Removes escapes

3 Minimatch Class
new Minimatch(pattern: string, options?: Options)
Properties:
 pattern: original pattern
 options: Options object
 set: Array<string|RegExp>[] expanded path segments
 regexp: RegExp | false full regex
 negate: boolean
 comment: boolean
 empty: boolean
Methods:
 makeRe(): RegExp | false
 match(file: string): boolean
 matchOne(fileParts: string[], patternParts: Array<string|RegExp>, partial?: boolean): boolean
 hasMagic(): boolean

4 API Methods and Signatures
(minimatch, filter, match, makeRe, escape, unescape) signatures as above

5 Configuration Options
All boolean default false:
 debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes
 optimizationLevel: 0|1|2 default 1
 platform: string default process.platform

## Supplementary Details
Default Options Values:
 debug:false  logs parsing details
 nobrace:false disables {a,b} and {1..n}
 noglobstar:false disables ** matching
 dot:false excludes leading . files
 noext:false disables extglob
 nocase:false case-insensitive
 nocaseMagicOnly:false only regex parts ignore case
 nonull:false returns [] on no match
 magicalBraces:false hasMagic counts braces
 matchBase:false match base name for patterns without /
 nocomment:false '#' at start is comment
 nonegate:false '!' negates pattern
 flipNegate:false invert negate return
 partial:false partial path matching
 windowsPathsNoEscape:false '\\' as escape
 windowsNoMagicRoot:true on win32+nocase
 preserveMultipleSlashes:false compress '///'
 optimizationLevel:1 moderate optimization
 platform:process.platform

Windows Patterns:
Use '/' only. '\\' in pattern escapes next char unless windowsPathsNoEscape:true which converts '\\' to '/'.
UNC Patterns: '//*' matches '//x', patterns '//?/C:/' treat '?/' literal. Case-insensitive drive letters. nocase:true makes rest case-insensitive.

Pattern Expansion:
Brace expansion then parsing. extglob applied after braces.
negation: leading '!' toggles negate unless nonegate:true
comment: leading '#' ignored unless nocomment:true

## Reference Details
Function Signatures and Descriptions:
minimatch(path: string, pattern: string, options?: Options): boolean
Example: minimatch('src/index.js','**/*.js',{matchBase:true}) //true
 Throws: none

minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
Example: const jsFilter = minimatch.filter('*.js',{dot:true}); files.filter(jsFilter)

minimatch.match(list: string[], pattern: string, options?: Options): string[]
Returns : matched array or [pattern] if options.nonull
Example: minimatch.match(['a.js','b.ts'],'*.js') //['a.js']

minimatch.makeRe(pattern: string, options?: Options): RegExp | false
Returns: RegExp object or false if invalid pattern
Example: const rx= minimatch.makeRe('*.{js,ts}'); ['a.js','b.ts'].filter(f=>rx.test(f))

minimatch.escape(pattern: string, options?: Options): string
Escapes magic chars: '*'->'[*]' if windowsPathsNoEscape else '\*'

minimatch.unescape(pattern: string, options?: Options): string
Removes escapes: '[*]'->'*', '\*'->'*' only when !windowsPathsNoEscape

Minimatch Class:
Constructor: new Minimatch(pattern: string, options?: Options)
Properties:
 pattern:string
 options:Options
 set:Array<string|RegExp>[]
 regexp:RegExp|false
 negate:boolean
 comment:boolean
 empty:boolean
Methods:
 makeRe(): RegExp|false
 match(path: string): boolean
 matchOne(pathParts: string[],patternParts:Array<string|RegExp>,partial?:boolean): boolean
 hasMagic(): boolean

Best Practices:
Reuse Regex: call makeRe once and test multiple paths
Use filter for performance: files.filter(minimatch.filter(pattern))
Set nocase:true for case-insensitive file systems
Use optimizationLevel:2 during large directory walks and call minimatch.levelTwoFileOptimize on paths before regex matching

Troubleshooting:
Enable debug:true to print verbose parse: node script.js 2>&1| grep minimatch
Invalid pattern: makeRe returns false, catch and fallback
Unexpected no match on dotfiles: set dot:true
UNC path mismatches: verify windowsPathsNoEscape and double slash prefix handling
Examples:
npm install minimatch
// filter example
import { minimatch } from 'minimatch'
import fs from 'fs'
const files=fs.readdirSync('.')
const js=files.filter(minimatch.filter('**/*.js',{dot:true}))
console.log(js)

## Information Dense Extract
minimatch(path:string,pattern:string,opts?:Options):boolean; filter(pattern:string,opts?:Options):(string)=>boolean; match(list:string[],pattern:string,opts?:Options):string[]; makeRe(pattern:string,opts?:Options):RegExp|false; escape(pattern:string,opts?:Options):string; unescape(pattern:string,opts?:Options):string. Class Minimatch(pattern:string,opts?:Options): properties pattern,options,set:Array<string|RegExp>[],regexp:RegExp|false,negate,comment,empty; methods makeRe():RegExp|false,match(file:string):boolean,matchOne(parts:string[],pat:Array<string|RegExp>,partial?:boolean):boolean,hasMagic():boolean. Options all boolean default false: debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes; optimizationLevel:0|1|2 default1; platform:string default process.platform. Syntax: braceExp,extglob,**,posix classes. Windows: use '/', UNC preserve '//', drive letters case-insensitive, nocase:true for case-insensitive segments.

## Sanitised Extract
Table of Contents
1 Installation and Import
2 Core Functions
3 Minimatch Class
4 API Methods and Signatures
5 Configuration Options

1 Installation and Import
npm install minimatch
ESM: import { minimatch } from 'minimatch'
CJS: const { minimatch } = require('minimatch')

2 Core Functions
minimatch(path: string, pattern: string, options?: Options): boolean    Tests path against pattern
minimatch.filter(pattern: string, options?: Options): (path: string) => boolean    Returns predicate for Array.filter
minimatch.match(list: string[], pattern: string, options?: Options): string[]    Returns matched subset or [pattern] if nonull
minimatch.makeRe(pattern: string, options?: Options): RegExp | false    Compiles pattern
minimatch.escape(pattern: string, options?: Options): string    Escapes glob chars
minimatch.unescape(pattern: string, options?: Options): string    Removes escapes

3 Minimatch Class
new Minimatch(pattern: string, options?: Options)
Properties:
 pattern: original pattern
 options: Options object
 set: Array<string|RegExp>[] expanded path segments
 regexp: RegExp | false full regex
 negate: boolean
 comment: boolean
 empty: boolean
Methods:
 makeRe(): RegExp | false
 match(file: string): boolean
 matchOne(fileParts: string[], patternParts: Array<string|RegExp>, partial?: boolean): boolean
 hasMagic(): boolean

4 API Methods and Signatures
(minimatch, filter, match, makeRe, escape, unescape) signatures as above

5 Configuration Options
All boolean default false:
 debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes
 optimizationLevel: 0|1|2 default 1
 platform: string default process.platform

## Original Source
minimatch Glob Matching Library
https://github.com/isaacs/minimatch

## Digest of MINIMATCH

# Usage

import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

minimatch('bar.foo', '*.foo') // true
minimatch('bar.foo', '*.bar') // false
minimatch('bar.foo', '*.+(bar|foo)', { debug: true }) // true, logs internal steps

# Features

- Brace Expansion: {a,b,c}, {1..3}
- Extended Glob: +(pattern)|?(pattern)|!(pattern)|@(pattern)
- Globstar: ** matches zero or more directories
- Posix Classes: [[:alpha:]] matches unicode letters

# Minimatch Class

Create: new Minimatch(pattern: string, options?: Options)

Properties:
pattern: string
options: Options
set: Array<string|RegExp>[]
regexp: RegExp | false
negate: boolean
comment: boolean
empty: boolean

Methods:
makeRe(): RegExp | false
match(file: string): boolean
matchOne(fileParts: string[], patternParts: Array<string|RegExp>, partial?: boolean): boolean
hasMagic(): boolean

# API

minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string) => boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp | false
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

## Attribution
- Source: minimatch Glob Matching Library
- URL: https://github.com/isaacs/minimatch
- License: License: MIT
- Crawl Date: 2025-05-11T12:31:35.179Z
- Data Size: 2029498 bytes
- Links Found: 6485

## Retrieved
2025-05-11
