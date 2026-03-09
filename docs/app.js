import { fizzBuzz, fizzBuzzSingle } from '../lib/main.js';

const singleInput = document.getElementById('fizz-input');
const singleBtn = document.getElementById('fizz-submit');
const singleOut = document.getElementById('fizz-output');

const rangeInput = document.getElementById('fizz-range');
const rangeBtn = document.getElementById('fizz-range-submit');
const rangeOut = document.getElementById('fizz-range-output');

const errEl = document.getElementById('fizz-error');

function showError(msg){
  errEl.textContent = msg || '';
}

singleBtn.addEventListener('click', ()=>{
  showError('');
  const raw = singleInput.value;
  const val = Number(raw);
  try{
    // rely on library validators by converting to number and passing through
    if (raw === '' || Number.isNaN(val)) throw new TypeError('n must be an integer');
    const out = fizzBuzzSingle(Number.parseInt(raw, 10));
    singleOut.textContent = out;
  }catch(e){
    showError(e.message);
    singleOut.textContent = '';
  }
});

rangeBtn.addEventListener('click', ()=>{
  showError('');
  const raw = rangeInput.value;
  const val = Number(raw);
  try{
    if (raw === '' || Number.isNaN(val)) throw new TypeError('n must be an integer');
    const arr = fizzBuzz(Number.parseInt(raw, 10));
    rangeOut.textContent = arr.join(',');
  }catch(e){
    showError(e.message);
    rangeOut.textContent = '';
  }
});

// initial state
singleOut.textContent = '';
rangeOut.textContent = '';
errEl.textContent = '';
