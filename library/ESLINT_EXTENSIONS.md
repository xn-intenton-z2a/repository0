# ESLINT_EXTENSIONS

## Crawl Summary
Ways to Extend ESLint: Create Plugins, Custom Rule Tutorial, Custom Rules, Custom Formatters, Custom Parsers, Custom Processors, Share Configurations. Each section details actual implementation patterns: plugin development with a complete rule object structure; custom rule creation with RuleTester usage; formatter function signature; parser extension exposing parse and parseForESLint; processor with preprocess and postprocess functions; sharable configurations with plugins and rule definitions.

## Normalised Extract
Table of Contents:
1. Ways to Extend ESLint
2. Create Plugins
3. Custom Rule Tutorial
4. Custom Rules
5. Custom Formatters
6. Custom Parsers
7. Custom Processors
8. Share Configurations

1. Ways to Extend ESLint:
- Extend ESLint by using plugins, custom rules, formatters, parsers, processors, and sharable configurations.

2. Create Plugins:
- Export an object with a property 'rules'.
- Each rule contains:
  meta: { docs: { description: string, category: string, recommended: boolean }, fixable: string, schema: array }.
- The 'create' method receives a context and returns a mapping of AST nodes to functions.

3. Custom Rule Tutorial:
- Use RuleTester (constructor accepts parserOptions e.g. { ecmaVersion: 6 }) to validate custom rule behavior.
- Define tests with valid code samples and invalid code samples with error arrays.

4. Custom Rules:
- Define a rule object with a 'create' function (signature: create(context: RuleContext) returns { nodeType: function(node: ASTNode) })

5. Custom Formatters:
- A formatter is a function with signature: formatter(results: Array<LintResult>) returns string.

6. Custom Parsers:
- Export a function parse(code: string, options?: Object) returning AST.
- Optionally export parseForESLint for extended integration.

7. Custom Processors:
- Define a processor with methods: preprocess(text: string, filename: string): Array<string> and postprocess(messages: Array<Array<LintMessage>>, filename: string): Array<LintMessage>.

8. Share Configurations:
- Export a configuration object that includes plugins, rules, and extends arrays. For instance, adding a plugin in the plugins array and setting rule error levels in the rules object.

