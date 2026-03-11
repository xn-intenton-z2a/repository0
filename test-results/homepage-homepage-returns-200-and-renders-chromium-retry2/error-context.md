# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "repo" [level=1] [ref=e2]
  - generic [ref=e4]:
    - term [ref=e5]: Version
    - definition [ref=e6]: 0.1.0
    - term [ref=e7]: Description
    - definition [ref=e8]: JavaScript library for Hamming distance functions
  - generic [ref=e9]: "hammingDistance(\"karolin\", \"kathrin\") = 3 hammingDistanceBits(1, 4) = 2 Binary: 001 vs 100"
  - heading "String Hamming Distance" [level=2] [ref=e10]
  - generic [ref=e11]:
    - paragraph [ref=e12]: Compute the Hamming distance between two strings of equal length (number of positions where characters differ).
    - generic [ref=e13]: "Example: hammingDistance(\"karolin\", \"kathrin\") → 3"
    - generic [ref=e14]:
      - textbox "First string" [ref=e15]: karolin
      - textbox "Second string" [ref=e16]: kathrin
      - button "Calculate" [ref=e17] [cursor=pointer]
    - generic [ref=e18]: hammingDistance("karolin", "kathrin") = 3
  - heading "Bit Hamming Distance" [level=2] [ref=e19]
  - generic [ref=e20]:
    - paragraph [ref=e21]: Compute the Hamming distance between two non-negative integers (count the number of differing bits).
    - generic [ref=e22]: "Example: hammingDistanceBits(1, 4) → 2 (binary: 001 vs 100)"
    - generic [ref=e23]:
      - spinbutton [ref=e24]: "1"
      - spinbutton [ref=e25]: "4"
      - button "Calculate" [ref=e26] [cursor=pointer]
    - generic [ref=e27]: "hammingDistanceBits(1, 4) = 2 Binary: 001 vs 100"
  - heading "Demo Output" [level=2] [ref=e28]
  - generic [ref=e29]: Result will appear here...
  - heading "About" [level=2] [ref=e30]
  - paragraph [ref=e31]:
    - text: This website demonstrates the Hamming distance library. See
    - link "the repository" [ref=e32] [cursor=pointer]:
      - /url: https://github.com/xn-intenton-z2a/repository0
    - text: for source code and mission details.
```