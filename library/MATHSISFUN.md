MATHSISFUN

Table of contents
- Basic symbols and examples
- Step-by-step conversion method (ones, tens, hundreds, thousands)
- Example conversions and edge cases
- Implementation notes
- Digest and attribution

Basic symbols and examples
- Symbols: I V X L C D M with values 1,5,10,50,100,500,1000.
- Examples: 4 -> IV; 9 -> IX; 40 -> XL; 90 -> XC; 400 -> CD; 900 -> CM.

Step-by-step conversion method (practical)
1. Decompose integer into thousands, hundreds, tens, ones.
2. Convert each digit using canonical table and concatenate in order M..C..X..I.
3. Use lookup for each digit position:
   - Thousands digit 0..3: "","M","MM","MMM"
   - Hundreds: 0..9 -> ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM"]
   - Tens: similar using X,L,C
   - Ones: using I,V,X
4. Concatenate thousands+hundreds+tens+ones to produce canonical numeral.

Example conversions
- 1984 => 1000(M) + 900(CM) + 80(LXXX) + 4(IV) => MCMLXXXIV
- 4 => IV
- 3999 => 3000(MMM) + 900(CM) + 90(XC) + 9(IX) => MMMCMXCIX

Implementation notes
- This source provides the same lookup-based algorithm as integerToRoman described elsewhere; preferred for clarity and test case generation.
- Use this source for canonical examples and to generate unit test table rows.

Digest and attribution
- Source: Math Is Fun, Roman Numerals (conversion tutorial and tables)
- Retrieval date: 2026-03-19
- Retrieved size: ~44.8 KB (HTML)
- URL: https://www.mathsisfun.com/roman-numerals.html
