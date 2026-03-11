# Interactive Web Demonstration

## Overview

Complete the interactive web interface that demonstrates both Hamming distance functions with real-time calculation, visual feedback, and educational content, making the library's capabilities accessible and easy to understand.

## String Distance Interface

The web form at src/web/index.html allows users to input two strings and see the Hamming distance calculated in real-time. Visual indicators highlight character differences and show validation errors for mismatched lengths.

## Bits Distance Interface

A separate interface accepts two integers and displays both the numeric result and a visual representation of the binary differences. Binary representations are shown with differing bits highlighted for educational value.

## Input Validation Feedback

The web interface provides immediate feedback for invalid inputs, displaying the same error messages that the library functions throw. This helps users understand proper usage patterns and error conditions.

## Visual Enhancements

Character-by-character comparison visualization shows which positions differ in string comparisons. Bit-by-bit comparison displays binary representations with clear highlighting of differing positions.

## Educational Content

The interface includes examples and explanations of Hamming distance concepts, helping users understand when and how to use each function. Interactive examples demonstrate common use cases and edge cases.

## Responsive Design

The web interface works well on both desktop and mobile devices, ensuring accessibility across different platforms and screen sizes while maintaining usability and visual appeal.

## Library Integration

The calculateStringDistance and calculateBitDistance functions use the actual library functions from src/lib/main.js via the build system, ensuring the web demo reflects real library behavior.

## Testing Integration

Behaviour tests verify that the web interface correctly calls the library functions and displays results accurately. Tests validate error handling in the web context matches library behavior.

## User Experience

Clean, intuitive design makes it easy for users to experiment with different inputs and understand the results. Clear labeling and helpful hints guide users toward successful interactions.

## Acceptance Criteria

- [ ] Web interface provides input forms for both string and integer Hamming distance functions
- [ ] Real-time calculation displays results as user types or clicks calculate
- [ ] Visual highlighting shows character differences in string comparisons
- [ ] Binary representation visualization shows bit differences for integers
- [ ] Error messages match library function error behavior exactly
- [ ] Interface works on both desktop and mobile devices
- [ ] Behaviour tests verify web interface calls library functions correctly
- [ ] Examples and educational content explain Hamming distance concepts
- [ ] calculateStringDistance and calculateBitDistance use actual library functions
- [ ] Build system properly generates lib-meta.js for web consumption