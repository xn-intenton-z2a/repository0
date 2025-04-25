# ESLINT_EXTENSIONS

## Crawl Summary
Ways to extend ESLint include: Create Plugins with custom rules, custom formatters for output, custom parsers for AST generation, custom processors for file pre/post processing, and sharing configurations via npm packages. Technical specifications include context.report API in custom rules, parser interface (parse and parseForESLint), processor methods (preprocess and postprocess), and ESLint configuration file schema (env, parserOptions, plugins, rules). CLI commands such as 'eslint .' and 'eslint --fix .' are used to run and auto-fix issues.

## Normalised Extract
Table of Contents:
1. Ways to Extend ESLint
   - Use plugins, custom rules, formatters, parsers, processors, and shared configurations.
2. Create Plugins
   - Export an object with a 'rules' property.
   - Example: module.exports with rules: { 'rule-name': { meta: { type, docs, fixable, schema }, create(context) { return { Identifier(node) { if (node.name==='eval') { context.report({ node, message:'Avoid eval', fix(fixer){ return fixer.replaceText(node,'safeEval'); }}); } } }; } } } }
3. Custom Rule Tutorial
   - Define meta and create function.
   - Rule API: context.report({ node, message, data, fix }).
   - Testing with RuleTester from ESLint; instantiate RuleTester with parserOptions and invoke run method with valid and invalid cases.
4. Custom Rules
   - Function(context) returns listener map with exposed methods for AST nodes.
5. Custom Formatters
   - Function that takes results array and returns formatted string.
   - Iterates over result.filePath and result.messages to build output.
6. Custom Parsers
   - Must implement parse(text, options) and parseForESLint(text, options) to return AST and services.
7. Custom Processors
   - Must export preprocess(text, filename) -> array of text chunks and postprocess(messages, filename) -> merged messages.
8. Share Configurations
   - Export configuration object including env, parserOptions, rules.
9. Finding Issues and Fixing Problems
   - Use CLI commands: 'eslint .' to lint and 'eslint --fix .' to auto-fix.
10. Configuring ESLint
   - Use .eslintrc.json or eslint.config.js with properties: parserOptions, env, plugins, rules.


## Supplementary Details
Plugin Configuration:
- rules: Object mapping rule names to rule definitions.
- Rule definition includes:
   meta: { type: string, docs: { description: string, recommended: boolean }, fixable: 'code' | 'whitespace' | null, schema: Array }
   create(context): function returning listener object.
Custom Rule Testing:
- Use ESLint.RuleTester with constructor parameter { parserOptions: { ecmaVersion: number } }.
- Method: ruleTester.run(ruleName: string, rule: Object, tests: { valid: string[], invalid: Array<{ code: string, errors: Array<{ message: string }>, output: string }> }).
Custom Parser Requirements:
- parse(text: string, options?: object): AST
- parseForESLint(text: string, options?: object): { ast: AST, services: object }.
Custom Processor Requirements:
- preprocess(text: string, filename: string): string[]
- postprocess(messages: object[][], filename: string): object[].n
ESLint Configuration Options:
- parserOptions: { ecmaVersion: number, sourceType: 'module' | 'script' }
- env: { browser: boolean, node: boolean }
- plugins: array of plugin names
- rules: Object mapping rule names to level ('off', 'warn', 'error')
CLI Commands:
- lint: eslint . 
- auto-fix: eslint --fix .


## Reference Details
API Specifications and Code Examples:
1. Rule Definition API:
   Function signature: function(context: Object): Object
   Use context.report method: context.report({ node: ASTNode, message: string, data?: Object, fix?: function(fixer: Fixer): Fix })
   Example:
   module.exports = {
     rules: {
       'no-eval': {
         meta: {
           type: 'problem',
           docs: { description: 'Avoid eval usage', recommended: true },
           fixable: 'code',
           schema: []
         },
         create(context) {
           return {
             Identifier(node) {
               if(node.name === 'eval') {
                 context.report({
                   node,
                   message: 'Avoid eval for security reasons',
                   fix(fixer) { return fixer.replaceText(node, 'safeEval'); }
                 });
               }
             }
           };
         }
       }
     }
   };
2. RuleTester API:
   Import: const { RuleTester } = require('eslint');
   Constructor: new RuleTester({ parserOptions: { ecmaVersion: 2020 } })
   Method: ruleTester.run(ruleName: string, rule: Object, tests: { valid: string[], invalid: Array<{ code: string, errors: Array<{ message: string }>, output: string }> })
