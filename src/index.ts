import path from "node:path";

import { CalamineError } from "./errors.js";

import type { OpenOptions, Workbook, WorkbookMetadata, Worksheet } from "./types.js";

interface NativeWorkbookSummary {
  format: string;
  sheetNames: string[];
}

interface NativeBinding {
  openWorkbookFromFile(path: string): NativeWorkbookSummary;
  openWorkbookFromBuffer(data: Buffer): NativeWorkbookSummary;
}

class NativeWorkbook implements Workbook {
  private readonly metadata: WorkbookMetadata;
  private readonly names: readonly string[];
  private closed = false;

  public constructor(summary: NativeWorkbookSummary) {
    this.names = Object.freeze([...summary.sheetNames]);
    this.metadata = {
      format: summary.format,
      sheetCount: this.names.length,
    };
  }

  public sheetNames(): string[] {
    this.ensureOpen();
    return [...this.names];
  }

  public getSheet(_nameOrIndex: string | number): Worksheet | undefined {
    this.ensureOpen();
    return undefined;
  }

  public getMetadata(): WorkbookMetadata {
    this.ensureOpen();
    return { ...this.metadata };
  }

  public close(): void {
    this.closed = true;
  }

  private ensureOpen(): void {
    if (this.closed) {
      throw new CalamineError("Workbook is already closed.");
    }
  }
}

let binding: NativeBinding | undefined;

function nativeBinding(): NativeBinding {
  if (binding !== undefined) {
    return binding;
  }

  try {
    binding = require(path.join(__dirname, "calamine_js_native.node")) as NativeBinding;
    return binding;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new CalamineError(`Failed to load native binding: ${message}`);
  }
}

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

export async function openWorkbookFromFile(path: string, _options?: OpenOptions): Promise<Workbook> {
  if (path.length === 0) {
    throw new TypeError("openWorkbookFromFile expects a non-empty file path.");
  }

  const summary = nativeBinding().openWorkbookFromFile(path);
  return new NativeWorkbook(summary);
}

export async function openWorkbookFromBuffer(
  data: Buffer | Uint8Array,
  _options?: OpenOptions,
): Promise<Workbook> {
  if (data.byteLength === 0) {
    throw new TypeError("openWorkbookFromBuffer expects a non-empty Buffer or Uint8Array.");
  }

  const summary = nativeBinding().openWorkbookFromBuffer(Buffer.from(data));
  return new NativeWorkbook(summary);
}
