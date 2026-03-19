// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { readFile } from "fs/promises";
import { getIdentity } from "../../src/lib/main.js";

describe("Website Structure", () => {
  let dom;
  let document;
  
  beforeEach(async () => {
    const html = await readFile("src/web/index.html", "utf-8");
    dom = new JSDOM(html, { 
      url: "http://localhost",
      resources: "usable",
      runScripts: "outside-only"
    });
    document = dom.window.document;
  });

  test("contains required structural elements", () => {
    expect(document.querySelector("#lib-name")).toBeTruthy();
    expect(document.querySelector("#lib-version")).toBeTruthy();
    expect(document.querySelector("#lib-description")).toBeTruthy();
  });

  test("contains plotting demo sections", () => {
    expect(document.querySelector("#expression-input")).toBeTruthy();
    expect(document.querySelector("#range-input")).toBeTruthy();
    expect(document.querySelector("#expression-output")).toBeTruthy();
    expect(document.querySelector("#csv-input")).toBeTruthy();
    expect(document.querySelector("#csv-output")).toBeTruthy();
  });

  test("contains CLI examples section", () => {
    expect(document.querySelector("#cli-examples")).toBeTruthy();
  });

  test("has proper meta tags", () => {
    const title = document.querySelector('title');
    expect(title.textContent).toContain("Plot Code Library");
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle.getAttribute('content')).toContain("Plot Code Library");
  });
});

describe("Library Integration", () => {
  test("library exports expected functions for web usage", async () => {
    // This test verifies the library has the functions the website expects to import
    const { 
      name, 
      version, 
      description, 
      parseExpression, 
      evaluateRange, 
      renderSVG 
    } = await import("../../src/lib/main.js");
    
    expect(typeof name).toBe("string");
    expect(typeof version).toBe("string");
    expect(typeof description).toBe("string");
    expect(typeof parseExpression).toBe("function");
    expect(typeof evaluateRange).toBe("function");
    expect(typeof renderSVG).toBe("function");
  });

  test("library identity matches expected structure", () => {
    const identity = getIdentity();
    expect(identity).toHaveProperty("name");
    expect(identity).toHaveProperty("version");
    expect(identity).toHaveProperty("description");
    expect(typeof identity.name).toBe("string");
    expect(typeof identity.version).toBe("string");
    expect(typeof identity.description).toBe("string");
  });

  test("web lib.js re-exports main library correctly", async () => {
    // Verify the web/lib.js file exists and re-exports properly
    const webLib = await import("../../src/web/lib.js");
    const mainLib = await import("../../src/lib/main.js");
    
    expect(webLib.name).toBe(mainLib.name);
    expect(webLib.version).toBe(mainLib.version);
    expect(webLib.parseExpression).toBe(mainLib.parseExpression);
  });
});

describe("Demo Functionality", () => {
  test("website can generate SVG plots", async () => {
    const { parseExpression, evaluateRange, renderSVG } = await import("../../src/lib/main.js");
    
    // Simulate what the website demo does
    const func = parseExpression("Math.sin(x)");
    const points = evaluateRange(func, "0:0.5:3");
    const svg = renderSVG(points);
    
    expect(svg).toContain("<svg");
    expect(svg).toContain("<polyline");
    expect(svg).toContain("viewBox");
  });

  test("website can parse CSV data", () => {
    // Simulate CSV parsing logic from the website
    const csvText = `time,value
0,1
1,4
2,9`;
    
    const lines = csvText.trim().split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    
    expect(header).toContain('time');
    expect(header).toContain('value');
    
    const timeIndex = header.indexOf('time');
    const valueIndex = header.indexOf('value');
    
    const points = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const time = Number(values[timeIndex]);
      const value = Number(values[valueIndex]);
      
      if (!isNaN(time) && !isNaN(value)) {
        points.push({ x: time, y: value });
      }
    }
    
    expect(points).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 4 },
      { x: 2, y: 9 }
    ]);
  });
});