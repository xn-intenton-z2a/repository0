// Minimal FizzBuzz implementation for the browser demo (kept consistent with library)
function fizzBuzzSingle(i) {
  if (typeof i !== 'number' || !Number.isInteger(i) || i < 1) {
    throw new TypeError('n must be a non-negative integer');
  }
  const by3 = (i % 3 === 0);
  const by5 = (i % 5 === 0);
  if (by3 && by5) return 'FizzBuzz';
  if (by3) return 'Fizz';
  if (by5) return 'Buzz';
  return String(i);
}
function fizzBuzz(n) {
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
    throw new TypeError('n must be a non-negative integer');
  }
  if (n === 0) return [];
  const out = [];
  for (let i = 1; i <= n; i++) out.push(fizzBuzzSingle(i));
  return out;
}

const outEl = document.getElementById('fizzbuzz-output');
const input = document.getElementById('fizzbuzz-n');
const btn = document.getElementById('fizzbuzz-gen');

function render(n){
  try{
    const arr = fizzBuzz(n);
    outEl.textContent = arr.join('\n');
  }catch(e){
    outEl.textContent = 'Error: ' + (e && e.message ? e.message : String(e));
  }
}

btn.addEventListener('click', ()=>{
  const n = Number(input.value);
  render(n);
});

// render default
render(Number(input.value || 0));