## Supplementary Details
Plugin Development Specifications:
- Rule Object must include meta and create keys.
- meta.docs contains description (string), category (string), recommended (boolean).
- fixable key accepts 'code' or 'whitespace'.
- schema is an empty array or JSON schema definition.
- Implementation Pattern: module.exports = { rules: { ruleName: { meta: {...}, create: function(context) { return { AstNodeType: function(node) { // logic } }; } } } }.

Custom Rule Tester Implementation:
- Use RuleTester from 'eslint'.
- Instantiate using new RuleTester({ parserOptions: { ecmaVersion: 6 } }).
- Call .run(ruleName, rule, { valid: [ { code: "var a = 1;" } ], invalid: [ { code: "var a = 1; a;", errors: [{ message: "Unexpected identifier" }] } ] }).

Formatter Implementation:
- Define a function taking lint results array and return a formatted string.

Custom Parser Requirements:
- Must implement parse(code: string, options?: Object): AST and optionally parseForESLint(code: string, options?: Object): { ast: AST, services: Object, visitorKeys: Object }.

Processor Requirements:
- Must implement preprocess(text: string, filename: string): Array<string> and postprocess(messages: Array<Array<LintMessage>>, filename: string): Array<LintMessage>.

Sharable Configuration:
- Export configuration object with keys: plugins (array), rules (object mapping rule names to error levels), and extends (array). Example default values: rules: { "pluginName/ruleName": "error" }.

## Reference Details
API Specifications:
1. Rule Object:
   - meta: {
       docs: {
         description: string,
         category: string,
         recommended: boolean
       },
       fixable: 'code' | 'whitespace' | undefined,
       schema: Array
     }
   - create(context: RuleContext): { [nodeType: string]: (node: ASTNode) => void }

2. RuleTester:
   - Constructor: new RuleTester(options: { parserOptions: { ecmaVersion: number } })
   - Method: run(ruleName: string, rule: RuleModule, tests: { valid: Array<{ code: string }>, invalid: Array<{ code: string, errors: Array<{ message: string }> }> }): void

3. Formatter Function:
   - Signature: function formatter(results: Array<LintResult>): string

4. Parser Functions:
   - parse(code: string, options?: Object): AST
   - parseForESLint?(code: string, options?: Object): { ast: AST, services: Object, visitorKeys: Object }

5. Processor Functions:
   - preprocess(text: string, filename: string): Array<string>
   - postprocess(messages: Array<Array<LintMessage>>, filename: string): Array<LintMessage>

Implementation Examples:
- Plugin Module Export:
module.exports = {
  rules: {
    'no-unused-vars': {
      meta: {
        docs: { description: 'disallow unused variables', category: 'Variables', recommended: true },
        fixable: 'code',
        schema: []
      },
      create: function(context) {
        return {
          Identifier: function(node) {
            // Implementation logic goes here
          }
        };
      }
    }
  }
};

- RuleTester Usage:
const RuleTester = require('eslint').RuleTester;
const rule = require('path/to/rule');
const tester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
tester.run('no-unused-vars', rule, {
  valid: [{ code: 'var a = 1;' }],
  invalid: [{ code: 'var a = 1; a;', errors: [{ message: 'Unexpected identifier' }] }]
});

Configuration Options:
- .eslintrc.json can include:
  {
    "plugins": ["pluginName"],
    "rules": { "pluginName/ruleName": "error" },
    "extends": ["eslint:recommended"]
  }

Troubleshooting Procedures:
- Command: eslint --debug <file.js>
  Expected Output: Verbose logging of rule execution and parser processing steps.
- Ensure parser is correctly referenced in configuration if using a custom parser.
- Verify ruleTester tests pass by running the test suite with a node test runner (e.g., mocha or jest).

## Information Dense Extract
Extend ESLint: Use plugins, custom rules, formatters, parsers, processors, share configs. Plugin module exports { rules: { ruleName: { meta: { docs: { description, category, recommended:boolean }, fixable: 'code'|'whitespace', schema: [] }, create(context): { NodeType: function(node) } } } }. RuleTester: new RuleTester({ parserOptions: { ecmaVersion: number } }).run(ruleName, rule, { valid: [{ code }], invalid: [{ code, errors: [{ message }] }] }). Formatter: function(results:Array) returns string. Parser: parse(code:string, options?:Object):AST; parseForESLint?(code, options):{ ast, services, visitorKeys }. Processor: { preprocess(text,filename):Array, postprocess(messages,filename):Array }. Config: { plugins: [string], rules: { "pluginName/ruleName": "error" }, extends: [string] }.

## Sanitised Extract
Table of Contents:
1. Ways to Extend ESLint
2. Create Plugins
3. Custom Rule Tutorial
4. Custom Rules
5. Custom Formatters
6. Custom Parsers
7. Custom Processors
8. Share Configurations

1. Ways to Extend ESLint:
- Extend ESLint by using plugins, custom rules, formatters, parsers, processors, and sharable configurations.

2. Create Plugins:
- Export an object with a property 'rules'.
- Each rule contains:
  meta: { docs: { description: string, category: string, recommended: boolean }, fixable: string, schema: array }.
- The 'create' method receives a context and returns a mapping of AST nodes to functions.

3. Custom Rule Tutorial:
- Use RuleTester (constructor accepts parserOptions e.g. { ecmaVersion: 6 }) to validate custom rule behavior.
- Define tests with valid code samples and invalid code samples with error arrays.

4. Custom Rules:
- Define a rule object with a 'create' function (signature: create(context: RuleContext) returns { nodeType: function(node: ASTNode) })

5. Custom Formatters:
- A formatter is a function with signature: formatter(results: Array<LintResult>) returns string.

6. Custom Parsers:
- Export a function parse(code: string, options?: Object) returning AST.
- Optionally export parseForESLint for extended integration.

7. Custom Processors:
- Define a processor with methods: preprocess(text: string, filename: string): Array<string> and postprocess(messages: Array<Array<LintMessage>>, filename: string): Array<LintMessage>.

8. Share Configurations:
- Export a configuration object that includes plugins, rules, and extends arrays. For instance, adding a plugin in the plugins array and setting rule error levels in the rules object.

## Original Source
Code Quality and Formatting Documentation
https://eslint.org/docs/latest/developer-guide

## Digest of ESLINT_EXTENSIONS

# Extend ESLint Documentation
Retrieved Date: 2025-04-25

# Ways to Extend ESLint
Detailed Specification:
1. Ways to Extend ESLint
   - Overview: ESLint can be extended through plugins, custom rules, formatters, parsers, processors, and sharable configurations. 

2. Create Plugins
   - Technical Detail: Develop a plugin by exporting an object with a 'rules' property. Each rule is defined with a complete structure:
     meta: {
       docs: { description: <string>, category: <string>, recommended: <boolean> },
       fixable: <string>,
       schema: <array>
     };
     create: function(context) -> returns an object mapping AST node types to handler functions.
   - Example Structure:
     module.exports = {
       rules: {
         ruleName: {
           meta: {
             type: "suggestion",
             docs: {
               description: "disallow unused variables",
               category: "Best Practices",
               recommended: true
             },
             fixable: "code",
             schema: []
           },
           create: function(context) {
             return {
               Identifier: function(node) { /* implementation */ }
             };
           }
         }
       }
     };

3. Custom Rule Tutorial
   - Technical Detail: Follow step-by-step instructions to create a custom rule. Use the RuleTester from ESLint for validating rules. RuleTester accepts tests with a structure:
     new RuleTester({ parserOptions: { ecmaVersion: 6 } }).run(ruleName, rule, {
       valid: [{ code: "var a = 1;" }],
       invalid: [{ code: "var a = 1; a;", errors: [{ message: "Unexpected identifier" }] }]
     });

4. Custom Rules
   - Technical Detail: Rules are defined with exported objects. The create function takes a context argument and returns visitor functions keyed by AST node names.
   - Full Signature: create(context: RuleContext) -> { [nodeType: string]: function(node: ASTNode): void }

5. Custom Formatters
   - Technical Detail: Formatters are implemented as functions that take an array of linting results and return a formatted string. The formatter function signature is: function(results: Array<LintResult>): string.

6. Custom Parsers
   - Technical Detail: Custom parsers replace the default parser. They must expose a parse function: parse(code: string, options?: Object) -> AST and optionally a parseForESLint function returning an object { ast, services, visitorKeys }.

7. Custom Processors
   - Technical Detail: Processors modify how files are linted. They must expose methods preprocess(text: string, filename: string): Array<string> and postprocess(messages: Array<Array<LintMessage>>, filename: string): Array<LintMessage>.

8. Share Configurations
   - Technical Detail: Create a sharable configuration by exporting a configuration object from a package. The configuration includes rules, plugins, and extends fields. Example:
     module.exports = {
       plugins: ["pluginName"],
       rules: { "pluginName/ruleName": "error" },
       extends: ["eslint:recommended"]
     };

Attribution:
- Data Size: 2112273 bytes
- Links Found: 5109 
- Source URL: https://eslint.org/docs/latest/developer-guide

## Attribution
- Source: Code Quality and Formatting Documentation
- URL: https://eslint.org/docs/latest/developer-guide
- License: License: ESLint (MIT), Prettier (varies)
- Crawl Date: 2025-04-25T11:31:52.585Z
- Data Size: 2112273 bytes
- Links Found: 5109

## Retrieved
2025-04-25
