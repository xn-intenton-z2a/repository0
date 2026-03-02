// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, beforeEach, vi } from "vitest";
import { CodeAnalyzer, formatResults, main } from "../../src/lib/main.js";

describe("CodeAnalyzer", () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer();
  });

  describe("constructor", () => {
    test("should initialize with default options", () => {
      expect(analyzer.options.maxDepth).toBe(3);
      expect(analyzer.options.includePatterns).toContain('.js');
      expect(analyzer.options.excludePatterns).toContain('node_modules');
    });

    test("should accept custom options", () => {
      const customAnalyzer = new CodeAnalyzer({ maxDepth: 5 });
      expect(customAnalyzer.options.maxDepth).toBe(5);
    });
  });

  describe("isIncludedFile", () => {
    test("should include JavaScript files", () => {
      expect(analyzer.isIncludedFile('test.js')).toBe(true);
      expect(analyzer.isIncludedFile('test.mjs')).toBe(true);
    });

    test("should include TypeScript files", () => {
      expect(analyzer.isIncludedFile('test.ts')).toBe(true);
    });

    test("should include JSON files", () => {
      expect(analyzer.isIncludedFile('package.json')).toBe(true);
    });

    test("should exclude non-supported files", () => {
      expect(analyzer.isIncludedFile('test.txt')).toBe(false);
      expect(analyzer.isIncludedFile('image.png')).toBe(false);
    });
  });

  describe("calculateComplexity", () => {
    test("should return base complexity for simple code", () => {
      const simpleCode = 'const x = 1;';
      expect(analyzer.calculateComplexity(simpleCode)).toBe(1);
    });

    test("should increase complexity for control structures", () => {
      const complexCode = `
        if (condition) {
          for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
              console.log(i);
            }
          }
        }
      `;
      expect(analyzer.calculateComplexity(complexCode)).toBeGreaterThan(1);
    });

    test("should count ternary operators", () => {
      const ternaryCode = 'const result = condition ? value1 : value2;';
      expect(analyzer.calculateComplexity(ternaryCode)).toBe(2);
    });

    test("should count try-catch blocks", () => {
      const tryCatchCode = `
        try {
          riskeyOperation();
        } catch (error) {
          handleError(error);
        }
      `;
      expect(analyzer.calculateComplexity(tryCatchCode)).toBe(3); // try + catch + base
    });
  });

  describe("extractDependencies", () => {
    test("should extract ES6 import statements", () => {
      const code = `
        import fs from 'fs';
        import { readFile } from 'fs/promises';
        import path from 'path';
      `;
      const dependencies = analyzer.extractDependencies(code);
      expect(dependencies).toHaveLength(3);
      expect(dependencies[0]).toEqual({ type: 'import', module: 'fs' });
      expect(dependencies[1]).toEqual({ type: 'import', module: 'fs/promises' });
      expect(dependencies[2]).toEqual({ type: 'import', module: 'path' });
    });

    test("should extract CommonJS require statements", () => {
      const code = `
        const fs = require('fs');
        const express = require('express');
      `;
      const dependencies = analyzer.extractDependencies(code);
      expect(dependencies).toHaveLength(2);
      expect(dependencies[0]).toEqual({ type: 'require', module: 'fs' });
      expect(dependencies[1]).toEqual({ type: 'require', module: 'express' });
    });

    test("should handle mixed import and require statements", () => {
      const code = `
        import fs from 'fs';
        const express = require('express');
      `;
      const dependencies = analyzer.extractDependencies(code);
      expect(dependencies).toHaveLength(2);
      expect(dependencies[0]).toEqual({ type: 'import', module: 'fs' });
      expect(dependencies[1]).toEqual({ type: 'require', module: 'express' });
    });

    test("should return empty array for code without dependencies", () => {
      const code = 'const x = 1; console.log(x);';
      const dependencies = analyzer.extractDependencies(code);
      expect(dependencies).toHaveLength(0);
    });
  });

  describe("generateSummary", () => {
    test("should generate correct summary for empty file list", () => {
      const summary = analyzer.generateSummary([]);
      expect(summary.totalFiles).toBe(0);
      expect(summary.totalLines).toBe(0);
      expect(summary.totalSize).toBe(0);
      expect(summary.averageComplexity).toBe(0);
    });

    test("should generate correct summary for file list", () => {
      const files = [
        { lines: 100, size: 1000, complexity: 5, extension: '.js', dependencies: [{ module: 'fs' }] },
        { lines: 50, size: 500, complexity: 3, extension: '.js', dependencies: [{ module: 'path' }] }
      ];
      
      const summary = analyzer.generateSummary(files);
      expect(summary.totalFiles).toBe(2);
      expect(summary.totalLines).toBe(150);
      expect(summary.totalSize).toBe(1500);
      expect(summary.averageComplexity).toBe(4);
      expect(summary.filesByType['.js']).toBe(2);
      expect(summary.uniqueDependencies).toBe(2);
    });

    test("should count file types correctly", () => {
      const files = [
        { extension: '.js', lines: 10, size: 100, complexity: 1, dependencies: [] },
        { extension: '.ts', lines: 20, size: 200, complexity: 2, dependencies: [] },
        { extension: '.js', lines: 15, size: 150, complexity: 1, dependencies: [] }
      ];
      
      const summary = analyzer.generateSummary(files);
      expect(summary.filesByType['.js']).toBe(2);
      expect(summary.filesByType['.ts']).toBe(1);
    });
  });

  describe("getTopDependencies", () => {
    test("should return top dependencies by usage count", () => {
      const dependencies = [
        { module: 'fs' },
        { module: 'path' },
        { module: 'fs' },
        { module: 'express' },
        { module: 'fs' }
      ];
      
      const topDeps = analyzer.getTopDependencies(dependencies);
      expect(topDeps[0]).toEqual({ module: 'fs', count: 3 });
      expect(topDeps[1].module).toBe('path');
      expect(topDeps[2].module).toBe('express');
    });

    test("should limit to top 5 dependencies", () => {
      const dependencies = Array.from({ length: 10 }, (_, i) => ({ module: `dep${i}` }));
      const topDeps = analyzer.getTopDependencies(dependencies);
      expect(topDeps).toHaveLength(5);
    });
  });

  describe("generateInsights", () => {
    test("should generate complexity warnings for high complexity", () => {
      const summary = { averageComplexity: 15, totalFiles: 10, uniqueDependencies: 5, filesByType: {} };
      const insights = analyzer.generateInsights([], summary);
      
      const complexityInsight = insights.find(i => i.category === 'complexity');
      expect(complexityInsight).toBeDefined();
      expect(complexityInsight.type).toBe('warning');
    });

    test("should generate dependency warnings for many dependencies", () => {
      const summary = { averageComplexity: 2, totalFiles: 10, uniqueDependencies: 25, filesByType: {} };
      const insights = analyzer.generateInsights([], summary);
      
      const depInsight = insights.find(i => i.category === 'dependencies');
      expect(depInsight).toBeDefined();
      expect(depInsight.type).toBe('warning');
    });

    test("should generate organization info for large codebases", () => {
      const summary = { averageComplexity: 2, totalFiles: 60, uniqueDependencies: 5, filesByType: {} };
      const insights = analyzer.generateInsights([], summary);
      
      const orgInsight = insights.find(i => i.category === 'organization');
      expect(orgInsight).toBeDefined();
      expect(orgInsight.type).toBe('info');
    });

    test("should detect mixed JS/TS usage", () => {
      const summary = { 
        averageComplexity: 2, 
        totalFiles: 10, 
        uniqueDependencies: 5,
        filesByType: { '.js': 5, '.ts': 3 }
      };
      const insights = analyzer.generateInsights([], summary);
      
      const techInsight = insights.find(i => i.category === 'technology');
      expect(techInsight).toBeDefined();
      expect(techInsight.message).toContain('Mixed JavaScript and TypeScript');
    });
  });
});

