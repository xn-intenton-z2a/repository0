JavaScript Error Types

Common built-in Error types:
- Error: generic error
- TypeError: invalid type or operation on wrong type
- ReferenceError: accessing an undefined variable
- RangeError: numeric value out of allowed range
- SyntaxError: code with invalid syntax (thrown at parse time)

Creating custom errors:

```js
class MyError extends Error {
  constructor(message){
    super(message)
    this.name = 'MyError'
  }
}
```

Best practices: throw instances of Error (or subclasses), include helpful messages, and avoid throwing non-Error values.