3. Custom Formatter API:
   Module exports a function: function(results: Array<Object>): string
   Iterates over results and messages. Example provided in detailed digest.
4. Custom Parser API:
   Must export an object with:
   parse(text: string, options?: Object): AST
   parseForESLint(text: string, options?: Object): { ast: AST, services: Object }
5. Custom Processor API:
   Module exports an object with:
   preprocess(text: string, filename: string): Array<string>
   postprocess(messages: Array<Array<Object>>, filename: string): Array<Object>
6. ESLint Configuration File (eslint.config.js or .eslintrc.json):
   Example structure:
   {
     parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
     env: { browser: true, node: true },
     plugins: ['my-plugin'],
     rules: { 'my-plugin/no-eval': 'error', 'no-console': 'warn' }
   }
7. CLI Usage:
   Command: eslint .   -> runs linting
   Command: eslint --fix .   -> runs lint with automatic fixing
8. Troubleshooting Procedures:
   - Run: eslint . --debug to see detailed logs
   - Verify configuration file paths and plugin installations
   - Check RuleTester outputs to validate custom rule behavior. Expected: errors reported with exact messages and fixed output when applicable.


## Information Dense Extract
ESLint Extensions: Plugin export with rules mapping. Rule meta includes type, docs, fixable, schema. Rule create(context) returns AST listener. Use context.report({node, message, fix}). RuleTester: new RuleTester({parserOptions:{ecmaVersion:2020}}) and run(ruleName, rule, {valid:[], invalid:[{code, errors, output}]}). Formatter: function(results) iterates result.filePath and result.messages. Parser: export {parse(text,options):AST, parseForESLint(text,options):{ast,services}}. Processor: export {preprocess(text,filename):string[], postprocess(messages,filename):object[]}. Config: {parserOptions:{ecmaVersion:2020,sourceType:'module'}, env:{browser:true,node:true}, plugins:['my-plugin'], rules:{'my-plugin/no-eval':'error'}}. CLI: 'eslint .' and 'eslint --fix .'. Debug: use --debug flag.

## Sanitised Extract
Table of Contents:
1. Ways to Extend ESLint
   - Use plugins, custom rules, formatters, parsers, processors, and shared configurations.
2. Create Plugins
   - Export an object with a 'rules' property.
   - Example: module.exports with rules: { 'rule-name': { meta: { type, docs, fixable, schema }, create(context) { return { Identifier(node) { if (node.name==='eval') { context.report({ node, message:'Avoid eval', fix(fixer){ return fixer.replaceText(node,'safeEval'); }}); } } }; } } } }
3. Custom Rule Tutorial
   - Define meta and create function.
   - Rule API: context.report({ node, message, data, fix }).
   - Testing with RuleTester from ESLint; instantiate RuleTester with parserOptions and invoke run method with valid and invalid cases.
4. Custom Rules
   - Function(context) returns listener map with exposed methods for AST nodes.
5. Custom Formatters
   - Function that takes results array and returns formatted string.
   - Iterates over result.filePath and result.messages to build output.
6. Custom Parsers
   - Must implement parse(text, options) and parseForESLint(text, options) to return AST and services.
7. Custom Processors
   - Must export preprocess(text, filename) -> array of text chunks and postprocess(messages, filename) -> merged messages.
8. Share Configurations
   - Export configuration object including env, parserOptions, rules.
9. Finding Issues and Fixing Problems
   - Use CLI commands: 'eslint .' to lint and 'eslint --fix .' to auto-fix.
10. Configuring ESLint
   - Use .eslintrc.json or eslint.config.js with properties: parserOptions, env, plugins, rules.

## Original Source
Quality & Documentation Tools Documentation
https://eslint.org/docs/latest/developer-guide

## Digest of ESLINT_EXTENSIONS

# Ways to Extend ESLint

Retrieved: 2025-04-21
Data Size: 2120390 bytes
Links Found: 5120

## Table of Contents
1. Ways to Extend ESLint
2. Create Plugins
3. Custom Rule Tutorial
4. Custom Rules
5. Custom Formatters
6. Custom Parsers
7. Custom Processors
8. Share Configurations
9. Finding Issues and Fixing Problems
10. Configuring ESLint

