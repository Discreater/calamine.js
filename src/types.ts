export type CellType = "empty" | "string" | "number" | "boolean" | "date" | "error";

export interface EmptyCellValue {
  type: "empty";
  value: null;
}

export interface StringCellValue {
  type: "string";
  value: string;
}

export interface NumberCellValue {
  type: "number";
  value: number;
}

export interface BooleanCellValue {
  type: "boolean";
  value: boolean;
}

export interface DateCellValue {
  type: "date";
  value: Date;
}

export interface ErrorCellValue {
  type: "error";
  value: string;
}

export type CellValue =
  | EmptyCellValue
  | StringCellValue
  | NumberCellValue
  | BooleanCellValue
  | DateCellValue
  | ErrorCellValue;

export interface SheetRange {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

export interface WorkbookMetadata {
  format?: string;
  sheetCount: number;
}

export interface OpenOptions {
  password?: string;
}

export interface ToJSONOptions {
  headerRow?: number;
  skipEmptyRows?: boolean;
}

export interface Worksheet {
  readonly name: string;
  dimensions(): SheetRange | null;
  rowCount(): number;
  columnCount(): number;
  cell(address: string): CellValue | undefined;
  row(index: number): CellValue[];
  rows(options?: { startRow?: number; endRow?: number }): Iterable<CellValue[]>;
  toJSON(options?: ToJSONOptions): Record<string, CellValue>[];
}

export interface Workbook {
  sheetNames(): string[];
  getSheet(nameOrIndex: string | number): Worksheet | undefined;
  getMetadata(): WorkbookMetadata;
  close(): void;
}
