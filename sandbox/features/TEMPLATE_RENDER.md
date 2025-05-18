# Template Rendering

Provide a new CLI option to render EJS templates with JSON or YAML data files, producing rendered output on stdout.

# Usage
1. --render <templatePath> <dataPath> : Read the EJS template file at templatePath, load and parse dataPath (JSON or YAML), render the template with the data context, then print the result to stdout.
2. Invoke alongside other flags; --render takes precedence and terminates processing after rendering.

# Source File Changes
- In src/lib/main.js, import ejs, js-yaml, and fs alongside existing dependencies.
- Detect the --render option in argument dispatch:
  - Resolve templatePath and dataPath to absolute paths.
  - Read template content as string; read dataPath content and parse as JSON or YAML based on file extension.
  - Call ejs.render(templateContent, dataObject) and console.log the rendered string.
- Preserve existing behavior for --help, --version, --mission, --config, --env, --csv, and default commands.

# Tests
- Create sandbox/tests/fixtures/template.ejs containing a template with placeholders (e.g. "Hello <%= name %>!").
- Create sandbox/tests/fixtures/data.json and data.yaml fixtures with matching objects.
- Add sandbox/tests/render.test.js:
  • When main is invoked with --render pointing to template.ejs and data.json, capture stdout and verify it prints the expected rendered string.
  • Repeat for data.yaml fixture.
  • Ensure that using other options still produces correct outputs and existing tests remain unaffected.

# README Updates
- In README.md Usage section, document the --render option with examples:
  npm run start -- --render path/to/template.ejs path/to/data.json
  npm run start -- --render path/to/template.ejs path/to/data.yaml
- Show sample output for each example.

# Dependencies
- Ensure ejs and js-yaml are listed under dependencies in package.json (already present).