# Roman Numerals

A small library to convert between integers (1..3999) and Roman numerals with strict and permissive parsing.

Exports (src/lib/main.js):
- toRoman(number)
- fromRoman(string, {strict?:boolean})
- parseRoman(string, {strict:boolean}) -> { valid, value, canonical }

Examples

Convert number to Roman:

const { toRoman } = require('./src/lib/main.js')
// toRoman(9) => 'IX'

Convert Roman to number (strict by default):

fromRoman('IX') // => 9
fromRoman('ix') // throws SyntaxError (strict)
fromRoman('ix', { strict: false }) // => 9

CLI Examples

node src/lib/main.js -t 9
# Outputs:
# IX

node src/lib/main.js -f IX
# Outputs:
# 9

node src/lib/main.js -f ix
# Without --permissive prints an error and exits with code 2
# With --permissive prints '9' and exits 0

Range: numbers must be integers from 1 to 3999.
