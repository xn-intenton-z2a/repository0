import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "./fsWrapper.js";

/**
 * Load the graph JSON file and return an array of records.
 * @param {string} [filePath] - Optional path to graph.json.
 * @returns {Promise<any[]>} The array of records.
 */
export async function loadGraph(filePath) {
  const defaultPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "graph.json");
  const path = filePath || defaultPath;
  try {
    const content = fs.readFileSync(path, "utf8");
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return data;
    }
  } catch {
    // ignore errors
  }
  return [];
}

/**
 * Save an array of records to the graph JSON file.
 * @param {any[]} records - The array of records to save.
 * @param {string} [filePath] - Optional path to graph.json.
 */
export function saveGraph(records, filePath) {
  const defaultPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "graph.json");
  const path = filePath || defaultPath;
  fs.writeFileSync(path, JSON.stringify(records, null, 2), "utf8");
}

/**
 * Append a record to the graph, loading existing records and saving the updated array.
 * @param {any} record - The record to append.
 * @param {string} [filePath] - Optional path to graph.json.
 */
export async function appendRecord(record, filePath) {
  const records = await loadGraph(filePath);
  records.push(record);
  saveGraph(records, filePath);
}