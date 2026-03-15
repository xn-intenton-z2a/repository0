PLURALIZE

Normalised extract

Table of contents:
1. Purpose and behaviour
2. Primary API signatures
3. Rule-extension API (add/remove rules)
4. Examples and edge cases

Detailed information

Purpose and behaviour
- Pluralize provides singularize/pluralize transformations for English words using a ruleset applied in order. It covers irregular forms and uncountables and is useful for UI text and simple NLP tasks.

Primary API signatures
- pluralize(word: string) -> string  // returns plural form
- pluralize(word: string, count: number, inclusive?: boolean) -> string  // if inclusive true, prefix with count
- pluralize.isPlural(word: string) -> boolean
- pluralize.isSingular(word: string) -> boolean
- pluralize.plural(word: string) -> string
- pluralize.singular(word: string) -> string

Rule-extension API
- pluralize.addPluralRule(pattern: RegExp, replacement: string)
- pluralize.addSingularRule(pattern: RegExp, replacement: string)
- pluralize.addIrregularRule(single: string, plural: string)
- pluralize.addUncountableRule(word: string)
- These APIs allow adding or overriding rules for domain-specific vocabularies.

Examples
- pluralize('test') -> 'tests'
- pluralize('test', 1) -> 'test'
- pluralize('test', 5, true) -> '5 tests'
- Use addUncountableRule('sheep') to keep 'sheep' unchanged when pluralizing.

Reference details
- Function: pluralize(word: string, count?: number, inclusive?: boolean) -> string
- Methods available to extend behaviour: addPluralRule, addSingularRule, addUncountableRule, isPlural, isSingular

Detailed digest
- Source: pluralize README (npm registry)
- Registry fetched: https://registry.npmjs.org/pluralize
- README length: 3089 characters
- Registry JSON size fetched: 55503 bytes
- Retrieved: 2026-03-15

Attribution
- pluralize README (pluralize library) via npm registry
