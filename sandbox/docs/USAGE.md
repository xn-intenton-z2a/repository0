# CLI Usage

This document describes the command-line interface for the repository.

## Available Commands

### add

Sum numeric arguments.

```
node sandbox/source/main.js add 2 3 4
```

Output:

```
9
```

### multiply

Multiply numeric arguments.

```
node sandbox/source/main.js multiply 2 3 4
```

Output:

```
24
```

## Default Behavior

If no command is provided or the command is unrecognized, the CLI will echo the arguments:

```
node sandbox/source/main.js any other args...
```

Example:

```
node sandbox/source/main.js foo 1 2
```

Output:

```
Unknown command: foo
Run with: ["foo","1","2"]
```