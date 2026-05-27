# calamine.js Roadmap

## Goal

Build TypeScript bindings on top of [calamine](https://github.com/tafia/calamine):

- Node.js uses a native binding first.
- Web uses WebAssembly later.
- Keep one mostly aligned TypeScript API across both runtimes.

## Delivery strategy

Ship in small PRs. The first milestone is a usable Node.js package. Browser support comes after the native Node.js surface is stable.

## API design principles

- Favor a small, explicit API before adding convenience helpers.
- Keep the public API TypeScript-first, with strong static types for workbook, sheet, cell, and options.
- Use async APIs for file I/O, and allow sync or in-memory entry points only when they are clearly useful.
- Align Node.js and Web APIs as much as possible so application code can switch runtimes with minimal changes.
- Expose raw data first, then add higher-level extraction helpers as follow-up work.

## Planned Node.js API surface (phase 1)

### Entry points

- `openWorkbook(input, options?)`
  - Open from a file path, `Buffer`, or `Uint8Array`.
- `openWorkbookFromFile(path, options?)`
  - Explicit file-based entry point for Node.js.
- `openWorkbookFromBuffer(data, options?)`
  - Explicit in-memory entry point.

### Workbook API

- `workbook.sheetNames(): string[]`
- `workbook.getSheet(nameOrIndex): Worksheet | undefined`
- `workbook.getMetadata(): WorkbookMetadata`
- `workbook.close(): void`

### Worksheet API

- `worksheet.name: string`
- `worksheet.dimensions(): SheetRange | null`
- `worksheet.rowCount(): number`
- `worksheet.columnCount(): number`
- `worksheet.cell(address): CellValue | undefined`
- `worksheet.row(index): CellValue[]`
- `worksheet.rows(options?): Iterable<CellValue[]>`
- `worksheet.toJSON(options?): Record<string, CellValue>[]`

### Types to expose

- `Workbook`
- `Worksheet`
- `WorkbookMetadata`
- `SheetRange`
- `CellValue`
- `CellType`
- `OpenOptions`
- `ToJSONOptions`

## Planned Node.js feature scope

### Must-have for the first native release

- Read `.xlsx`, `.xls`, `.xlsb`, and `.ods` through calamine.
- Read workbook metadata and list sheets.
- Read cells with preserved value types:
  - string
  - number
  - boolean
  - date/datetime
  - error
  - empty/null-like value
- Access sheets by name and index.
- Iterate rows without forcing JSON conversion.
- Convert the first row or a selected row into object keys for JSON-like extraction.
- Support UTF-8 and common Excel edge cases handled by calamine.
- Ship `.d.ts` types and basic usage docs.

### Nice-to-have after the first native release

- Header selection and duplicate-header handling strategies.
- Range-based reads.
- Formula exposure when available.
- Hidden sheet metadata.
- Date parsing configuration.
- Streaming-oriented iteration for large files if the native layer can support it cleanly.
- Better error classification for unsupported files and malformed workbooks.

### Explicitly out of scope for the first native release

- Writing or modifying workbook files.
- Styling, formatting, merged-cell reconstruction, or formula evaluation beyond raw exposed values.
- Browser support.

## Planned WebAssembly scope (phase 2)

Once the Node.js native API is stable, add a browser/WebAssembly package with the same core concepts:

- `openWorkbookFromArrayBuffer(data, options?)`
- Matching `Workbook`, `Worksheet`, and `CellValue` types where possible
- Browser-focused binary input support
- Documentation for runtime differences and limitations

The browser target should reuse the Node.js API model rather than inventing a second public interface.

## Sequential PR plan

### PR 1: project roadmap and package direction

- Record the product scope, API plan, and staged milestones in the repository.
- Clarify that Node.js native support is the first delivery target.

### PR 2: native package bootstrap

- Add the package layout for the Node.js binding.
- Add Rust crate scaffolding for the native module.
- Add TypeScript package metadata, build scripts, and test skeletons.
- Define the exported TypeScript types without full functionality yet.

### PR 3: workbook opening and metadata

- Implement opening workbooks from file path and in-memory binary input.
- Expose workbook lifetime management, metadata, and sheet listing.
- Add fixtures and tests for supported workbook formats.

### PR 4: worksheet access and typed cell reads

- Implement sheet lookup by name and index.
- Expose dimensions, row and column counts, single-cell reads, and row reads.
- Finalize the `CellValue` mapping from calamine values to TypeScript-visible values.

### PR 5: row iteration and JSON extraction

- Add row iteration APIs.
- Add `toJSON` with configurable header-row behavior.
- Document the behavior for empty cells, duplicate headers, and mixed cell types.

### PR 6: polish for the first Node.js release

- Improve errors and edge-case handling.
- Expand tests and examples.
- Prepare packaging and release documentation for the native Node.js package.

### PR 7: WebAssembly/browser support

- Add the browser build target.
- Expose the aligned browser entry points.
- Document runtime differences and cross-platform usage guidance.

## Success criteria for the first usable release

- A Node.js user can install the package and open a workbook from disk or memory.
- They can inspect sheet names and workbook metadata.
- They can read cells, rows, and JSON-like objects with typed values.
- The public TypeScript surface is stable enough to mirror in the future WebAssembly package.
