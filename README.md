# calamine.js
JS binding of calamine

See [/docs/roadmap.md](/docs/roadmap.md) for the implementation plan.

## Status

This repository now includes the bootstrap for the native Node.js package:

- npm package metadata and TypeScript build output
- a Rust crate for the future native binding
- placeholder TypeScript exports for the planned public API
- placeholder native Rust exports for the upcoming calamine integration

Workbook parsing is not implemented yet. That work starts in the next milestone.

## Development

```bash
npm install
npm run build
npm test
```
