# Batch Processing

Efficient batch processing capabilities for computing Hamming distances on arrays of input pairs.

## Requirements

Add batch processing functions for efficient computation on multiple input pairs:

- Batch string comparison function for arrays of string pairs
- Batch integer comparison function for arrays of number pairs  
- Streaming processing for large datasets
- Progress reporting and cancellation support
- Result aggregation and statistical analysis

## Acceptance Criteria

- hammingDistanceBatch(pairs) function for array of string pairs
- hammingDistanceBitsBatch(pairs) function for array of integer pairs
- Support for mixed batch operations with validation
- Progress callback support for long-running operations
- Statistical functions (min, max, average, median) for batch results
- Streaming interface for processing large files
- CLI support for batch processing from files

## Batch Features

- Efficient array processing with minimal memory overhead
- Progress tracking and estimated completion times
- Error handling that continues processing remaining items
- Result formatting options (arrays, objects, CSV)
- Parallel processing capabilities where beneficial
- Memory-efficient streaming for large datasets

## Implementation Notes

- Implement batch functions as separate exports from main.js
- Use streaming APIs for file processing in CLI mode
- Provide progress callbacks for web interface integration
- Handle partial failures gracefully in batch operations
- Add batch processing examples to website demo
- Ensure batch operations maintain individual item error handling