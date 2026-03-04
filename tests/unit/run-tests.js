import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { execSync } from 'child_process';

// Use Node's built-in test runner (node --test) to run unit tests written with describe/it
try {
  execSync('node --test tests/unit/main.test.js', { stdio: 'inherit' });
  process.exit(0);
} catch (e) {
  process.exit(e.status || 1);
}
