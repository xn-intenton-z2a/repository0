# Usage

This document describes how to use the CLI flags supported by the main script.

## Command Syntax

```
Usage: node src/lib/main.js [--help] [--version] [--mission] [--ingest <url>] [--ingest-all <url>]
```

## Options

--help           Show this help message and exit

--version        Print version number and exit

--mission        Print repository mission statement and exit

--ingest <url>   Fetch and ingest a record and persist to graph.json

--ingest-all <url>  Fetch an array of records from URL, normalize each, and append all to graph.json

## Examples

Show help message:
```
$ npm run start -- --help
Usage: node src/lib/main.js [--help] [--version] [--mission] [--ingest <url>] [--ingest-all <url>]
--help           Show this help message and exit
--version        Print version number and exit
--mission        Print repository mission statement and exit
--ingest <url>   Fetch and ingest a record and persist to graph.json
--ingest-all <url>  Fetch an array of records from URL, normalize each, and append all to graph.json
```

Print version number:
```
$ npm run start -- --version
1.2.0-0
```

Print mission statement:
```
$ npm run start -- --mission
Build a knowledge graph of the physical world by crawling public data sources.
```

Ingest a record:
```
$ npm run start -- --ingest https://example.com/data
Ingested record with id: 1
```

Batch ingest records:
```
$ npm run start -- --ingest-all https://jsonplaceholder.typicode.com/posts
# Output: Ingested 100 records from https://jsonplaceholder.typicode.com/posts
```
