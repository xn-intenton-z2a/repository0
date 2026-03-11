# Page snapshot

```yaml
- generic [ref=e1]:
  - heading "repo" [level=1] [ref=e2]
  - generic [ref=e4]:
    - term [ref=e5]: Version
    - definition [ref=e6]: 0.1.0
    - term [ref=e7]: Description
    - definition [ref=e8]: A JavaScript library for Hamming distance calculations
  - heading "String Hamming Distance" [level=2] [ref=e9]
  - generic [ref=e10]:
    - paragraph [ref=e11]: Calculate the Hamming distance between two strings of equal length (number of positions where characters differ).
    - generic [ref=e12]:
      - textbox "First string" [ref=e13]: abc
      - textbox "Second string" [active] [ref=e14]: abcd
      - button "Calculate" [ref=e15] [cursor=pointer]
    - generic [ref=e16]: Click "Calculate" to see results
    - generic [ref=e17]: "Example: hammingDistance(\"karolin\", \"kathrin\") → 3"
  - heading "Bit Hamming Distance" [level=2] [ref=e18]
  - generic [ref=e19]:
    - paragraph [ref=e20]: Calculate the Hamming distance between two non-negative integers (count of differing bits).
    - generic [ref=e21]:
      - spinbutton [ref=e22]: "1"
      - spinbutton [ref=e23]: "4"
      - button "Calculate" [ref=e24] [cursor=pointer]
    - generic [ref=e25]: Click "Calculate" to see results
    - generic [ref=e26]: "Example: hammingDistanceBits(1, 4) → 2 (binary: 001 vs 100)"
  - heading "About" [level=2] [ref=e27]
  - paragraph [ref=e28]:
    - text: This website demonstrates the Hamming distance library functions. See
    - link "the repository" [ref=e29] [cursor=pointer]:
      - /url: https://github.com/xn-intenton-z2a/repository0
    - text: for source code and mission details.
```