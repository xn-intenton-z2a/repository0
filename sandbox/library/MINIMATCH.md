# MINIMATCH

## Crawl Summary
Direct API: minimatch(), filter(), match(), makeRe(), escape(), unescape(); Class Minimatch with constructor, properties (pattern, options, set, regexp, flags) and methods (makeRe, match, matchOne, hasMagic); Options list with type and defaults; Windows and UNC path rules; Glob features: brace expansion, extglob, globstar, POSIX classes; Performance optimizationLevel 0,1,2.

## Normalised Extract
Table of Contents
1 Installation & Import
2 Core API Functions
3 Minimatch Class Details
4 Options Reference
5 Windows & UNC Path Rules
6 Glob Features & Syntax
7 Optimization Levels
8 Troubleshooting

1 Installation & Import
npm install minimatch@10.0.1
import { minimatch } from 'minimatch'
or const { minimatch } = require('minimatch')

2 Core API Functions
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

3 Minimatch Class Details
new Minimatch(pattern: string, options?: Options)
Properties: pattern, options, set:Array<Array<RegExp|string>>, regexp:RegExp|false, negate:boolean, comment:boolean, empty:boolean
Methods: makeRe():RegExp|false, match(fpath:string):boolean, matchOne(fileArr:string[],patternArr:string[],partial?:boolean):boolean, hasMagic():boolean

4 Options Reference
option               type     default  effect
debug                boolean  false    log info to stderr
nobrace              boolean  false    disable {a,b} expansion
noglobstar           boolean  false    disable ** matching
dot                  boolean  false    allow .file matches
noext                boolean  false    disable extglob patterns
nocase               boolean  false    case-insensitive matching
nocaseMagicOnly      boolean  false    regex case-ignore on regex parts only
nonull               boolean  false    return [pattern] when no match
matchBase            boolean  false    match basename for patterns without /
magicalBraces        boolean  false    treat braces as magic in hasMagic
nonegate             boolean  false    disable ! negation
nocomment            boolean  false    disable leading # comments
flipNegate           boolean  false    invert negate result
partial              boolean  false    allow prefix matching in directory walks
windowsPathsNoEscape boolean  false    keep backslash as path separator only
windowsNoMagicRoot   boolean  true     preserve root-case regex(Windows/nocase)
preserveMultipleSlashes boolean false compress // to /
optimizationLevel    number   1       pattern preprocessing level
platform             string   process.platform override as 'win32'

5 Windows & UNC Path Rules
Pattern path separators: /
Backslash in pattern escapes next char unless windowsPathsNoEscape true
UNC: //?/c:/path and //host/share; preserve // at start; treat ? literally in //?/

6 Glob Features & Syntax
Brace Expansion: {a,b}, {1..3}
Extglob: +(a|b), !(x), ?(y)
Globstar: ** matches zero or more directories when alone in path segment
POSIX classes: [[:alpha:]], [[:digit:]], support Unicode

7 Optimization Levels
0: no changes, . and .. preserved
1: remove safe ../ segments
2: aggressive: collapse multiple **, remove ., dedupe patterns

8 Troubleshooting
Pattern returns no match: verify path slash style, use matchBase:true for basenames
Include dotfiles: set dot:true
Verbose debugging: set debug:true
No matches array: set nonull:true to return [pattern]
Invalid pattern: match returns false, makeRe returns false


## Supplementary Details
Parameter Examples
matchBase:true matches '*.js' to '/path/file.js'
partial:true treats '/a/b' against '/a/*/c' as possible match
windowsPathsNoEscape:true allows using path.join output in pattern
optimizationLevel:2 for large directory globs to improve performance
platform:'win32' to simulate Windows behavior on other OS

Implementation Steps
1. npm install minimatch@10.0.1
2. import directly or via require
3. choose API: direct call or filter, match functions
4. configure options per environment (dot, nocase, matchBase)
5. compile RegExp with makeRe for custom use
6. instantiate Minimatch for repeated matches or tree walking
7. use optimizationLevel 2 for heavy file-walk scenarios
8. apply windowsPathsNoEscape when running on Windows with path.resolve outputs


