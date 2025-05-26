/**
 * Fetch JSON data from a given source URL.
 * @param {string} source - The URL to fetch data from.
 * @returns {Promise<any>} The JSON-parsed response body.
 * @throws {Error} When the response status is not 2xx.
 */
export async function fetchData(source) {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${source}: ${response.status}`);
  }
  return response.json();
}

/**
 * Normalize a raw record into an object with id and attributes.
 * @param {any} record - The raw record object.
 * @returns {{ id: string; attributes: any }} The normalized record.
 */
export function normalizeRecord(record) {
  const { id, ...attributes } = record;
  return {
    id: String(id),
    attributes,
  };
}
