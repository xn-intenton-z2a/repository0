# MINIMATCH

## Crawl Summary
minimatch(path:string,pattern:string,options?:MinimatchOptions):boolean. MinimatchOptions flags: debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,magicalBraces,matchBase,nocomment,nonegate,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes; optimizationLevel:number(0|1|>=2), platform:string(default process.platform). Class Minimatch(pattern:string,options?): pattern,options,set:Array<Array<RegExp|string>>,regexp,negate,comment,empty; methods: makeRe():RegExp|false, match(string):boolean, matchOne(string[],(RegExp|string)[],partial?):boolean, hasMagic():boolean. Utility: filter(pattern,options):(path)=>boolean; escape/unescape(pattern,options):string; match(list,pattern,options):string[]; makeRe(pattern,options):RegExp|false. Globstar ** matches full segment only. Brace expansion first. UNC paths: '//' prefix preserved. Backslashes escape by default; windowsPathsNoEscape:true treats backslashes as separators. Optimization levels control '../' normalization and dedupe. Negation '!' and comments '#' suppressible. Extglob differences from bash noted.

## Normalised Extract
Table of Contents:
1 Module Import
2 Core Function minimatch
3 Class Minimatch
4 Utility Functions
5 Options
6 Windows and UNC Paths
7 Optimization Levels
8 Discrepancies

1 Module Import
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

2 Core Function minimatch
Signature:
  function minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
Returns true or false. No exceptions thrown.

3 Class Minimatch
Constructor:
  new Minimatch(pattern:string, options?:MinimatchOptions)
Properties:
  pattern:string
  options:MinimatchOptions
  set:Array<Array<RegExp|string>>
  regexp:RegExp
  negate:boolean
  comment:boolean
  empty:boolean
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

4 Utility Functions
minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
minimatch.escape(pattern:string, options?:MinimatchOptions): string
minimatch.unescape(pattern:string, options?:MinimatchOptions): string
minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false

5 Options
debug: boolean = false
nobrace: boolean = false
noglobstar: boolean = false
dot: boolean = false
noext: boolean = false
nocase: boolean = false
nocaseMagicOnly: boolean = false
nonull: boolean = false
magicalBraces: boolean = false
matchBase: boolean = false
nocomment: boolean = false
nonegate: boolean = false
flipNegate: boolean = false
partial: boolean = false
windowsPathsNoEscape: boolean = false
windowsNoMagicRoot: boolean = true on win32+nocase else false
preserveMultipleSlashes: boolean = false
optimizationLevel: number = 1
platform: string = process.platform

6 Windows and UNC Paths
Use '/' only in patterns; '\\' escapes characters by default. Patterns starting '//' followed by non-slash preserve leading '//'. Patterns '//?/<drive>:/...' match '<drive>:/...' interchangeably when drive letters match case-insensitively; remainder compared case-sensitively unless nocase:true.

7 Optimization Levels
0: Keep '.' and '..' segments in-place.
1: Remove safe '../' segments and preserve dots; default.
>=2: Aggressive removal of empty and '.' segments, dedupe '{a/**/b,a/b}' -> 'a/**/b', '{*,x}' -> '*'.

8 Discrepancies
Leading '!' negates unless nonegate:true. Leading '#' treated as comment unless nocomment:true. '**' only special if alone in segment. Extglob negation differs from Bash in corner cases.

## Supplementary Details
interface MinimatchOptions {
  debug?: boolean
  nobrace?: boolean
  noglobstar?: boolean
  dot?: boolean
  noext?: boolean
  nocase?: boolean
  nocaseMagicOnly?: boolean
  nonull?: boolean
  magicalBraces?: boolean
  matchBase?: boolean
  nocomment?: boolean
  nonegate?: boolean
  flipNegate?: boolean
  partial?: boolean
  windowsPathsNoEscape?: boolean
  windowsNoMagicRoot?: boolean
  preserveMultipleSlashes?: boolean
  optimizationLevel?: number
  platform?: string
}

Implementation Steps:
1 Normalize pattern: if windowsPathsNoEscape:false, replace '\\' with '/'.
2 Expand braces unless nobrace:true.
3 Split pattern into segments on '/'.
4 Convert segments with wildcards to RegExp objects.
5 Build set[][] and combined regexp via makeRe().
6 For each path: use match() or matchOne() (partial:true for walking).
7 For lists: minimatch.match(fileList, pattern, options).

UNC Path Handling:
- Pattern '//' prefix retained when next char != '/'.
- Patterns '//?/C:/' match 'C:/' paths and vice versa when case matches.
- Use windowsPathsNoEscape:true to allow '\\' separators in pattern only on Windows.


## Reference Details
### API Specifications

Function: minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
  path: string - file path to test
  pattern: string - glob pattern
  options: MinimatchOptions - matching flags
  returns: true if match, false otherwise

Function: minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
  returns predicate for Array.filter

Function: minimatch.escape(pattern:string, options?:MinimatchOptions): string

