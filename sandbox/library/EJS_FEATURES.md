# EJS_FEATURES

## Crawl Summary
Use plain JavaScript templates. No custom syntax. Scriptlet tags `<% %>` for code, `<%= %>` for output. Compiled functions are cached. Debugging shows JS exceptions with line numbers. Active community.

## Normalised Extract
Table of Contents:
1. Plain JavaScript Templating
2. Scriptlet Tag Syntax
3. Template Compilation and Caching
4. Debugging Error Reporting
5. Community and Maintenance

1. Plain JavaScript Templating
Templates are authored entirely in JavaScript. No preprocessing or custom DSL required. Use any JS constructs directly.

2. Scriptlet Tag Syntax
Use `<% code %>` to execute statements without output. Use `<%= expression %>` to output escaped HTML. Use `<%- expression %>` to output unescaped raw HTML.

3. Template Compilation and Caching
EJS compiles `.ejs` files into JavaScript functions on first render. Set `cache: true` to enable LRU caching by file path. Caching avoids re-compilation on subsequent renders.

4. Debugging Error Reporting
Errors thrown during template execution include template filename and line number. Enable `compileDebug: true` to embed debug instrumentation in compiled functions.

5. Community and Maintenance
EJS is under active development. Report issues via GitHub. Use the latest npm release for bug fixes.

## Supplementary Details
Configuration Options:
- delimiter: String, default '%', custom tag delimiter character.
- cache: Boolean, default false, enable caching compiled templates in memory.
- filename: String, required for accurate error messages and caching key.
- compileDebug: Boolean, default true, include debug instrumentation.
- rmWhitespace: Boolean, default false, remove all safe-to-remove whitespace.

Implementation Steps:
1. Install: `npm install ejs`
2. Require module: `const ejs = require('ejs')`
3. Render string: `ejs.render(templateString, data, options)`
4. Render file: `ejs.renderFile(filePath, data, options, callback)`

## Reference Details
API Specifications:

Method: ejs.render(template:String, data:Object, options:Object):String
- template: template source string
- data: key/value pairs for template context
- options:
  - filename:String (for caching and errors)
  - delimiter:String
  - cache:Boolean
  - compileDebug:Boolean
  - rmWhitespace:Boolean
Returns rendered HTML string.

Method: ejs.renderFile(path:String, data:Object, options:Object, callback:Function(err, str))
- path: filesystem path to `.ejs` file
- data: context object
- options: same as render
- callback: receives error or rendered string

Implementation Pattern:
```
const ejs = require('ejs');
const options = {cache: true, filename: 'template.ejs'};
ejs.renderFile('views/template.ejs', {user: 'Alice'}, options, (err, html) => {
  if (err) console.error('Render error:', err);
  else console.log(html);
});
```

Best Practices:
- Always set `filename` when using caching to avoid collisions.
- Use LRU cache in production: `ejs.cache = new LRU({ max: 100 });`
- Sanitize user input or use `<%- %>` only when safe.

Troubleshooting:
- Command: `DEBUG=ejs node app.js` enables detailed compile debug output.
- Common Error: "Could not find include" requires correct relative `filename` in options.
- Inspect compiled function: `const fn = ejs.compile(str, options); console.log(fn.toString());`

## Information Dense Extract
Plain JS templating via `<% %>`, `<%= %>`, `<%- %>`. compileDebug:true includes source map comments. cache:true + filename:String => in-memory LRU caching. Options: delimiter:String, rmWhitespace:Boolean. Methods: render(string,data,opts):String; renderFile(path,data,opts,cb). Best: set filename for caching, use LRU of size N. Debug: DEBUG=ejs, fn=compile(src,opts).

## Sanitised Extract
Table of Contents:
1. Plain JavaScript Templating
2. Scriptlet Tag Syntax
3. Template Compilation and Caching
4. Debugging Error Reporting
5. Community and Maintenance

1. Plain JavaScript Templating
Templates are authored entirely in JavaScript. No preprocessing or custom DSL required. Use any JS constructs directly.

2. Scriptlet Tag Syntax
Use '<% code %>' to execute statements without output. Use '<%= expression %>' to output escaped HTML. Use '<%- expression %>' to output unescaped raw HTML.

3. Template Compilation and Caching
EJS compiles '.ejs' files into JavaScript functions on first render. Set 'cache: true' to enable LRU caching by file path. Caching avoids re-compilation on subsequent renders.

4. Debugging Error Reporting
Errors thrown during template execution include template filename and line number. Enable 'compileDebug: true' to embed debug instrumentation in compiled functions.

5. Community and Maintenance
EJS is under active development. Report issues via GitHub. Use the latest npm release for bug fixes.

## Original Source
EJS
https://ejs.co/

## Digest of EJS_FEATURES

# EJS Core Features

## Use plain JavaScript
We love JavaScript. It's a totally friendly language. All templating languages grow to be Turing-complete. Cut out the middle-man and use JS directly in your templates.

## Fast development time
No need to learn custom syntax or preprocess data. Templates are authored as plain JavaScript within scriptlet tags.

## Simple syntax
Embed JavaScript statements with `<% code %>` and output values with `<%= value %>`.

## Speedy execution
EJS compiles templates to intermediate JavaScript functions and caches them for reuse, leveraging V8 and other JS runtime optimizations.

## Easy debugging
Runtime errors in templates surface as JavaScript exceptions with accurate template line numbers.

## Active development
EJS is maintained by an active community, with frequent updates and support channels.

## Attribution
- Source: EJS
- URL: https://ejs.co/
- License: MIT
- Crawl Date: 2025-05-11T06:29:44.194Z
- Data Size: 9176 bytes
- Links Found: 33

## Retrieved
2025-05-11
