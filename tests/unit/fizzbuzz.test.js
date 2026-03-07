const assert = require('assert');
const fizzbuzz = require('../../src/web/lib-browser');

describe('fizzbuzz', function() {
  it('returns the correct values', function() {
    const cases = [
      [1, '1'],
      [3, 'Fizz'],
      [5, 'Buzz'],
      [15, 'FizzBuzz'],
      [2, '2'],
      [6, 'Fizz'],
      [10, 'Buzz']
    ];
    cases.forEach(([input, expected]) => {
      assert.strictEqual(fizzbuzz(input), expected);
    });
  });
});