## Reference Details
API Signatures
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

Options Interface
interface Options {
  debug?: boolean
  nobrace?: boolean
  noglobstar?: boolean
  dot?: boolean
  noext?: boolean
  nocase?: boolean
  nocaseMagicOnly?: boolean
  nonull?: boolean
  matchBase?: boolean
  magicalBraces?: boolean
  nonegate?: boolean
  nocomment?: boolean
  flipNegate?: boolean
  partial?: boolean
  windowsPathsNoEscape?: boolean
  windowsNoMagicRoot?: boolean
  preserveMultipleSlashes?: boolean
  optimizationLevel?: number
  platform?: string
}

Examples
import { minimatch } from 'minimatch';
const ok = minimatch('bar.foo','*.foo',{debug:true}); // true
const filterJs = minimatch.filter('*.js',{matchBase:true});
const jsList = files.filter(filterJs);
const re = minimatch.makeRe('src/**/*.ts',{dot:true,nocase:true});
if(re.test('src/example.ts')) console.log('match');

const mm = new Minimatch('**/*.md',{dot:true,partial:true});
mm.makeRe();
mm.match('README.md');

Best Practices
- Always use forward-slashes in patterns
- Use dot:true to include dotfiles
- Use matchBase:true for simple filename patterns
- Use optimizationLevel:2 for file-walker utilities
- Use makeRe for RegExp reuse

Troubleshooting Commands
// Debug detailed matching
console.log(minimatch('a/b','a/*',{debug:true}));
// Return pattern on no match
minimatch.match([], 'x/*.js',{nonull:true}); // ['x/*.js']



## Information Dense Extract
minimatch(path: string,pattern: string,options?):boolean; filter(pattern,options?):fn; match(list,pattern,options?):string[]; makeRe(pattern,options?):RegExp; escape(pattern):string; unescape(pattern):string; Class Minimatch(pattern,options){pattern,options,set:Array<Array<RegExp|string>>,regexp:RegExp|false,negate,comment,empty}.methods makeRe(),match(),matchOne(),hasMagic().Options(default false):debug,nobrace,noglobstar,dot,noext,nocase,nocaseMagicOnly,nonull,matchBase,magicalBraces,nonegate,nocomment,flipNegate,partial,windowsPathsNoEscape,windowsNoMagicRoot,preserveMultipleSlashes; optimizationLevel:0|1|2; platform:string. Windows: use /; UNC //?/c:/ preserve root; windowsPathsNoEscape for backslash separators. Glob features: {a,b}, extglob, ** globstar, POSIX classes. Perf: level1 remove ../, level2 aggressive. Troubleshoot: debug:true, nonull:true, matchBase:true.

## Sanitised Extract
Table of Contents
1 Installation & Import
2 Core API Functions
3 Minimatch Class Details
4 Options Reference
5 Windows & UNC Path Rules
6 Glob Features & Syntax
7 Optimization Levels
8 Troubleshooting

1 Installation & Import
npm install minimatch@10.0.1
import { minimatch } from 'minimatch'
or const { minimatch } = require('minimatch')

2 Core API Functions
minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

3 Minimatch Class Details
new Minimatch(pattern: string, options?: Options)
Properties: pattern, options, set:Array<Array<RegExp|string>>, regexp:RegExp|false, negate:boolean, comment:boolean, empty:boolean
Methods: makeRe():RegExp|false, match(fpath:string):boolean, matchOne(fileArr:string[],patternArr:string[],partial?:boolean):boolean, hasMagic():boolean

4 Options Reference
option               type     default  effect
debug                boolean  false    log info to stderr
nobrace              boolean  false    disable {a,b} expansion
noglobstar           boolean  false    disable ** matching
dot                  boolean  false    allow .file matches
noext                boolean  false    disable extglob patterns
nocase               boolean  false    case-insensitive matching
nocaseMagicOnly      boolean  false    regex case-ignore on regex parts only
nonull               boolean  false    return [pattern] when no match
matchBase            boolean  false    match basename for patterns without /
magicalBraces        boolean  false    treat braces as magic in hasMagic
nonegate             boolean  false    disable ! negation
nocomment            boolean  false    disable leading # comments
flipNegate           boolean  false    invert negate result
partial              boolean  false    allow prefix matching in directory walks
windowsPathsNoEscape boolean  false    keep backslash as path separator only
windowsNoMagicRoot   boolean  true     preserve root-case regex(Windows/nocase)
preserveMultipleSlashes boolean false compress // to /
optimizationLevel    number   1       pattern preprocessing level
platform             string   process.platform override as 'win32'