## 1. Ways to Extend ESLint
The ESLint developer guide details several extension points:
- Plugin Creation
- Custom Rules, Formatters, Parsers, and Processors
- Sharing configurations via packages

## 2. Create Plugins
Plugins are Node.js modules exporting an object with key properties. A basic plugin structure is:

module.exports = {
  rules: {
    'my-rule': {
      meta: {
        type: 'problem',
        docs: {
          description: 'disallow use of eval()',
          recommended: true
        },
        fixable: 'code',
        schema: []
      },
      create(context) {
        return {
          Identifier(node) {
            if (node.name === 'eval') {
              context.report({
                node,
                message: 'Avoid eval for security reasons',
                fix(fixer) {
                  return fixer.replaceText(node, 'safeEval');
                }
              });
            }
          }
        };
      }
    }
  }
};

## 3. Custom Rule Tutorial
Steps to create a custom rule include:
- Define the rule meta object with type, docs, fixable, and schema.
- Implement the create function with a listener for AST nodes.
- Use context.report to output errors, including node, message, optional data, and a fix function if applicable.

Example usage in tests:

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/my-rule');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });
ruleTester.run('my-rule', rule, {
  valid: ['var a = 1;'],
  invalid: [
    {
      code: 'eval(x);',
      errors: [{ message: 'Avoid eval for security reasons' }],
      output: 'safeEval(x);'
    }
  ]
});

## 4. Custom Rules
A custom rule is defined as a function taking context and returning a listener map. API signature:

function rule(context: Object): Object

The context.report method accepts an object with:
- node: AST node
- message: string
- data: object (optional)
- fix: function (optional) that returns a Fix object

## 5. Custom Formatters
Custom formatters allow customization of ESLint output. A formatter is a function that takes an array of linting results and returns a formatted string. Example structure:

module.exports = function(results) {
  let output = '';
  results.forEach(result => {
    output += `File: ${result.filePath}\n`;
    result.messages.forEach(msg => {
      output += `  Line ${msg.line}: ${msg.message} (${msg.ruleId})\n`;
    });
  });
  return output;
};

## 6. Custom Parsers
Custom parsers must implement at least the following methods:
- parse(text: string, options?: Object): AST
- parseForESLint(text: string, options?: Object): { ast: AST, services: Object }

A parser module example:

module.exports = {
  parse(text, options) {
    // implement parsing logic
    return {}; // returns AST
  },
  parseForESLint(text, options) {
    return { ast: this.parse(text, options), services: {} };
  }
};

## 7. Custom Processors
Processors allow ESLint to handle non-JavaScript files. A processor module must export two functions:
- preprocess(text: string, filename: string): Array<string>
- postprocess(messages: Array<Array<Object>>, filename: string): Array<Object>

Example processor:

module.exports = {
  preprocess(text, filename) {
    // Split file contents if needed
    return [text];
  },
  postprocess(messages, filename) {
    // Merge messages from different parts
    return [].concat(...messages);
  }
};

## 8. Share Configurations
ESLint configurations can be shared by exporting a configuration object in a package. Example in package.json:

{
  "name": "eslint-config-myconfig",
  "main": "index.js"
}

And in index.js:

module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'warn'
  }
};

## 9. Finding Issues and Fixing Problems
ESLint is designed to find issues using static analysis. It is integrated in editors and CI pipelines. Core CLI commands include:

eslint .
eslint --fix .

The tool automatically fixes problems if a rule is marked as fixable. Look for output patterns indicating fixed files and remaining issues.

## 10. Configuring ESLint
Configuration can be done via configuration files like .eslintrc.json or eslint.config.js. A sample configuration:

module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  plugins: ['my-plugin'],
  rules: {
    'my-plugin/my-rule': 'error',
    'no-console': 'warn'
  }
};

Attribution: Content retrieved from ESLint Developer Guide at https://eslint.org/docs/latest/developer-guide on 21 Apr, 2025.

## Attribution
- Source: Quality & Documentation Tools Documentation
- URL: https://eslint.org/docs/latest/developer-guide
- License: License: ESLint (MIT), Prettier (varies), markdown-it (MIT), EJS (MIT)
- Crawl Date: 2025-04-25T19:42:42.151Z
- Data Size: 2120390 bytes
- Links Found: 5120

## Retrieved
2025-04-25
