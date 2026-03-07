Fizz Buzz

Problem: Print numbers from 1 to N but for multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".

JavaScript example:

```js
for (let i = 1; i <= 100; i++) {
  if (i % 15 === 0) console.log('FizzBuzz')
  else if (i % 3 === 0) console.log('Fizz')
  else if (i % 5 === 0) console.log('Buzz')
  else console.log(i)
}
```