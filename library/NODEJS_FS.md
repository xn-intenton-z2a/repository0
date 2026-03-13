# NODEJS_FS

## Table of Contents

- File System API Overview
- Promise-Based Operations
- Callback and Synchronous APIs  
- FileHandle Object Management
- Stream-Based File Operations
- File System Permissions and Metadata
- Error Handling Patterns
- Performance Considerations

## File System API Overview

The node:fs module enables interacting with the file system using standard POSIX-like functions. All file system operations are available in synchronous, callback, and promise-based forms.

### Module Import Patterns
For promise-based APIs:
```javascript
import * as fs from 'node:fs/promises';
```

For callback and sync APIs:
```javascript  
import * as fs from 'node:fs';
```

Compatible with both CommonJS syntax and ES6 Modules (ESM).

## Promise-Based Operations

### Async/Await Pattern
Promise-based operations return promises fulfilled when asynchronous operations complete:

```javascript
import { unlink } from 'node:fs/promises';

try {
  await unlink('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (error) {
  console.error('there was an error:', error.message);
}
```

### Promise API Benefits
- Modern JavaScript async/await compatibility
- Error handling through try/catch blocks  
- Chainable operations with .then()/.catch()
- Integration with async function workflows

## Callback and Synchronous APIs

### Callback API Pattern
Callback form takes completion callback as last argument:

```javascript
import { unlink } from 'node:fs';

unlink('/tmp/hello', (err) => {
  if (err) throw err;
  console.log('successfully deleted /tmp/hello');
});
```

### Synchronous API Pattern  
Synchronous APIs block Node.js event loop until completion:

```javascript
import { unlinkSync } from 'node:fs';

try {
  unlinkSync('/tmp/hello');
  console.log('successfully deleted /tmp/hello');
} catch (err) {
  // handle the error
}
```

### Performance Considerations
Callback-based versions preferable when maximal performance (execution time and memory allocation) required.

## FileHandle Object Management

### FileHandle Class
FileHandle objects wrap numeric file descriptors and extend EventEmitter. Created by fsPromises.open() method.

### FileHandle Methods
- filehandle.appendFile(data, options): Append content to file
- filehandle.chmod(mode): Modify file permissions  
- filehandle.chown(uid, gid): Change file ownership
- filehandle.close(): Close file handle after pending operations
- filehandle.datasync(): Sync I/O operations to storage
- filehandle.read(buffer, offset, length, position): Read file content
- filehandle.sync(): Flush file data and metadata
- filehandle.writeFile(data, options): Write content to file

### Automatic Cleanup
FileHandle objects attempt automatic closure if not explicitly closed, emitting process warnings to prevent memory leaks. Explicit closure recommended for reliable behavior.

## Stream-Based File Operations

### Read Streams
- filehandle.createReadStream(options): Create readable stream
- Options: encoding, start, end, highWaterMark, signal
- Supports range reading with start/end byte positions
- Handles character devices and blocking reads

### Write Streams  
- filehandle.createWriteStream(options): Create writable stream
- Options: encoding, start, highWaterMark, flush
- Supports writing at specific file positions
- Automatic file descriptor management

### Stream Benefits
- Memory-efficient for large files
- Backpressure handling for flow control
- Event-driven processing (data, end, error, close events)
- Pipeline integration with other Node.js streams

## File System Permissions and Metadata

### Permission Management
- fs.chmod(path, mode): Change file permissions
- fs.chown(path, uid, gid): Change file ownership
- fs.access(path, mode): Test file access permissions
- Mode constants: fs.constants.F_OK, R_OK, W_OK, X_OK

### Metadata Operations
- fs.stat(path): Get file statistics
- fs.lstat(path): Get symbolic link statistics  
- fs.fstat(fd): Get file descriptor statistics
- Statistics include: size, birthtime, mtime, ctime, atime

### File System Information
- fs.statfs(path): File system statistics
- Available space, block size, total/free inodes
- File system type and mount information

## Error Handling Patterns

### Common Error Codes
- ENOENT: No such file or directory
- EACCES: Permission denied
- EISDIR: Is a directory (when file expected)
- ENOTDIR: Not a directory (when directory expected)
- EMFILE: Too many open files
- ENOSPC: No space left on device

### Error Object Properties
- error.code: System error code  
- error.errno: Numeric error code
- error.path: File path related to error
- error.syscall: System call that failed

## Performance Considerations

### ThreadPool Usage
Promise APIs use underlying Node.js threadpool for file system operations off the event loop thread. Operations not synchronized or threadsafe - care required for concurrent modifications.

### Best Practices
- Use callback APIs for maximum performance
- Batch operations when possible to reduce system call overhead
- Consider streaming for large file operations
- Close file handles explicitly to prevent resource leaks
- Use fs.constants for consistent flag and mode values

### Memory Management
- Streams handle backpressure automatically
- Large file reading should use streams or chunked reads
- FileHandle objects should be closed after use
- Avoid keeping large Buffers in memory unnecessarily

## Supplementary Details

The fs module provides comprehensive file system access with multiple API styles to accommodate different programming patterns and performance requirements. Modern applications should prefer promise-based APIs for cleaner asynchronous code.

## Reference Details

### Common File System Methods
- fs.readFile(path, options): Read entire file into memory
- fs.writeFile(path, data, options): Write data to file
- fs.appendFile(path, data, options): Append data to file
- fs.copyFile(src, dest, mode): Copy file between locations
- fs.rename(oldPath, newPath): Rename/move file
- fs.unlink(path): Delete file
- fs.mkdir(path, options): Create directory
- fs.rmdir(path, options): Remove directory
- fs.readdir(path, options): Read directory contents

### File Open Flags
- 'r': Open for reading (default)
- 'w': Open for writing (truncates existing)
- 'a': Open for appending
- 'x': Open for exclusive creation (fails if exists)
- 'r+': Open for reading and writing
- 'w+': Open for reading and writing (truncates)
- 'a+': Open for reading and appending

### Options Objects
Common options across methods:
- encoding: Character encoding ('utf8', 'ascii', 'base64', etc.)
- flag: File open flags
- mode: File permissions (octal or symbolic)
- signal: AbortSignal for operation cancellation

### Stream Options
- highWaterMark: Internal buffer size
- encoding: Character encoding for readable streams
- objectMode: Handle objects instead of strings/Buffers
- autoClose: Automatically close underlying file descriptor
- emitClose: Emit close event when stream destroyed

## Detailed Digest  

**Source Content:** Node.js File System API documentation (https://nodejs.org/api/fs.html)
**Retrieved:** 2026-03-13
**Attribution:** Node.js Foundation and contributors
**Data Size:** Approximately 4KB extracted content

Node.js fs module provides comprehensive file system operations through promise-based, callback, and synchronous APIs, with FileHandle objects for advanced file management and streaming capabilities for efficient large file processing.