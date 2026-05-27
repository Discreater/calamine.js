import { CalamineNotImplementedError } from "./errors.js";

import type { OpenOptions, Workbook } from "./types.js";

const NOT_IMPLEMENTED_MESSAGE =
  "calamine.js native workbook opening is not implemented yet; bootstrap scaffolding landed in PR 2 and parsing work starts next.";

export { CalamineError, CalamineNotImplementedError } from "./errors.js";
export type {
  BooleanCellValue,
  CellType,
  CellValue,
  DateCellValue,
  EmptyCellValue,
  ErrorCellValue,
  NumberCellValue,
  OpenOptions,
  SheetRange,
  StringCellValue,
  ToJSONOptions,
  Workbook,
  WorkbookMetadata,
  Worksheet,
} from "./types.js";

export async function openWorkbook(
  input: string | Buffer | Uint8Array,
  options?: OpenOptions,
): Promise<Workbook> {
  if (typeof input === "string") {
    return openWorkbookFromFile(input, options);
  }

  if (input instanceof Uint8Array) {
    return openWorkbookFromBuffer(input, options);
  }

  throw new TypeError("openWorkbook expects a file path, Buffer, or Uint8Array.");
}

export async function openWorkbookFromFile(
  path: string,
  _options?: OpenOptions,
): Promise<Workbook> {
  if (path.length === 0) {
    throw new TypeError("openWorkbookFromFile expects a non-empty file path.");
  }

  throw new CalamineNotImplementedError(NOT_IMPLEMENTED_MESSAGE);
}

export async function openWorkbookFromBuffer(
  data: Buffer | Uint8Array,
  _options?: OpenOptions,
): Promise<Workbook> {
  if (data.byteLength === 0) {
    throw new TypeError("openWorkbookFromBuffer expects a non-empty Buffer or Uint8Array.");
  }

  throw new CalamineNotImplementedError(NOT_IMPLEMENTED_MESSAGE);
}
