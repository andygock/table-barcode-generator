import test from "node:test";
import assert from "node:assert/strict";
import { getBarcodeContents, getRenderableRows } from "../src/barcodeRows.js";

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

