Number.isInteger

Number.isInteger(value) returns true if value is a number and an integer (no fractional part). It does not coerce values.

Examples:

```js
Number.isInteger(3)       // true
Number.isInteger(3.0)     // true
Number.isInteger(3.1)     // false
Number.isInteger('3')     // false
Number.isInteger(NaN)     // false
Number.isInteger(Infinity)// false
```

Use it when you need to ensure a value is a numeric integer and avoid implicit coercion.