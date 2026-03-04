// SPDX-License-Identifier: MIT
// Copyright (C) 2025-2026 Polycode Limited
import { describe, test } from "vitest";
import { main } from "../../src/lib/main.js";

describe("Main Output", () => {
  test("should run with valid args", async () => {
    // call main with args so it doesn't error
    await main(["--expression", "sin(x)", "--range", "x=0:3.14159:10"]);
  });
});
