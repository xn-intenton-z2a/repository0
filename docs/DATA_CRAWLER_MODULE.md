# Data Crawler Module

This module provides functions to fetch and normalize records from public data sources.

## API

### fetchData(source: string): Promise<any>

Fetch JSON data from the specified URL. Throws an error if the response status is not in the 200-299 range.

### normalizeRecord(record: any): { id: string; attributes: any }

Normalize a raw record into a standardized format with an `id` string and `attributes` object.

## Usage

```js
import { fetchData, normalizeRecord } from 'src/lib/crawler.js';

async function run() {
  const raw = await fetchData('https://jsonplaceholder.typicode.com/posts/1');
  const node = normalizeRecord(raw);
  console.log(node);
}

run();
```

## Error Handling

If `fetchData` encounters a non-2xx response, it throws an error including the status code and URL.