5 Windows & UNC Path Rules
Pattern path separators: /
Backslash in pattern escapes next char unless windowsPathsNoEscape true
UNC: //?/c:/path and //host/share; preserve // at start; treat ? literally in //?/

6 Glob Features & Syntax
Brace Expansion: {a,b}, {1..3}
Extglob: +(a|b), !(x), ?(y)
Globstar: ** matches zero or more directories when alone in path segment
POSIX classes: [[:alpha:]], [[:digit:]], support Unicode

7 Optimization Levels
0: no changes, . and .. preserved
1: remove safe ../ segments
2: aggressive: collapse multiple **, remove ., dedupe patterns

8 Troubleshooting
Pattern returns no match: verify path slash style, use matchBase:true for basenames
Include dotfiles: set dot:true
Verbose debugging: set debug:true
No matches array: set nonull:true to return [pattern]
Invalid pattern: match returns false, makeRe returns false

## Original Source
Minimatch Pattern Matching
https://www.npmjs.com/package/minimatch

## Digest of MINIMATCH

# Minimatch Pattern Matching

Retrieved: 2024-06-20
Data Size: 654687 bytes

# Usage

Install: npm install minimatch@10.0.1

Import:
import { minimatch } from 'minimatch'
const { minimatch } = require('minimatch')

Call:
minimatch(path: string, pattern: string, options?: Options) -> boolean

# Core API Functions

minimatch(path: string, pattern: string, options?: Options): boolean
minimatch.filter(pattern: string, options?: Options): (path: string)=>boolean
minimatch.match(list: string[], pattern: string, options?: Options): string[]
minimatch.makeRe(pattern: string, options?: Options): RegExp
minimatch.escape(pattern: string, options?: Options): string
minimatch.unescape(pattern: string, options?: Options): string

# Minimatch Class

Constructor:
new Minimatch(pattern: string, options?: Options)

Properties:
pattern: string
options: Options
set: Array<Array<RegExp|string>>
regexp: RegExp|false
negate: boolean
comment: boolean
empty: boolean

Methods:
makeRe(): RegExp|false
match(fpath: string): boolean
matchOne(fileArr: string[], patternArr: string[], partial?: boolean): boolean
hasMagic(): boolean

# Configuration Options

All options default to false except optimizationLevel (1) and platform (process.platform).
  debug              boolean
  nobrace            boolean
  noglobstar         boolean
  dot                boolean
  noext              boolean
  nocase             boolean
  nocaseMagicOnly    boolean
  nonull             boolean
  matchBase          boolean
  magicalBraces      boolean
  nonegate           boolean
  nocomment          boolean
  flipNegate         boolean
  partial            boolean
  windowsPathsNoEscape boolean
  windowsNoMagicRoot boolean (win32 default true)
  preserveMultipleSlashes boolean
  optimizationLevel number (0,1,2+)
  platform           string

# Windows & UNC

Use forward slash in patterns. Backslashes escape.
windowsPathsNoEscape: treat backslashes only as separators.
windowsNoMagicRoot: preserve case in UNC or drive roots.
UNC support: patterns starting with //?/, //host/share.

# Performance Levels

0: no path simplification (preserve . and ..)
1: remove safe ../ segments (default)
2: aggressive file-walk optimizations (dedupe **, collapse .)



## Attribution
- Source: Minimatch Pattern Matching
- URL: https://www.npmjs.com/package/minimatch
- License: License
- Crawl Date: 2025-05-06T12:32:16.191Z
- Data Size: 654687 bytes
- Links Found: 1823

## Retrieved
2025-05-06
