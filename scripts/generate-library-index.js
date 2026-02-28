#!/usr/bin/env node
// generate-library-index.js
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Configuration
const libraryDocumentsPath = "./library/";
const outputFile = "./library-index.html";

// Get the list of files in the library directory
const getLibraryFiles = () => {
  try {
    if (!fs.existsSync(libraryDocumentsPath)) {
      fs.mkdirSync(libraryDocumentsPath, { recursive: true });
      return [];
    }
    return fs
      .readdirSync(libraryDocumentsPath)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        name: file,
        path: path.join(libraryDocumentsPath, file),
      }));
  } catch (error) {
    console.error(`Error reading library directory: ${error.message}`);
    return [];
  }
};

// Get the output of ls -lath for the library directory
const getLsOutput = () => {
  try {
    return execSync(`ls -lath ${libraryDocumentsPath}`).toString();
  } catch (error) {
    console.error(`Error executing ls command: ${error.message}`);
    return "Error executing ls command";
  }
};

// Generate HTML content for the library index
const generateHTML = (files, lsOutput) => {
  const now = new Date().toISOString();

  // Create list items for each file
  const fileItems =
    files.length > 0
      ? files
          .map((file) => {
            // Extract title from the file (first line after removing # prefix)
            let title = file.name.replace(".md", "");
            try {
              const content = fs.readFileSync(file.path, "utf8");
              const firstLine = content.split("\n")[0];
              if (firstLine.startsWith("# ")) {
                title = firstLine.substring(2).trim();
              }
            } catch (error) {
              console.error(`Error reading file ${file.path}: ${error.message}`);
            }

            return `
        <li>
          <div class="doc-title">${title}</div>
          <a href="${file.name.replace(".md", ".html")}" class="source-link">View Document</a>
          <a href="${file.path}" class="source-link">View Source</a>
          <p class="description">Document: ${file.name}</p>
        </li>`;
          })
          .join("\n")
      : "<li>No documents found in the library directory.</li>";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Library Documents</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; background-color: #f9f9f9; color: #333; }
    header { padding-bottom: 1em; border-bottom: 2px solid #ccc; margin-bottom: 1em; }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; margin-top: 1.5em; }
    section { margin-bottom: 1.5em; }
    ul { list-style: none; padding: 0; }
    li { margin: 1em 0; padding: 0.8em; background-color: #fff; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    li:hover { background-color: #f0f8ff; }
    .label { font-weight: bold; }
    .doc-title { font-weight: bold; font-size: 1.1em; }
    .source-link { font-size: 0.9em; margin-left: 0.5em; color: #6c757d; }
    .source-link:hover { color: #0366d6; }
    .description { margin-top: 0.5em; margin-bottom: 0; font-size: 0.95em; color: #555; line-height: 1.4; }
    footer { margin-top: 2em; font-size: 0.9em; color: #777; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    pre { background-color: #f5f5f5; padding: 1em; border-radius: 5px; overflow-x: auto; }
  </style>
</head>
<body>
  <header>
    <h1>Library Documents</h1>
  </header>

  <section>
    <h2>Library Documents</h2>
    <p>Below are links to various library documents with their original sources:</p>
    <ul>
      ${fileItems}
    </ul>
  </section>

  <section>
    <h2>Library Directory Contents</h2>
    <p>Output of <code>ls -lath</code> for the library directory:</p>
    <pre>${lsOutput}</pre>
  </section>

  <footer>
    <p>Generated on ${now}</p>
  </footer>
</body>
</html>
`;
};

// Main function
const main = () => {
  try {
    const files = getLibraryFiles();
    const lsOutput = getLsOutput();
    const html = generateHTML(files, lsOutput);

    fs.writeFileSync(outputFile, html, "utf8");
    console.log(`Successfully generated ${outputFile}`);
  } catch (error) {
    console.error(`Error generating library index: ${error.message}`);
    process.exit(1);
  }
};

main();
