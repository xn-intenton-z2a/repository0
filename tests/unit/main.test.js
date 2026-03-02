// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test, expect, vi } from "vitest";
import { main } from "../../src/lib/main.js";

describe("Main CLI Interface", () => {
  test("should process empty arguments without errors", () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {});
    
    // Test with empty args - this should show help without throwing
    main([]);
    
    // Should have called process.exit(0) for help
    expect(exitSpy).toHaveBeenCalledWith(0);
    
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
  });

  test("should show examples", () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    main(['examples']);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Example commands'));
    
    consoleSpy.mockRestore();
  });

  test("should handle dry-run mode", () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    main(['-e', 'y=sin(x)', '--dry-run']);
    
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Dry run mode'));
    
    consoleSpy.mockRestore();
  });
});