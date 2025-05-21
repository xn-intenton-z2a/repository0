# CLI Usage

The `repository0` CLI supports displaying emotions as ASCII art, plotting equations in the console, and serving plots over HTTP.

## Usage

### Display Emotion

```bash
npm run start -- --emotion <name>
```

#### Examples

Display a happy face:

```bash
npm run start -- --emotion happy
```

Output:

```
:-)
```

Unsupported emotion:

```bash
npm run start -- --emotion foo
```

Output:

```
Unsupported emotion: foo
Supported emotions: happy, sad, angry, surprised
```

No flag:

```bash
npm run start
```

Output:

```
Usage: --emotion <name>
Supported emotions: happy, sad, angry, surprised
```

## Plotting Equations

The CLI can render ASCII plots of mathematical equations.

### Console Mode

```bash
npm run start -- --plot "<equation>"
```

#### Example

```bash
npm run start -- --plot "x^2 - 2*x + 1"
```

This will output an ASCII graph of the equation.

### HTTP Server Mode

```bash
npm run serve -- --port <number>
```

#### Example

```bash
npm run serve -- --port 4000
```

Then access via:

```bash
curl "http://localhost:4000/plot?equation=sin(x)*x"
```

This returns an HTML page with the ASCII plot wrapped in a `<pre>` block.

For full specification, see [features/PLOT_EQUATION.md](../features/PLOT_EQUATION.md).
