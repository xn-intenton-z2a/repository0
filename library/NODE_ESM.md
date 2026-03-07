Node.js ESM Notes

To enable ESM in Node.js:
- Add "type": "module" to package.json (then .js files are ESM)
- Or use .mjs extension for module files

Key points:
- Use import/export instead of require/module.exports
- Top-level await is supported in ESM
- CommonJS interop requires default imports (e.g., import pkg from 'cjs-package') and may need dynamic import for some cases

Example package.json:

```json
{
  "type": "module",
  "name": "my-app"
}
```