# File Output Manager

Save rendered plots to files with format inference from file extensions.

## Format Detection

Detect output format from file extension (.svg or .png). Support case-insensitive extensions. Provide clear error messages for unsupported formats.

## File Writing

Use appropriate file writing methods for each format. Write SVG as UTF-8 text files. Write PNG as binary buffers. Handle file system permissions and path creation.

## Path Handling

Support both relative and absolute file paths. Create parent directories if they don't exist. Validate file paths are writable before attempting to save.

## API Design

```javascript
export function saveFile(content, filePath, options = {}) {
  // Saves content to file with format detection
}

export function inferFormat(filePath) {
  // Returns 'svg' or 'png' based on extension
}
```

## Error Handling

Provide descriptive error messages for file system errors. Handle permission denied, disk full, and invalid path scenarios. Validate file paths before processing data.

## Acceptance Criteria

- Infer SVG format from .svg extension
- Infer PNG format from .png extension  
- Save SVG files as UTF-8 text
- Save PNG files as binary data
- Create parent directories as needed
- Handle file system errors gracefully
- Support both relative and absolute paths
- Validate file extensions are supported