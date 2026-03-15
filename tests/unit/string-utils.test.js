// SPDX-License-Identifier: MIT
// tests/unit/string-utils.test.js
import { describe, test, expect } from "vitest";
import {
  slugify,
  truncate,
  camelCase,
  kebabCase,
  titleCase,
  wordWrap,
  stripHtml,
  escapeRegex,
  pluralize,
  levenshtein,
} from "../../src/lib/main.js";

describe("String Utilities", () => {
  test("slugify basic example", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  test("slugify handles Unicode and diacritics", () => {
    expect(slugify("naïve café")).toBe("naive-cafe");
  });

  test("truncate does not break mid-word and uses ellipsis", () => {
    expect(truncate("Hello World", 8)).toBe("Hello…");
  });

  test("truncate with small maxLength returns suffix only when necessary", () => {
    expect(truncate("Hello", 1)).toBe("…".slice(0, 1));
  });

  test("camelCase basic example", () => {
    expect(camelCase("foo-bar-baz")).toBe("fooBarBaz");
  });

  test("kebabCase from camelCase and spaces", () => {
    expect(kebabCase("fooBarBaz")).toBe("foo-bar-baz");
    expect(kebabCase("Foo Bar Baz")).toBe("foo-bar-baz");
  });

  test("titleCase capitalises words", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  test("wordWrap respects width and doesn't break words", () => {
    expect(wordWrap("The quick brown fox", 10)).toBe("The quick\nbrown fox");
    expect(wordWrap("supercalifragilisticexpialidocious test", 10)).toBe("supercalifragilisticexpialidocious\ntest");
  });

  test("stripHtml removes tags and decodes entities", () => {
    expect(stripHtml("<p>Hello &amp; <strong>World</strong></p>")).toBe("Hello & World");
    expect(stripHtml("&#x1F600; smiles")).toBe("😀 smiles");
  });

  test("escapeRegex escapes special characters", () => {
    const raw = "a+b(c)*.js";
    const escaped = escapeRegex(raw);
    const re = new RegExp(`^${escaped}$`);
    expect(re.test(raw)).toBe(true);
  });

  test("pluralize handles common rules", () => {
    expect(pluralize("box")).toBe("boxes");
    expect(pluralize("party")).toBe("parties");
    expect(pluralize("leaf")).toBe("leaves");
    expect(pluralize("car")).toBe("cars");
  });

  test("levenshtein distance example", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });

  test("functions handle null/undefined/empty gracefully", () => {
    expect(slugify(null)).toBe("");
    expect(truncate(undefined, 5)).toBe("");
    expect(camelCase("")).toBe("");
    expect(kebabCase(null)).toBe("");
    expect(titleCase(undefined)).toBe("");
    expect(wordWrap(null)).toBe("");
    expect(stripHtml(undefined)).toBe("");
    expect(escapeRegex(null)).toBe("");
    expect(pluralize(undefined)).toBe("");
    // levenshtein treats null/undefined as empty strings
    expect(levenshtein(null, undefined)).toBe(0);
  });
});