Function: minimatch.unescape(pattern:string, options?:MinimatchOptions): string

Function: minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
  returns matched subset or [pattern] if nonull:true and no matches

Function: minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false
  returns RegExp or false if invalid

Class: Minimatch
Constructor(pattern:string, options?:MinimatchOptions)
Properties: pattern, options, set, regexp, negate, comment, empty
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

### Code Examples

// ES Module import
import minimatch, { Minimatch } from 'minimatch'

// Basic match
console.log(minimatch('src/index.js','**/*.js',{ matchBase:true })) // true

// Filter array
const jsFilter = minimatch.filter('*.js',{ nocase:true })
['a.JS','b.txt'].filter(jsFilter) // ['a.JS']

// Escape/unescape
const escaped = minimatch.escape('file?[0-9].js')
// 'file\?\[0-9\]\.js'
console.log(minimatch.unescape(escaped)) // 'file?[0-9].js'

// Using Minimatch class
const mm = new Minimatch('lib/**/*.ts',{ dot:true, optimizationLevel:2 })
const re = mm.makeRe()
console.log(re.test('lib/sub/file.ts')) // true
console.log(mm.match('lib/.hidden.ts'))      // true

// Partial matching during directory walk
const walkerMM = new Minimatch('src/**/*.js',{ partial:true })
// While recursing 'src', call walkerMM.matchOne(currentPathArray, walkerMM.set[row], true)

### Implementation Pattern
1 const pattern = userInput.replace('\\','/')
2 const mm = new Minimatch(pattern, opts)
3 if (!mm.hasMagic()) handle literal match
4 const re = mm.makeRe() // compile once
5 list.filter(minimatch.filter(pattern,opts))

### Configuration Options with Effects
- debug:true outputs parse/match log to stderr
- matchBase:true matches pattern without '/' to basename
- windowsPathsNoEscape:true allows Windows '\\' separators in pattern
- optimizationLevel:0|1|>=2 controls path normalization steps

### Best Practices
- Escape untrusted input: minimatch.escape()
- Use nonull when missing matches must be signaled
- Precompile RegExp via makeRe() for bulk matching
- Use partial:true to prune file-walker branches

### Troubleshooting
**Symptom**: Unexpected false on valid file
**Action**: Enable debug, inspect mm.set and mm.regexp
  node -e "console.log(require('minimatch').minimatch('a/.b','a/*.b',{dot:true,debug:true}))"
**Symptom**: Backslashes in pattern not matching
**Action**: set windowsPathsNoEscape:true or convert to '/'
**Symptom**: Invalid pattern returns false from makeRe()
**Action**: Catch false and fallback to string-equality or escape input


## Information Dense Extract
minimatch(path:string,pattern:string,options?:{debug?,nobrace?,noglobstar?,dot?,noext?,nocase?,nocaseMagicOnly?,nonull?,magicalBraces?,matchBase?,nocomment?,nonegate?,flipNegate?,partial?,windowsPathsNoEscape?,windowsNoMagicRoot?,preserveMultipleSlashes?,optimizationLevel?:number,platform?:string}):boolean; class Minimatch{constructor(pattern:string,options?);pattern:string;options;set:Array<Array<RegExp|string>>;regexp:RegExp;negate:boolean;comment:boolean;empty:boolean;makeRe():RegExp|false;match(string):boolean;matchOne(string[],(RegExp|string)[],boolean?):boolean;hasMagic():boolean}; util:filter(pattern,opts)->(path=>boolean);escape(pattern)->string;unescape(pattern)->string;match(list,pattern,opts)->string[];makeRe(pattern,opts)->RegExp|false; Options default false (except optimizationLevel=1,platform=process.platform); Windows:'//' prefix preserved, use '/', windowsPathsNoEscape toggles '\\' interpretation; Globstar '**' only full segment; Brace expansion then pattern parse; Optimization levels 0,1,>=2 re: '../' and dedupe; '!' negation unless nonegate; '#' comment unless nocomment.

## Sanitised Extract
Table of Contents:
1 Module Import
2 Core Function minimatch
3 Class Minimatch
4 Utility Functions
5 Options
6 Windows and UNC Paths
7 Optimization Levels
8 Discrepancies

1 Module Import
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

2 Core Function minimatch
Signature:
  function minimatch(path:string, pattern:string, options?:MinimatchOptions): boolean
Returns true or false. No exceptions thrown.

3 Class Minimatch
Constructor:
  new Minimatch(pattern:string, options?:MinimatchOptions)
Properties:
  pattern:string
  options:MinimatchOptions
  set:Array<Array<RegExp|string>>
  regexp:RegExp
  negate:boolean
  comment:boolean
  empty:boolean
Methods:
  makeRe(): RegExp | false
  match(fname:string): boolean
  matchOne(fileArray:string[], patternArray:(RegExp|string)[], partial?:boolean): boolean
  hasMagic(): boolean

