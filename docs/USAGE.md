# Usage

This document describes how to use the CLI flags supported by the main script.

## Command Syntax

```
Usage: node src/lib/main.js [--help] [--version] [--ingest <url>]
```

## Options

--help           Show this help message and exit

--version        Print version number and exit

--ingest <url>   Fetch and ingest a record and persist to graph.json via graph storage module

## Examples

Show help message:
```
$ npm run start -- --help
Usage: node src/lib/main.js [--help] [--version] [--ingest <url>]
--help           Show this help message and exit
--version        Print version number and exit
--ingest <url>   Fetch and ingest a record and persist to graph.json via graph storage module
```

Print version number:
```
$ npm run start -- --version
1.2.0-0
```

Ingest a record:
```
$ npm run start -- --ingest https://example.com/data
Ingested record with id: 1
```