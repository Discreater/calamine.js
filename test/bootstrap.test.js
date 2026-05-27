const test = require("node:test");
const assert = require("node:assert/strict");

const {
  CalamineNotImplementedError,
  openWorkbook,
  openWorkbookFromBuffer,
  openWorkbookFromFile,
} = require("../dist/index.js");

test("exports the planned entry points", () => {
  assert.equal(typeof openWorkbook, "function");
  assert.equal(typeof openWorkbookFromFile, "function");
  assert.equal(typeof openWorkbookFromBuffer, "function");
});

test("openWorkbookFromFile uses a placeholder implementation", async () => {
  await assert.rejects(
    () => openWorkbookFromFile("/tmp/workspace/Discreater/calamine.js/fixtures/example.xlsx"),
    CalamineNotImplementedError,
  );
});

test("openWorkbookFromBuffer validates the input", async () => {
  await assert.rejects(
    () => openWorkbookFromBuffer(Buffer.alloc(0)),
    /non-empty Buffer or Uint8Array/,
  );
});

test("openWorkbook dispatches Buffer input to the buffer entry point", async () => {
  await assert.rejects(() => openWorkbook(Buffer.from([0x50, 0x4b])), CalamineNotImplementedError);
});
