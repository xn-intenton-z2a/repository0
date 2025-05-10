# repository0

repository0 is a template demonstrating agentic-lib automated CI/CD workflows while providing a small JS equation plotter library for quadratic and sine functions.

## Links

- [Mission Statement](../../MISSION.md)
- [Contributing Guidelines](../../CONTRIBUTING.md)
- [License](../../LICENSE.md)
- [agentic-lib Repository](https://github.com/xn-intenton-z2a/agentic-lib)

## Usage

```js
import { plotQuadratic, plotSine } from '../source/plot.js';
const quadSvg = plotQuadratic(1, 0, 0);
const sineSvg = plotSine(1, 2);
```

### CLI

```bash
npm install
npm run start -- --help
npm run start
```

For full API reference and detailed examples, see [USAGE.md](./USAGE.md).
