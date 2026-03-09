// src/web/app.js
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
  const val = Number(singleInput.value);
  try{
    if (!Number.isFinite(val) || !Number.isInteger(val)) throw new TypeError('n must be an integer');
    if (val < 0) throw new RangeError('n must be a non-negative integer');
    const out = fizzBuzzSingle(val);
    singleOut.textContent = out;
  }catch(e){
    showError(e.message);
    singleOut.textContent = '';
  }
});

rangeBtn.addEventListener('click', ()=>{
  showError('');
  const val = Number(rangeInput.value);
  try{
    if (!Number.isFinite(val) || !Number.isInteger(val)) throw new TypeError('n must be an integer');
    if (val < 0) throw new RangeError('n must be a non-negative integer');
    const arr = fizzBuzz(val);
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
