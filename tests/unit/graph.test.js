import { describe, test, expect, vi, afterEach } from "vitest";
import fs from "@src/lib/fsWrapper.js";
import { loadGraph, saveGraph, appendRecord } from "@src/lib/graph.js";

describe("Graph Storage Module", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("loadGraph returns empty array when file is missing", async () => {
    vi.spyOn(fs, "readFileSync").mockImplementation(() => {
      throw new Error("File not found");
    });
    const data = await loadGraph();
    expect(data).toEqual([]);
  });

  test("loadGraph returns empty array when JSON is invalid", async () => {
    vi.spyOn(fs, "readFileSync").mockReturnValue("invalid json");
    const data = await loadGraph();
    expect(data).toEqual([]);
  });

  test("loadGraph returns parsed array when JSON is valid", async () => {
    const arr = [{ foo: "bar" }];
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(arr));
    const data = await loadGraph();
    expect(data).toEqual(arr);
  });

  test("saveGraph writes JSON file with 2-space indentation", () => {
    const records = [{ id: "1", attributes: { foo: "bar" } }];
    const writeSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    saveGraph(records);
    expect(writeSpy).toHaveBeenCalledTimes(1);
    const [path, content, encoding] = writeSpy.mock.calls[0];
    expect(content).toBe(JSON.stringify(records, null, 2));
    expect(encoding).toBe("utf8");
  });

  test("appendRecord loads, appends, and saves new record", async () => {
    const existing = [{ id: "1", attributes: { foo: "bar" } }];
    vi.spyOn(fs, "readFileSync").mockReturnValue(JSON.stringify(existing));
    const saveSpy = vi.spyOn(fs, "writeFileSync").mockImplementation(() => {});
    const newRecord = { id: "2", attributes: { baz: "qux" } };
    await appendRecord(newRecord);
    const expected = [...existing, newRecord];
    expect(saveSpy).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(expected, null, 2),
      "utf8"
    );
  });
});
