import minimist from "minimist";
import MarkdownIt from "markdown-it";
import markdownItGithub from "markdown-it-github";
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

/**
 * Prints the usage message for the CLI.
 * @returns {string} Usage instructions.
 */
export function usage() {
  return "Usage: node main.js convert <input.md> [-o <output.html>]";
}

/**
 * Converts a Markdown file to HTML.
 * @param {string} inputPath - Path to the input Markdown file.
 * @param {string} [outputPath] - Optional path to write the output HTML file.
 * @returns {Promise<string>} The rendered HTML string.
 * @throws {Error} If reading or writing files fails.
 */
export async function convert(inputPath, outputPath) {
  if (!inputPath) {
    throw new Error("No input file specified");
  }
  let data;
  try {
    data = await readFile(inputPath, "utf8");
  } catch (error) {
    throw new Error(`Failed to read input file: ${error.message}`);
  }
  const md = new MarkdownIt().use(markdownItGithub);
  const html = md.render(data);
  if (outputPath) {
    try {
      await writeFile(outputPath, html, "utf8");
    } catch (error) {
      throw new Error(`Failed to write output file: ${error.message}`);
    }
  }
  return html;
}

/**
 * Main entry point for CLI arguments.
 * @param {string[]} args - Command-line arguments (excluding node and script path).
 * @returns {Promise<string>} The rendered HTML if successful.
 * @throws {Error} For invalid command or missing input.
 */
export async function main(args) {
  const [cmd, ...rest] = args;
  if (cmd !== "convert") {
    throw new Error(usage());
  }
  const argv = minimist(rest, { alias: { o: "output" }, string: ["output"] });
  const input = argv._[0];
  const output = argv.output;
  if (!input) {
    throw new Error(usage());
  }
  return await convert(input, output);
}

// CLI wrapper: only run when executed directly
if (process.argv[1] === __filename) {
  const args = process.argv.slice(2);
  main(args)
    .then((html) => {
      const argv = minimist(args, { alias: { o: "output" }, string: ["output"] });
      if (!argv.output) {
        process.stdout.write(html);
      }
      process.exit(0);
    })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    });
}
