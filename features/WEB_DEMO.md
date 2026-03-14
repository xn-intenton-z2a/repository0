# Interactive Web Demo

## Overview

Create an engaging web interface that demonstrates all encoding capabilities, allowing users to experiment with different encodings and see real-time comparisons.

## Demo Interface Components

### UUID Encoding Playground
- Input field for UUID (with/without dashes)
- Generate random v7 UUID button for testing
- Real-time encoding results for all available encodings
- Character count comparison table
- Copy encoded results to clipboard

### Binary Data Encoder
- File upload for arbitrary binary data (images, documents)
- Hex input for manual binary data entry
- Text input that converts to UTF-8 bytes
- Encoding results with size comparisons
- Download encoded results as text files

### Encoding Comparison Table
- Side-by-side comparison of all encodings for same input
- Character count and density metrics
- Visual representation of space savings
- Highlight most efficient encoding for current input

### Custom Encoding Creator
- Interface to define custom character sets
- Real-time validation of character set rules
- Test custom encoding with sample data
- Save and reuse custom encodings in session storage

## Interactive Features

### Live Updates
- All encoding results update as user types
- No submit buttons required - real-time feedback
- Performance indicators for large inputs
- Visual feedback for invalid inputs

### Educational Content
- Explanation of each encoding algorithm
- Character set safety notes for different contexts
- Performance characteristics and use case guidance
- Links to relevant technical specifications

### Mobile Responsiveness
- Touch-friendly interface on mobile devices  
- Responsive layout that works on all screen sizes
- Swipe gestures for comparing encodings
- Optimized for both portrait and landscape

## Data Visualization

### Density Charts
- Bar chart comparing bits per character across encodings
- Visual representation of space savings for different inputs
- Interactive tooltips with detailed information

### Character Set Analysis
- Visual display of character sets used by each encoding
- Highlighting of potentially problematic characters
- Safety indicators for different environments (URL, JSON, shell)

## Integration with Library

### Direct Library Usage
- Web demo uses the same main.js library code
- No separate implementation - validates library functionality
- Demonstrates real-world usage patterns
- Acts as comprehensive integration test

### Error Handling Demo
- Show how library handles invalid inputs gracefully
- Demonstrate error messages for malformed data
- Educational examples of common mistakes

## Performance Demonstration

### Benchmarking Tools
- Time encoding/decoding operations for large inputs
- Memory usage visualization where possible
- Comparison with built-in browser functions like btoa/atob

## UI Requirements

### Demo Output Element
- Main demo output element with ID `demo-output` must be present
- This element displays primary demonstration results
- Required for behaviour tests and user interaction validation
- Should show real-time feedback for encoding operations

## Acceptance Criteria

- Interactive web interface built in src/web/
- Main demo output element with ID `demo-output` visible on page load
- All library functions demonstrated with real-time feedback
- UUID encoding comparison table shows character counts
- File upload works for binary data encoding
- Custom encoding creation interface functional
- Mobile-responsive design works on all devices
- Web demo uses main.js library directly without modifications
- Educational content explains encoding concepts clearly
- Behaviour tests pass with visible `demo-output` element