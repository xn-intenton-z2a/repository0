import { describe, test, expect } from "vitest";
import * as mainModule from "@src/lib/main.js";

describe("Main Module Import", () => {
  test("should be non-null", () => {
    expect(mainModule).not.toBeNull();
  });

  test("should export CLI functions", () => {
    expect(typeof mainModule.plotToSvg).toBe("function");
    expect(typeof mainModule.plotToJson).toBe("function");
    expect(typeof mainModule.plotToHtml).toBe("function");
  });
});