4 Utility Functions
minimatch.filter(pattern:string, options?:MinimatchOptions): (path:string) => boolean
minimatch.escape(pattern:string, options?:MinimatchOptions): string
minimatch.unescape(pattern:string, options?:MinimatchOptions): string
minimatch.match(list:string[], pattern:string, options?:MinimatchOptions): string[]
minimatch.makeRe(pattern:string, options?:MinimatchOptions): RegExp | false

5 Options
debug: boolean = false
nobrace: boolean = false
noglobstar: boolean = false
dot: boolean = false
noext: boolean = false
nocase: boolean = false
nocaseMagicOnly: boolean = false
nonull: boolean = false
magicalBraces: boolean = false
matchBase: boolean = false
nocomment: boolean = false
nonegate: boolean = false
flipNegate: boolean = false
partial: boolean = false
windowsPathsNoEscape: boolean = false
windowsNoMagicRoot: boolean = true on win32+nocase else false
preserveMultipleSlashes: boolean = false
optimizationLevel: number = 1
platform: string = process.platform

6 Windows and UNC Paths
Use '/' only in patterns; '''' escapes characters by default. Patterns starting '//' followed by non-slash preserve leading '//'. Patterns '//?/<drive>:/...' match '<drive>:/...' interchangeably when drive letters match case-insensitively; remainder compared case-sensitively unless nocase:true.

7 Optimization Levels
0: Keep '.' and '..' segments in-place.
1: Remove safe '../' segments and preserve dots; default.
>=2: Aggressive removal of empty and '.' segments, dedupe '{a/**/b,a/b}' -> 'a/**/b', '{*,x}' -> '*'.

8 Discrepancies
Leading '!' negates unless nonegate:true. Leading '#' treated as comment unless nocomment:true. '**' only special if alone in segment. Extglob negation differs from Bash in corner cases.

## Original Source
minimatch – File Globbing and Pattern Matching
https://github.com/isaacs/minimatch

## Digest of MINIMATCH

# minimatch v3.4.0
Date Retrieved: 2024-06-09

# Usage
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

minimatch('bar.foo', '*.foo')       // true
minimatch('bar.foo', '*.bar')       // false
minimatch('bar.foo', '*.+(bar|foo)', { debug: true }) // true, debug prints parse details

# Features
Brace Expansion
Extended glob matching (extglob)
Globstar ** matching
POSIX character classes [[:alpha:]] (Unicode-aware)

# Class Minimatch
## Constructor
new Minimatch(pattern: string, options?: MinimatchOptions)

## Properties
pattern              The original pattern string
options              MinimatchOptions used for parsing
set                  Array of arrays of RegExp|string segments (after brace expansion)
regexp               Combined RegExp for full-pattern matching (from makeRe)
negate               true if pattern starts with '!'
comment              true if pattern is a comment (#...)
empty                true if pattern is empty string

## Methods
makeRe(): RegExp | false    Generate or return existing regexp; false if invalid
match(fname: string): boolean     Test single filename against pattern
matchOne(fileArray: string[], patternArray: (RegExp|string)[], partial?: boolean): boolean  Internal segment-by-segment matcher
hasMagic(): boolean       true if pattern contains any magic (braces, glob chars)

# Utility Functions
minimatch(path: string, pattern: string, options?: MinimatchOptions): boolean
minimatch.filter(pattern: string, options?: MinimatchOptions): (path: string) => boolean
minimatch.escape(pattern: string, options?: MinimatchOptions): string
minimatch.unescape(pattern: string, options?: MinimatchOptions): string
minimatch.match(list: string[], pattern: string, options?: MinimatchOptions): string[]
minimatch.makeRe(pattern: string, options?: MinimatchOptions): RegExp | false

# Options (all boolean unless noted)
debug               false  Print detailed parse/match debug
nobrace             false  Disable {a,b} and {1..3} expansion
noglobstar          false  Disable ** matching folders
dot                 false  Allow names starting with '.' to match
noext               false  Disable extglob +(...) patterns
nocase              false  Case-insensitive match
nocaseMagicOnly     false  With nocase, only regex parts ignore case
nonull              false  Return [pattern] if no matches
magicalBraces       false  Count brace sets as magic for hasMagic()
matchBase           false  Match basename when no slashes in pattern
nocomment           false  Treat leading '#' as literal
nonegate            false  Treat leading '!' as literal
flipNegate          false  Swap negate logic (true on non-match)
partial             false  Allow partial path matches (for walkers)
windowsPathsNoEscape false Use '\\' only as separator, not escape
windowsNoMagicRoot  default on win32 when nocase  Keep root string-literal
preserveMultipleSlashes false Preserve '///' sequences
optimizationLevel   1      0|1|>=2 pattern normalization aggressiveness
platform            process.platform  'win32' or other


## Attribution
- Source: minimatch – File Globbing and Pattern Matching
- URL: https://github.com/isaacs/minimatch
- License: License
- Crawl Date: 2025-05-10T01:24:10.253Z
- Data Size: 601192 bytes
- Links Found: 4607

## Retrieved
2025-05-10
