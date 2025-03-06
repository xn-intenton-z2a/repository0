#!/usr/bin/env node
// md-to-html.js
import fs from "fs";
import MarkdownIt from "markdown-it";
import markdownItGithub from "markdown-it-github";

const md = new MarkdownIt({ html: true }).use(markdownItGithub);

function generateHTML(content) {
  const now = new Date().toISOString();
  // You may customize the header information (title, owner, index URL) as needed.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>agentic-lib</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2em; background-color: #f9f9f9; color: #333; }
    header { padding-bottom: 1em; border-bottom: 2px solid #ccc; margin-bottom: 1em; }
    h1 { font-size: 2em; }
    section { margin-bottom: 1.5em; }
    ul { list-style: none; padding: 0; }
    li { margin: 0.5em 0; }
    .label { font-weight: bold; }
    footer { margin-top: 2em; font-size: 0.9em; color: #777; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>agentic-lib</h1>
    <p><a href="https://github.com/xn-intenton-z2a/agentic-lib">repository</a> - <a href="https://xn-intenton-z2a.github.io/agentic-lib/latest.html">latest stats</a> - <a href="https://xn-intenton-z2a.github.io/agentic-lib/all.html">all stats</a></p>
  </header>
  <section>
    ${content}
  </section>
  <footer>
    <p>Generated on ${now}</p>
  </footer>
</body>
</html>`;
}

// If STDIN is being piped, read from it and output to STDOUT.
if (!process.stdin.isTTY) {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const markdownHTML = md.render(data);
      const fullHTML = generateHTML(markdownHTML);
      process.stdout.write(fullHTML);
    } catch (err) {
      console.error("Error during conversion:", err);
      process.exit(1);
    }
  });
} else {
  // Otherwise, read from the default input file and write to the default output file.
  const inputFile = "README.md";
  const outputFile = "index.html";
  try {
    const data = fs.readFileSync(inputFile, "utf8");
    const markdownHTML = md.render(data);
    const fullHTML = generateHTML(markdownHTML);
    fs.writeFileSync(outputFile, fullHTML, "utf8");
    console.log(`Successfully converted ${inputFile} to ${outputFile}`);
  } catch (err) {
    console.error("Error during conversion:", err);
    process.exit(1);
  }
}
