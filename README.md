# calamine.js
JS binding of calamine

See [/docs/roadmap.md](/docs/roadmap.md) for the implementation plan.

## Status

This repository now includes the bootstrap for the native Node.js package:

- pnpm package metadata and TypeScript build output
- a Rust crate for the future native binding
- native workbook opening from file path and in-memory buffers
- workbook metadata and sheet-name listing through the TypeScript Workbook API
- Rust calamine-backed native exports wired into the built package

## Development

```bash
pnpm install
pnpm run build
pnpm test
```
