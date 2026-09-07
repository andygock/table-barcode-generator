import test from "node:test";
import assert from "node:assert/strict";
import { parseInput } from "../src/parseInput.js";
import { limits, sanitizeIntegerInput } from "../src/inputUtils.js";

test("rejects malformed quotes and inconsistent column counts", () => {
  assert.match(
    parseInput('Name,Code\nAlice,"A-001', ",", true).errors.join(" "),
    /Line 2.*unterminated/,
  );
  for (const data of ["Alice", "Alice,A-001,extra"]) {
    assert.match(
      parseInput(`Name,Code\n${data}`, ",", true).errors.join(" "),
      /Line 2: expected 2 columns/,
    );
  }
  assert.match(
    parseInput("Alice,A-001\nBob", ",").errors[0],
    /expected 2 columns/,
  );
});

test("keeps header separate and trims only the data payload", () => {
  const result = parseInput(
    " Name , Code \n Alice , A-001 \n Bob , B-002 ",
    ",",
    true,
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(
    result.rows.map((row) => row.cells),
    [
      [" Name ", " Code "],
      [" Alice ", "A-001"],
      [" Bob ", "B-002"],
    ],
  );
});

test("reports physical source lines after comments, blank lines and quoted newlines", () => {
  for (const newline of ["\n", "\r\n", "\r"]) {
    const input = [
      "#comment",
      "Name,Code",
      "",
      '"Alice',
      'Smith",A-001',
      "#another",
      "Bob, ",
    ].join(newline);
    const result = parseInput(input, ",", true);
    assert.deepEqual(
      result.rows.map((row) => row.line),
      [2, 4, 7],
    );
    assert.deepEqual(result.errors, ["Line 7: no barcode value."]);
  }
});

test("handles BOM, quoted comments, escaped quotes and TSV", () => {
  const result = parseInput(
    '\uFEFF#comment\n"Name"\t"Code"\n"#Alice"\t"A""001"',
    "\t",
    true,
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.rows[1], { line: 3, cells: ["#Alice", 'A"001'] });
  assert.deepEqual(parseInput("", "\t").rows, []);
  assert.deepEqual(parseInput("#comment\n\n", ",").rows, []);
  assert.deepEqual(parseInput('""\n#comment\nAlice,', ",").errors, [
    "Line 3: no barcode value.",
  ]);
});

test("bounds input, rows and columns without silently truncating output", () => {
  assert.match(
    parseInput("x".repeat(limits.inputCharacters + 1), ",").errors[0],
    /Input exceeds/,
  );
  const rows = Array.from({ length: limits.rows }, (_, i) => `${i},code`).join(
    "\n",
  );
  assert.equal(parseInput(rows, ",").errors.length, 0);
  assert.equal(parseInput("Name,Code\n" + rows, ",", true).errors.length, 0);
  assert.match(
    parseInput(rows + "\nextra,code", ",").errors[0],
    /maximum 500 data rows/,
  );
  assert.match(
    parseInput(
      Array(limits.columns + 1)
        .fill("x")
        .join(","),
      ",",
    ).errors[0],
    /maximum 50 columns/,
  );
});

test("bounds payloads by UTF-8 bytes and allows recovery after invalid input", () => {
  assert.equal(parseInput("é".repeat(1000), ",").errors.length, 0);
  assert.match(
    parseInput("é".repeat(1001), ",").errors[0],
    /2,000 UTF-8 bytes/,
  );
  assert.match(parseInput("Alice,  ", ",").errors[0], /no barcode value/);
  assert.deepEqual(parseInput("Alice,A-001", ",").errors, []);
});

test("accepts finite integer settings and rejects partial, overflowing or out-of-range input", () => {
  for (const value of [
    "",
    " ",
    "1e",
    "Infinity",
    "9".repeat(310),
    "-1",
    "10001",
    "30.5",
    "12px",
  ]) {
    assert.equal(sanitizeIntegerInput(value, null, 0, 10000), null, value);
  }
  assert.equal(sanitizeIntegerInput("1e3", null, 0, 10000), 1000);
  assert.equal(sanitizeIntegerInput("30", null, 15, 100), 30);
  assert.equal(sanitizeIntegerInput("0", null, 0, 20), 0);
});
