// src/lib/main.js — String transformation utility library
// A JavaScript utility library that provides string transformation functions

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a string to a URL-friendly slug
 * @param {string} str - The string to slugify
 * @returns {string} The slugified string
 */
export function slugify(str) {
  if (typeof str !== "string") {
    return "";
  }
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with single hyphen
    .replace(/--+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

/**
 * Truncates a string to a specified length with optional ellipsis
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @param {string} suffix - The suffix to add when truncated (default: '...')
 * @returns {string} The truncated string
 */
export function truncate(str, length, suffix = "...") {
  if (typeof str !== "string" || typeof length !== "number") {
    return str;
  }
  if (str.length <= length) {
    return str;
  }
  // Handle edge case where length is less than suffix length
  if (length <= suffix.length) {
    return "";
  }
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Reverses a string
 * @param {string} str - The string to reverse
 * @returns {string} The reversed string
 */
export function reverse(str) {
  if (typeof str !== "string") {
    return str;
  }
  return str.split("").reverse().join("");
}

/**
 * Main function that demonstrates all string transformation functions
 * @param {string} input - Input string for demonstration
 * @returns {object} Object containing results of all transformations
 */
export function main(input = "Hello World! This is a sample string.") {
  const results = {
    original: input,
    capitalize: capitalize(input),
    slugify: slugify(input),
    truncate: truncate(input, 20),
    reverse: reverse(input),
  };

  console.log("String Transformation Demo:");
  console.log("==========================");
  Object.entries(results).forEach(([key, value]) => {
    console.log(`${key.padEnd(10)}: ${value}`);
  });

  return results;
}

// CLI functionality
function runCLI() {
  const args = process.argv.slice(2);
  const command = args[0];
  const input = args.slice(1).join(" ") || "Hello World! This is a sample string.";

  if (command === "--help" || command === "-h") {
    console.log("Usage: node main.js [command] [text]");
    console.log("Commands:");
    console.log("  capitalize  - Capitalize first letter");
    console.log("  slugify     - Convert to URL-friendly slug");
    console.log("  truncate    - Truncate to 20 characters");
    console.log("  reverse     - Reverse the string");
    console.log("  demo        - Show all transformations (default)");
    console.log("");
    console.log("Examples:");
    console.log('  node main.js capitalize "hello world"');
    console.log('  node main.js slugify "My Blog Post Title"');
    console.log('  node main.js truncate "This is a very long string"');
    console.log('  node main.js reverse "hello"');
    return;
  }

  let result;
  switch (command) {
    case "capitalize":
      result = capitalize(input);
      console.log(result);
      break;
    case "slugify":
      result = slugify(input);
      console.log(result);
      break;
    case "truncate":
      result = truncate(input, 20);
      console.log(result);
      break;
    case "reverse":
      result = reverse(input);
      console.log(result);
      break;
    case "demo":
    default:
      main(input);
      break;
  }
}

// Auto-run CLI when called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  runCLI();
}
