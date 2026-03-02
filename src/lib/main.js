#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/main.js

import { fileURLToPath } from "url";
import { readdir, readFile, stat } from "fs/promises";
import { join, extname, relative } from "path";

/**
 * Analyzes a directory for JavaScript/Node.js project structure and complexity
 */
export class CodeAnalyzer {
  constructor(options = {}) {
    this.options = {
      maxDepth: 3,
      includePatterns: ['.js', '.mjs', '.ts', '.json'],
      excludePatterns: ['node_modules', '.git', 'dist', 'build'],
      ...options
    };
  }

  async analyze(targetPath = '.') {
    const results = {
      summary: {},
      files: [],
      insights: [],
      timestamp: new Date().toISOString()
    };

    try {
      const files = await this.scanDirectory(targetPath, 0);
      results.files = files;
      results.summary = this.generateSummary(files);
      results.insights = this.generateInsights(files, results.summary);
      
      return results;
    } catch (error) {
      return {
        error: `Analysis failed: ${error.message}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  async scanDirectory(dirPath, depth) {
    if (depth > this.options.maxDepth) return [];
    
    const files = [];
    
    try {
      const entries = await readdir(dirPath);
      
      for (const entry of entries) {
        if (this.options.excludePatterns.some(pattern => entry.includes(pattern))) {
          continue;
        }

        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, depth + 1);
          files.push(...subFiles);
        } else if (this.isIncludedFile(entry)) {
          const fileInfo = await this.analyzeFile(fullPath, stats);
          files.push(fileInfo);
        }
      }
    } catch (error) {
      console.warn(`Could not scan ${dirPath}: ${error.message}`);
    }
    
    return files;
  }

  isIncludedFile(fileName) {
    const ext = extname(fileName).toLowerCase();
    return this.options.includePatterns.includes(ext);
  }

  async analyzeFile(filePath, stats) {
    const relativePath = relative('.', filePath);
    const fileInfo = {
      path: relativePath,
      size: stats.size,
      extension: extname(filePath),
      lines: 0,
      complexity: 0,
      dependencies: []
    };

    try {
      const content = await readFile(filePath, 'utf-8');
      fileInfo.lines = content.split('\n').length;
      fileInfo.complexity = this.calculateComplexity(content);
      fileInfo.dependencies = this.extractDependencies(content);
    } catch (error) {
      fileInfo.error = `Could not read file: ${error.message}`;
    }

    return fileInfo;
  }

  calculateComplexity(content) {
    // Simple complexity metric based on control structures
    const patterns = [
      /\bif\s*\(/g,
      /\belse\b/g,
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bswitch\s*\(/g,
      /\bcatch\s*\(/g,
      /\btry\s*\{/g,
      /\?\s*.*:/g // ternary operators
    ];

    return patterns.reduce((complexity, pattern) => {
      const matches = content.match(pattern);
      return complexity + (matches ? matches.length : 0);
    }, 1); // Base complexity of 1
  }

  extractDependencies(content) {
    const dependencies = [];
    
    // Extract import statements
    const importMatches = content.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const moduleMatch = match.match(/from\s+['"]([^'"]+)['"]/);
        if (moduleMatch) {
          dependencies.push({
            type: 'import',
            module: moduleMatch[1]
          });
        }
      });
    }

    // Extract require statements
    const requireMatches = content.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
    if (requireMatches) {
      requireMatches.forEach(match => {
        const moduleMatch = match.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/);
        if (moduleMatch) {
          dependencies.push({
            type: 'require',
            module: moduleMatch[1]
          });
        }
      });
    }

    return dependencies;
  }

  generateSummary(files) {
    const totalFiles = files.length;
    const totalLines = files.reduce((sum, file) => sum + (file.lines || 0), 0);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const avgComplexity = totalFiles > 0 
      ? files.reduce((sum, file) => sum + (file.complexity || 0), 0) / totalFiles
      : 0;

    const filesByType = files.reduce((types, file) => {
      const ext = file.extension || 'unknown';
      types[ext] = (types[ext] || 0) + 1;
      return types;
    }, {});

    const allDependencies = files.flatMap(file => file.dependencies || []);
    const uniqueModules = [...new Set(allDependencies.map(dep => dep.module))];

    return {
      totalFiles,
      totalLines,
      totalSize,
      averageComplexity: Math.round(avgComplexity * 100) / 100,
      filesByType,
      uniqueDependencies: uniqueModules.length,
      topDependencies: this.getTopDependencies(allDependencies)
    };
  }

  getTopDependencies(dependencies) {
    const counts = dependencies.reduce((acc, dep) => {
      acc[dep.module] = (acc[dep.module] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([module, count]) => ({ module, count }));
  }

  generateInsights(files, summary) {
    const insights = [];

    // Ensure filesByType exists
    const filesByType = summary.filesByType || {};

    // Complexity insights
    if (summary.averageComplexity > 10) {
      insights.push({
        type: 'warning',
        category: 'complexity',
        message: `High average complexity detected (${summary.averageComplexity}). Consider refactoring complex functions.`
      });
    } else if (summary.averageComplexity > 5) {
      insights.push({
        type: 'info',
        category: 'complexity',
        message: `Moderate complexity detected (${summary.averageComplexity}). Monitor for complexity growth.`
      });
    }

    // File organization insights
    if (summary.totalFiles > 50) {
      insights.push({
        type: 'info',
        category: 'organization',
        message: `Large codebase with ${summary.totalFiles} files. Consider organizing into clear modules.`
      });
    }

    // Dependency insights
    if (summary.uniqueDependencies > 20) {
      insights.push({
        type: 'warning',
        category: 'dependencies',
        message: `High dependency count (${summary.uniqueDependencies}). Review if all dependencies are necessary.`
      });
    }

    // File type insights
    const jsFiles = (filesByType['.js'] || 0) + (filesByType['.mjs'] || 0);
    const tsFiles = filesByType['.ts'] || 0;
    
    if (jsFiles > 0 && tsFiles > 0) {
      insights.push({
        type: 'info',
        category: 'technology',
        message: 'Mixed JavaScript and TypeScript files detected. Consider consistent typing strategy.'
      });
    }

    return insights;
  }
}

export function formatResults(results) {
  if (results.error) {
    return `❌ ${results.error}`;
  }

  const { summary, insights } = results;
  
  let output = `🔍 Code Analysis Results\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `📊 Summary:\n`;
  output += `  • Files: ${summary.totalFiles}\n`;
  output += `  • Lines: ${summary.totalLines.toLocaleString()}\n`;
  output += `  • Size: ${(summary.totalSize / 1024).toFixed(1)} KB\n`;
  output += `  • Avg Complexity: ${summary.averageComplexity}\n`;
  output += `  • Dependencies: ${summary.uniqueDependencies}\n\n`;

  if (Object.keys(summary.filesByType).length > 0) {
    output += `📁 File Types:\n`;
    Object.entries(summary.filesByType).forEach(([type, count]) => {
      output += `  • ${type}: ${count}\n`;
    });
    output += `\n`;
  }

  if (summary.topDependencies.length > 0) {
    output += `📦 Top Dependencies:\n`;
    summary.topDependencies.forEach(dep => {
      output += `  • ${dep.module}: ${dep.count} uses\n`;
    });
    output += `\n`;
  }

  if (insights.length > 0) {
    output += `💡 Insights:\n`;
    insights.forEach(insight => {
      const icon = insight.type === 'warning' ? '⚠️' : 'ℹ️';
      output += `  ${icon} ${insight.message}\n`;
    });
  }

  return output;
}

export async function main(args = []) {
  const targetPath = args[0] || '.';
  
  console.log(`🚀 Analyzing codebase: ${targetPath}`);
  
  const analyzer = new CodeAnalyzer();
  const results = await analyzer.analyze(targetPath);
  
  console.log(formatResults(results));
  
  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  await main(args);
}
