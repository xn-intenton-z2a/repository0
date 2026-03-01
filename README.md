# repository0

A JavaScript utility library that provides string transformation functions (capitalize, slugify, truncate, reverse).
Published to npm as `@xn-intenton-z2a/repository0`. Includes a CLI that demonstrates each function.

## Installation

\`\`\`bash
npm install @xn-intenton-z2a/repository0
\`\`\`

## Usage

### As a Library

\`\`\`javascript
import { capitalize, slugify, truncate, reverse } from '@xn-intenton-z2a/repository0';

// Capitalize first letter
console.log(capitalize('hello world')); // "Hello world"

// Convert to URL-friendly slug
console.log(slugify('My Blog Post Title!')); // "my-blog-post-title"

// Truncate with ellipsis
console.log(truncate('This is a very long string', 10)); // "This is..."

// Reverse string
console.log(reverse('hello')); // "olleh"
\`\`\`

### CLI Usage

\`\`\`bash
# Show all transformations (demo)
npx @xn-intenton-z2a/repository0

# Use specific functions
npx @xn-intenton-z2a/repository0 capitalize "hello world"
npx @xn-intenton-z2a/repository0 slugify "My Blog Post Title"
npx @xn-intenton-z2a/repository0 truncate "This is a very long string"
npx @xn-intenton-z2a/repository0 reverse "hello"

# Get help
npx @xn-intenton-z2a/repository0 --help
\`\`\`

## API Reference

### \`capitalize(str)\`
Capitalizes the first letter of a string.
- **Parameters:** \`str\` (string) - The string to capitalize
- **Returns:** String with first letter capitalized

### \`slugify(str)\`
Converts a string to a URL-friendly slug.
- **Parameters:** \`str\` (string) - The string to slugify
- **Returns:** Lowercase string with spaces/special chars replaced by hyphens

### \`truncate(str, length, suffix = '...')\`
Truncates a string to a specified length with optional suffix.
- **Parameters:** 
  - \`str\` (string) - The string to truncate
  - \`length\` (number) - Maximum length
  - \`suffix\` (string, optional) - Suffix to add when truncated (default: '...')
- **Returns:** Truncated string with suffix if needed

### \`reverse(str)\`
Reverses a string.
- **Parameters:** \`str\` (string) - The string to reverse
- **Returns:** Reversed string

## Development

\`\`\`bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:unit

# Run linting
npm run linting

# Run formatting
npm run formatting
\`\`\`

## License

MIT
