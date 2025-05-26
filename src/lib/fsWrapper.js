/**
 * fsWrapper module to provide fs methods in a mutable object for testing.
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require("fs");
export default fs;
