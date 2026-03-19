# CSV Format and File Processing

## Table of Contents

1. CSV Format Specification
2. JavaScript File Reading APIs
3. CSV Parsing Implementation
4. Time Series Data Structure
5. Error Handling for File Operations

## CSV Format Specification

### Basic CSV Structure

Comma-Separated Values format with header row:
```
time,value
0,0.5
1,1.2
2,0.8
3,2.1
```

### Format Rules

- Fields separated by commas
- Header row contains column names
- No spaces around commas (strict format)
- Decimal numbers use period as decimal separator
- No quotes needed for numeric values
- Line endings: LF (\n) or CRLF (\r\n)

### Time Series CSV Requirements

Expected columns for plotting library:
- time: Numeric timestamp or sequential value
- value: Numeric measurement or data point

Example time series data:
```
time,value
0.0,1.0
0.1,0.95
0.2,0.81
0.3,0.59
0.4,0.31
0.5,0.0
```

### Data Type Validation

Time column: Numeric values in ascending order
Value column: Numeric values, NaN handling required

Valid numeric formats:
- Integer: 42
- Decimal: 3.14159  
- Scientific: 1.23e-4
- Negative: -42.5

## JavaScript File Reading APIs

### Node.js File System

Synchronous file reading:
const fs = require('fs');
const content = fs.readFileSync('data.csv', 'utf8');

Asynchronous file reading:
const fs = require('fs').promises;
const content = await fs.readFile('data.csv', 'utf8');

### Browser File API

Reading user-selected files:
const file = event.target.files[0];
const content = await file.text();

### Error Handling

File operation error handling:
try {
  const content = fs.readFileSync(filename, 'utf8');
  return content;
} catch (error) {
  if (error.code === 'ENOENT') {
    throw new Error(`File not found: ${filename}`);
  } else if (error.code === 'EACCES') {
    throw new Error(`Permission denied: ${filename}`);
  } else {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

## CSV Parsing Implementation

### Basic Line-by-Line Parser

function parseCSV(csvContent) {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('CSV must have header row and at least one data row');
  }
  
  const header = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length !== header.length) {
      throw new Error(`Row ${i}: Expected ${header.length} columns, got ${values.length}`);
    }
    
    const row = {};
    header.forEach((col, index) => {
      row[col] = values[index];
    });
    data.push(row);
  }
  
  return { header, data };
}

### Time Series Specific Parser

function parseTimeSeriesCSV(csvContent) {
  const { header, data } = parseCSV(csvContent);
  
  // Validate expected columns
  if (!header.includes('time')) {
    throw new Error('CSV must have "time" column');
  }
  if (!header.includes('value')) {
    throw new Error('CSV must have "value" column');
  }
  
  // Convert to numeric and validate
  const timeSeries = data.map((row, index) => {
    const time = parseFloat(row.time);
    const value = parseFloat(row.value);
    
    if (isNaN(time)) {
      throw new Error(`Row ${index + 2}: Invalid time value "${row.time}"`);
    }
    if (isNaN(value)) {
      console.warn(`Row ${index + 2}: Invalid value "${row.value}", treating as NaN`);
    }
    
    return { x: time, y: value };
  });
  
  return timeSeries;
}

### Advanced Parsing Features

Handle quoted fields and escaped commas:
function parseCSVRow(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

## Time Series Data Structure

### Standard Data Point Format

Consistent structure for plotting:
interface DataPoint {
  x: number; // Time or independent variable
  y: number; // Value or dependent variable
}

### Data Series Structure

Array of data points with metadata:
interface DataSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

### Domain and Range Calculation

Calculate bounds for plotting:
function calculateBounds(dataSeries) {
  if (dataSeries.length === 0) {
    return { xMin: 0, xMax: 1, yMin: 0, yMax: 1 };
  }
  
  const xValues = dataSeries.map(p => p.x);
  const yValues = dataSeries.map(p => p.y).filter(y => isFinite(y));
  
  return {
    xMin: Math.min(...xValues),
    xMax: Math.max(...xValues),
    yMin: Math.min(...yValues),
    yMax: Math.max(...yValues)
  };
}

### Data Validation

Validate time series requirements:
function validateTimeSeries(data) {
  if (data.length === 0) {
    throw new Error('No data points found');
  }
  
  // Check for ascending time values
  for (let i = 1; i < data.length; i++) {
    if (data[i].x <= data[i-1].x) {
      console.warn(`Time values not strictly ascending at index ${i}`);
    }
  }
  
  // Count valid data points
  const validPoints = data.filter(p => isFinite(p.y));
  if (validPoints.length === 0) {
    throw new Error('No valid numeric values found');
  }
  
  return {
    totalPoints: data.length,
    validPoints: validPoints.length,
    invalidPoints: data.length - validPoints.length
  };
}

## Error Handling for File Operations

### File System Error Codes

Common Node.js file system error codes:
- ENOENT: File or directory does not exist
- EACCES: Permission denied
- EISDIR: Expected file but found directory
- EMFILE: Too many open files
- ENOTDIR: Component of path is not a directory

### CSV Parsing Error Types

Structured error handling:
class CSVError extends Error {
  constructor(message, row = null, column = null) {
    super(message);
    this.name = 'CSVError';
    this.row = row;
    this.column = column;
  }
}

### Comprehensive Error Handling

function loadTimeSeriesFromCSV(filename) {
  try {
    // Read file
    const content = fs.readFileSync(filename, 'utf8');
    
    // Parse CSV
    const timeSeries = parseTimeSeriesCSV(content);
    
    // Validate data
    const stats = validateTimeSeries(timeSeries);
    
    console.log(`Loaded ${stats.validPoints} data points from ${filename}`);
    if (stats.invalidPoints > 0) {
      console.warn(`Skipped ${stats.invalidPoints} invalid data points`);
    }
    
    return timeSeries;
    
  } catch (error) {
    if (error instanceof CSVError) {
      console.error(`CSV Error: ${error.message}`);
      if (error.row) {
        console.error(`  at row ${error.row}`);
      }
    } else if (error.code) {
      console.error(`File Error: ${error.message}`);
    } else {
      console.error(`Parsing Error: ${error.message}`);
    }
    
    process.exit(1);
  }
}

## Reference Details

### File System Method Signatures

fs.readFileSync(path: string, options: string): string
fs.readFile(path: string, options: string): Promise<string>
fs.existsSync(path: string): boolean
fs.statSync(path: string): Stats

### File API Methods (Browser)

File.text(): Promise<string>
File.arrayBuffer(): Promise<ArrayBuffer>
File.stream(): ReadableStream

### CSV Parsing Libraries (Alternative)

Popular npm packages for CSV parsing:
- csv-parser: Streaming CSV parser
- papaparse: Full-featured CSV library
- fast-csv: High-performance CSV parser
- csv-parse: Node.js CSV parsing library

## Detailed Digest

Technical specifications for CSV format and JavaScript file processing APIs focusing on time series data loading for plotting applications. CSV format follows RFC 4180 standard with comma-separated fields and header row. JavaScript provides multiple APIs for file reading in both Node.js and browser environments. Proper error handling essential for robust file operations. Content compiled from multiple sources on 2026-03-19.

Attribution: RFC 4180, MDN Web Docs, Node.js Foundation
Data size: Combined reference materials