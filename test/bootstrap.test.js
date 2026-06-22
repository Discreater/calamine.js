const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");

const {
  CalamineError,
  openWorkbook,
  openWorkbookFromBuffer,
  openWorkbookFromFile,
} = require("../dist/index.js");

const fixturePath = path.join(__dirname, "..", "fixtures", "workbook.xlsx");

function assertWorkbookSummary(workbook) {
  assert.deepEqual(workbook.sheetNames(), ["Overview", "Data"]);
  assert.deepEqual(workbook.getMetadata(), {
    format: "xlsx",
    sheetCount: 2,
  });
}

test("exports the planned entry points", () => {
  assert.equal(typeof openWorkbook, "function");
  assert.equal(typeof openWorkbookFromFile, "function");
  assert.equal(typeof openWorkbookFromBuffer, "function");
});

test("openWorkbookFromFile opens workbook metadata and sheet names", async () => {
  const workbook = await openWorkbookFromFile(fixturePath);
  assertWorkbookSummary(workbook);
});

test("openWorkbookFromBuffer opens workbook metadata and sheet names", async () => {
  const workbook = await openWorkbookFromBuffer(fs.readFileSync(fixturePath));
  assertWorkbookSummary(workbook);
});

test("openWorkbook dispatches Buffer input to the buffer entry point", async () => {
  const workbook = await openWorkbook(fs.readFileSync(fixturePath));
  assertWorkbookSummary(workbook);
});

test("closed workbooks reject further metadata access", async () => {
  const workbook = await openWorkbookFromFile(fixturePath);
  workbook.close();

  assert.throws(() => workbook.sheetNames(), CalamineError);
  assert.throws(() => workbook.getMetadata(), CalamineError);
});
