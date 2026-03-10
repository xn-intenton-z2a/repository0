#!/usr/bin/env node
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const docsDir = path.resolve('docs');
fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
fs.copyFileSync(path.resolve('src/web/index.html'), path.join(docsDir, 'index.html'));

const libMeta = `export const name = ${JSON.stringify(pkg.name)};\nexport const version = ${JSON.stringify(pkg.version)};\nexport const description = ${JSON.stringify(pkg.description)};\n`;
fs.writeFileSync(path.join(docsDir, 'lib-meta.js'), libMeta);

const libMain = `export const name = ${JSON.stringify(pkg.name)};export const version = ${JSON.stringify(pkg.version)};export const description = ${JSON.stringify(pkg.description)};export function toRoman(n){if(typeof n!=='number'||!Number.isInteger(n))throw new TypeError('toRoman: integer');if(n<1||n>3999)throw new RangeError('toRoman');const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];let r='';let rem=n;for(const [v,s] of map){while(rem>=v){r+=s;rem-=v}}return r}export function fromRoman(str){if(typeof str!=='string')throw new TypeError('fromRoman');const s=str.trim().toUpperCase();if(!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(s))throw new TypeError('fromRoman');const vals={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let total=0;for(let i=0;i<s.length;i++){const cur=vals[s[i]];const next=vals[s[i+1]]||0;if(cur<next){total+=next-cur;i++}else total+=cur}return total}`;

fs.writeFileSync(path.join(docsDir, 'lib-main.js'), libMain);

console.log('built docs');