describe("formatResults", () => {
  test("should format error results", () => {
    const results = { error: "Test error message" };
    const formatted = formatResults(results);
    expect(formatted).toContain("❌ Test error message");
  });

  test("should format successful results", () => {
    const results = {
      summary: {
        totalFiles: 10,
        totalLines: 500,
        totalSize: 5000,
        averageComplexity: 3.5,
        uniqueDependencies: 8,
        filesByType: { '.js': 7, '.ts': 3 },
        topDependencies: [
          { module: 'fs', count: 5 },
          { module: 'path', count: 3 }
        ]
      },
      insights: [
        { type: 'info', category: 'complexity', message: 'Code complexity is reasonable' },
        { type: 'warning', category: 'dependencies', message: 'Consider reducing dependencies' }
      ]
    };

    const formatted = formatResults(results);
    expect(formatted).toContain('🔍 Code Analysis Results');
    expect(formatted).toContain('Files: 10');
    expect(formatted).toContain('Lines: 500');
    expect(formatted).toContain('4.9 KB');
    expect(formatted).toContain('Avg Complexity: 3.5');
    expect(formatted).toContain('Dependencies: 8');
    expect(formatted).toContain('.js: 7');
    expect(formatted).toContain('.ts: 3');
    expect(formatted).toContain('fs: 5 uses');
    expect(formatted).toContain('path: 3 uses');
    expect(formatted).toContain('ℹ️ Code complexity is reasonable');
    expect(formatted).toContain('⚠️ Consider reducing dependencies');
  });

  test("should handle results without optional sections", () => {
    const results = {
      summary: {
        totalFiles: 1,
        totalLines: 10,
        totalSize: 100,
        averageComplexity: 1,
        uniqueDependencies: 0,
        filesByType: {},
        topDependencies: []
      },
      insights: []
    };

    const formatted = formatResults(results);
    expect(formatted).toContain('Files: 1');
    expect(formatted).not.toContain('📁 File Types:');
    expect(formatted).not.toContain('📦 Top Dependencies:');
    expect(formatted).not.toContain('💡 Insights:');
  });
});

describe("main", () => {
  test("should run analysis and return results", async () => {
    // Mock console.log to capture output
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const results = await main([]);
    
    expect(results).toBeDefined();
    expect(results.summary).toBeDefined();
    expect(results.files).toBeDefined();
    expect(results.insights).toBeDefined();
    expect(results.timestamp).toBeDefined();
    
    expect(consoleSpy).toHaveBeenCalledWith('🚀 Analyzing codebase: .');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔍 Code Analysis Results'));
    
    consoleSpy.mockRestore();
  });

  test("should use provided target path", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    await main(['./src']);
    
    expect(consoleSpy).toHaveBeenCalledWith('🚀 Analyzing codebase: ./src');
    
    consoleSpy.mockRestore();
  });

  test("should handle analysis errors gracefully", async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Try to analyze a non-existent directory
    const results = await main(['/nonexistent/path']);
    
    // The analyzer should still return results, just with warnings about unreadable directories
    expect(results).toBeDefined();
    expect(results.summary).toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith('🚀 Analyzing codebase: /nonexistent/path');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('🔍 Code Analysis Results'));
    
    consoleSpy.mockRestore();
  });
});
