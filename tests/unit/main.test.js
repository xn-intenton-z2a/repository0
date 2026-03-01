import { describe, it, expect } from "vitest";
import { main, capitalize, slugify, truncate, reverse } from "../../src/lib/main.js";

describe("capitalize", () => {
  it("should capitalize the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });

  it("should handle empty strings", () => {
    expect(capitalize("")).toBe("");
  });

  it("should handle non-string input", () => {
    expect(capitalize(null)).toBe(null);
    expect(capitalize(undefined)).toBe(undefined);
    expect(capitalize(123)).toBe(123);
  });

  it("should handle already capitalized strings", () => {
    expect(capitalize("Hello")).toBe("Hello");
  });
});

describe("slugify", () => {
  it("should convert to lowercase and replace spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
    expect(slugify("My Blog Post Title")).toBe("my-blog-post-title");
  });

  it("should remove special characters", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("Test@#$%String")).toBe("teststring");
  });

  it("should handle multiple spaces and hyphens", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
    expect(slugify("Hello---World")).toBe("hello-world");
    expect(slugify("Hello_World")).toBe("hello-world");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(slugify("-Hello World-")).toBe("hello-world");
    expect(slugify("___Hello World___")).toBe("hello-world");
  });

  it("should handle empty and non-string input", () => {
    expect(slugify("")).toBe("");
    expect(slugify(null)).toBe("");
    expect(slugify(undefined)).toBe("");
  });
});

describe("truncate", () => {
  it("should truncate strings longer than specified length", () => {
    expect(truncate("Hello World", 5)).toBe("He...");
    expect(truncate("This is a long string", 10)).toBe("This is...");
  });

  it("should not truncate strings shorter than or equal to specified length", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
    expect(truncate("Hello", 5)).toBe("Hello");
  });

  it("should use custom suffix", () => {
    expect(truncate("Hello World", 8, ">>>")).toBe("Hello>>>");
  });

  it("should handle edge cases", () => {
    expect(truncate("", 5)).toBe("");
    expect(truncate("Hi", 1)).toBe("");
  });

  it("should handle non-string input", () => {
    expect(truncate(null, 5)).toBe(null);
    expect(truncate(123, 5)).toBe(123);
    expect(truncate("hello", "invalid")).toBe("hello");
  });
});

describe("reverse", () => {
  it("should reverse strings correctly", () => {
    expect(reverse("hello")).toBe("olleh");
    expect(reverse("world")).toBe("dlrow");
    expect(reverse("12345")).toBe("54321");
  });

  it("should handle empty strings", () => {
    expect(reverse("")).toBe("");
  });

  it("should handle single characters", () => {
    expect(reverse("a")).toBe("a");
  });

  it("should handle non-string input", () => {
    expect(reverse(null)).toBe(null);
    expect(reverse(undefined)).toBe(undefined);
    expect(reverse(123)).toBe(123);
  });
});

describe("main", () => {
  it("should return an object with all transformations", () => {
    const result = main("Test String");
    expect(result).toHaveProperty("original", "Test String");
    expect(result).toHaveProperty("capitalize", "Test String");
    expect(result).toHaveProperty("slugify", "test-string");
    expect(result).toHaveProperty("truncate", "Test String");
    expect(result).toHaveProperty("reverse", "gnirtS tseT");
  });

  it("should use default input when none provided", () => {
    const result = main();
    expect(result).toHaveProperty("original");
    expect(result.original).toBe("Hello World! This is a sample string.");
  });
});
