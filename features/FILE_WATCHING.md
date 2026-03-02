# File Watching

Implement file system watching capabilities to automatically detect changes and re-execute operations when files are modified.

## Overview

Add file watching functionality that monitors specified files or directories for changes and automatically triggers re-execution of library operations. This provides a development-friendly workflow for iterative testing and development.

## Acceptance Criteria

- Support --watch flag to enable file watching mode
- Monitor current directory and subdirectories for file changes by default
- Support configurable watch patterns to include/exclude specific files or directories
- Debounce file change events to prevent excessive re-execution
- Provide clear console output indicating when files change and operations restart  
- Handle file system errors gracefully (permission issues, deleted files)
- Support graceful shutdown via standard interrupt signals
- Include comprehensive tests for file watching scenarios

## Implementation Notes

Use Node.js built-in fs.watch or fs.watchFile for file system monitoring. Implement proper debouncing to handle rapid file changes. Consider cross-platform compatibility for file watching behavior differences.

## Success Metrics

- File changes trigger automatic re-execution reliably
- Performance impact is minimal during file monitoring
- Console output provides clear feedback about file changes
- Watch patterns work correctly for inclusion and exclusion
- System handles edge cases like file deletion and permission changes