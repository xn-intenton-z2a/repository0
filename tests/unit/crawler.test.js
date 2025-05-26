import { describe, test, expect, vi, afterEach } from "vitest";
import { fetchData, normalizeRecord } from "@src/lib/crawler.js";

describe("Crawler Module", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("fetchData returns JSON when response is ok", async () => {
    const mockJson = { foo: "bar" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockJson,
    }));
    const data = await fetchData("https://example.com/data");
    expect(data).toEqual(mockJson);
    expect(fetch).toHaveBeenCalledWith("https://example.com/data");
  });

  test("fetchData throws an error when response is not ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));
    await expect(fetchData("https://example.com/missing")).rejects.toThrow(
      "Failed to fetch data from https://example.com/missing: 404"
    );
  });

  test("normalizeRecord transforms record into {id, attributes}", () => {
    const raw = { id: 123, name: "Alice", extra: "value" };
    const normalized = normalizeRecord(raw);
    expect(normalized).toEqual({
      id: "123",
      attributes: { name: "Alice", extra: "value" },
    });
  });
});
