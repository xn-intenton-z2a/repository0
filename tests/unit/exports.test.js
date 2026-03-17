// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { test, expect } from "vitest";
import * as lib from "../../src/lib/main.js";

test("module exports expected symbols", () => {
  expect(lib.name).toBeTruthy();
  expect(lib.version).toBeTruthy();
  expect(typeof lib.fizzBuzz).toBe("function");
  expect(typeof lib.fizzBuzzSingle).toBe("function");
  expect(typeof lib.getIdentity).toBe("function");
  expect(typeof lib.main).toBe("function");
});
