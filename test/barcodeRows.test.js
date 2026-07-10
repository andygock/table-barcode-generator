import test from "node:test";
import assert from "node:assert/strict";
import {
  getBarcodeContents,
  getInvalidBarcodeRows,
  getRenderableRows,
} from "../src/barcodeRows.js";

test("skips the header row when building barcode content", () => {
  const records = [
    ["Name", "Code"],
    ["Alice", "A-001"],
    ["Bob", "B-002"],
  ];

  assert.deepEqual(getRenderableRows(records, true), [
    ["Alice", "A-001"],
    ["Bob", "B-002"],
  ]);
  assert.deepEqual(getBarcodeContents(records, true), ["A-001", "B-002"]);
});

test("trims barcode content from the last column", () => {
  const records = [
    ["Alice", " A-001 "],
    ["Bob", "\tB-002\t"],
  ];

  assert.deepEqual(getBarcodeContents(records), ["A-001", "B-002"]);
});

test("reports empty barcode rows after trimming", () => {
  const records = [
    ["Name", "Code"],
    ["Alice", "   "],
    ["Bob", "B-002"],
    ["Carol", ""],
  ];

  assert.deepEqual(getInvalidBarcodeRows(records, true), [2, 4]);
});
