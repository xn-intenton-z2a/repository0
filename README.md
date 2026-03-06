# Roman Numeral Converter

Small library to convert between integers (1..3999) and Roman numeral strings.

Exports:

- `toRoman(n)` - convert integer to Roman string (1..3999)
- `fromRoman(s, options)` - parse Roman string to integer. Options:
  - `lenient` (boolean, default false) - opt-in lenient parsing accepting a small set of common nonstandard forms (lowercase input and repeated additive forms like "IIII").
  - `normalize` (boolean, default true) - trim and collapse whitespace before parsing when enabled.

Examples

Strict mode (default):

```js
import { fromRoman, toRoman } from './src/lib/main.js'
fromRoman('MCMXCIV') // 1994
// fromRoman('IIII') -> throws TypeError in strict mode
```

Lenient mode:

```js
fromRoman('IIII', { lenient: true }) // 4
fromRoman('mcmxciv', { lenient: true }) // 1994
fromRoman('  mcm xciv  ', { lenient: true, normalize: true }) // 1994
fromRoman('IiIi', { lenient: true }) // parsed case-insensitively -> 4
```

Notes

- The lenient mode performs a narrow set of safe transformations and then reuses the strict validator; obviously malformed inputs (e.g., "ABC", "VXZ") are still rejected even in lenient mode.
- Unknown options are ignored; the signature `fromRoman(s, options)` remains backward compatible.
