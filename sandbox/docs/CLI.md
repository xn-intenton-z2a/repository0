# CLI Commands

## seed

Generates the default discussion seed template.

### Usage

**Print to stdout**
```
npm run seed
```
- Prints the seed template to standard output.
- Exits with code `0`.

**Write to file**
```
npm run seed -- --output <file>
```
- Writes the seed template to the specified `<file>`.
- Exits with code `0`.

### Template Content

```md
# Discussion Seed

## Topic 1: [Placeholder]

## Topic 2: [Placeholder]
```
