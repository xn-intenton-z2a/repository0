// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// tests/unit/main.test.js

import { describe, it, expect } from "vitest";
import { main } from "../../src/lib/main.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("plot-code-lib", () => {
  describe("main function", () => {
    it("should show help when --help is provided", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--help"]);
      
      console.log = originalLog;
      expect(output).toContain("plot-code-lib - The jq of formulae visualisations");
      expect(output).toContain("USAGE:");
      expect(output).toContain("EXAMPLES:");
    });

    it("should show version when --version is provided", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--version"]);
      
      console.log = originalLog;
      expect(output).toContain("plot-code-lib version 0.1.0");
    });

    it("should generate SVG for sine function", () => {
      const originalLog = console.log;
      const originalError = console.error;
      let output = "";
      let errors = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      console.error = (...args) => { errors += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=sin(x)", "--range", "x=-pi:pi"]);
      
      console.log = originalLog;
      console.error = originalError;
      
      expect(errors).toBe("");
      expect(output).toContain("<svg");
      expect(output).toContain("</svg>");
      expect(output).toContain("Generated");
      expect(output).toContain("data points");
    });

    it("should save SVG to file when output is specified", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      const tempFile = path.join(__dirname, "test-output.svg");
      
      main(["--expression", "y=x^2", "--range", "x=-2:2", "--output", tempFile]);
      
      console.log = originalLog;
      
      expect(fs.existsSync(tempFile)).toBe(true);
      const content = fs.readFileSync(tempFile, "utf8");
      expect(content).toContain("<svg");
      expect(content).toContain("</svg>");
      expect(output).toContain(`Plot saved to ${tempFile}`);
      
      // Cleanup
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    });

    it("should handle cosine function", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=cos(x)", "--range", "x=0:pi"]);
      
      console.log = originalLog;
      
      expect(output).toContain("<svg");
      expect(output).toContain("Generated");
    });

    it("should handle logarithmic function with custom step", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=log(x)", "--range", "x=0.1:0.1:5"]);
      
      console.log = originalLog;
      
      expect(output).toContain("<svg");
      expect(output).toContain("Generated");
    });

    it("should error when expression is missing", () => {
      const originalError = console.error;
      const originalExit = process.exit;
      let errors = "";
      let exitCode = null;
      
      console.error = (...args) => { errors += args.join(" ") + "\\n"; };
      process.exit = (code) => { exitCode = code; throw new Error("Process exit"); };
      
      expect(() => main(["--range", "x=-1:1"])).toThrow("Process exit");
      
      console.error = originalError;
      process.exit = originalExit;
      
      expect(errors).toContain("--expression is required");
      expect(exitCode).toBe(1);
    });

    it("should error when range is missing", () => {
      const originalError = console.error;
      const originalExit = process.exit;
      let errors = "";
      let exitCode = null;
      
      console.error = (...args) => { errors += args.join(" ") + "\\n"; };
      process.exit = (code) => { exitCode = code; throw new Error("Process exit"); };
      
      expect(() => main(["--expression", "y=sin(x)"])).toThrow("Process exit");
      
      console.error = originalError;
      process.exit = originalExit;
      
      expect(errors).toContain("--range is required");
      expect(exitCode).toBe(1);
    });
  });

  describe("mathematical expressions", () => {
    it("should handle basic arithmetic operations", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=2*x+1", "--range", "x=-5:5"]);
      
      console.log = originalLog;
      
      expect(output).toContain("<svg");
      expect(output).toContain("Generated");
    });

    it("should handle power operations", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=x^3", "--range", "x=-2:2"]);
      
      console.log = originalLog;
      
      expect(output).toContain("<svg");
      expect(output).toContain("Generated");
    });

    it("should handle constants", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=pi*x", "--range", "x=0:2"]);
      
      console.log = originalLog;
      
      expect(output).toContain("<svg");
      expect(output).toContain("Generated");
    });
  });

  describe("error handling", () => {
    it("should handle invalid expressions gracefully", () => {
      const originalError = console.error;
      const originalExit = process.exit;
      let errors = "";
      let exitCode = null;
      
      console.error = (...args) => { errors += args.join(" ") + "\\n"; };
      process.exit = (code) => { exitCode = code; throw new Error("Process exit"); };
      
      expect(() => main(["--expression", "invalid", "--range", "x=-1:1"])).toThrow("Process exit");
      
      console.error = originalError;
      process.exit = originalExit;
      
      expect(errors).toContain("Error:");
      expect(exitCode).toBe(1);
    });

    it("should handle invalid range formats", () => {
      const originalError = console.error;
      const originalExit = process.exit;
      let errors = "";
      let exitCode = null;
      
      console.error = (...args) => { errors += args.join(" ") + "\\n"; };
      process.exit = (code) => { exitCode = code; throw new Error("Process exit"); };
      
      expect(() => main(["--expression", "y=x", "--range", "invalid"])).toThrow("Process exit");
      
      console.error = originalError;
      process.exit = originalExit;
      
      expect(errors).toContain("Error:");
      expect(exitCode).toBe(1);
    });
  });

  describe("SVG output validation", () => {
    it("should generate valid SVG structure", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=sin(x)", "--range", "x=0:pi"]);
      
      console.log = originalLog;
      
      // Check SVG structure
      expect(output).toContain('<svg width="800" height="600"');
      expect(output).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(output).toContain('<rect width="800" height="600" fill="white"');
      expect(output).toContain('<path d="M');
      expect(output).toContain('</svg>');
    });

    it("should include grid and axes", () => {
      const originalLog = console.log;
      let output = "";
      console.log = (...args) => { output += args.join(" ") + "\\n"; };
      
      main(["--expression", "y=x", "--range", "x=-1:1"]);
      
      console.log = originalLog;
      
      expect(output).toContain('stroke="#f0f0f0"'); // Grid
      expect(output).toContain('stroke="black" stroke-width="2"'); // Axes
    });
  });
});
