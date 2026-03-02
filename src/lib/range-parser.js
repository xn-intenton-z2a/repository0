// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
// src/lib/range-parser.js

import { create, all } from "mathjs";

const math = create(all);

/**
 * Parse range specifications like:
 * - "x=-2π:2π,y=-1:1"
 * - "t=0:2π"
 * - "x=-5:5" (assumes y auto-range)
 */
export function parseRange(rangeString) {
  if (!rangeString || typeof rangeString !== 'string') {
    throw new Error('Range must be a non-empty string');
  }

  const ranges = {};
  const parts = rangeString.split(',').map(part => part.trim());

  for (const part of parts) {
    if (!part.includes('=')) {
      throw new Error(`Invalid range format: ${part}. Expected format: variable=min:max`);
    }

    const [variable, range] = part.split('=').map(s => s.trim());
    
    if (!range.includes(':')) {
      throw new Error(`Invalid range format for ${variable}: ${range}. Expected format: min:max`);
    }

    const [minStr, maxStr] = range.split(':').map(s => s.trim());

    try {
      // Evaluate mathematical expressions in ranges (like π, 2π, etc.)
      let min, max;
      
      if (minStr.includes('π') || minStr.includes('pi') || minStr.includes('*')) {
        // Replace π with pi for mathjs evaluation
        const processedMinStr = minStr.replace(/π/g, 'pi');
        min = math.evaluate(processedMinStr);
      } else {
        min = parseFloat(minStr);
      }
      
      if (maxStr.includes('π') || maxStr.includes('pi') || maxStr.includes('*')) {
        // Replace π with pi for mathjs evaluation
        const processedMaxStr = maxStr.replace(/π/g, 'pi');
        max = math.evaluate(processedMaxStr);
      } else {
        max = parseFloat(maxStr);
      }

      if (isNaN(min) || isNaN(max)) {
        throw new Error(`Invalid numeric values in range for ${variable}: ${minStr}:${maxStr}`);
      }

      if (min >= max) {
        throw new Error(`Invalid range for ${variable}: min (${min}) must be less than max (${max})`);
      }

      ranges[variable] = { min, max };
    } catch (error) {
      throw new Error(`Error parsing range for ${variable}: ${error.message}`);
    }
  }

  // Ensure we have at least x and y ranges for cartesian plots
  if (!ranges.x && !ranges.t && !ranges.theta && !ranges.θ && !ranges.r) {
    ranges.x = { min: -10, max: 10 };
  }
  
  if (!ranges.y && !ranges.r) {
    ranges.y = { min: -10, max: 10 };
  }

  return ranges;
}