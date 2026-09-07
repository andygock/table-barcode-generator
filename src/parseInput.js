import Papa from "papaparse";
import { limits } from "./inputUtils.js";

const countNewlines = (text) => (text.match(/\r\n|\r|\n/g) || []).length;

// Keep physical source lines, including comments, blanks and quoted multiline cells.
// Papa's record indices cannot directly identify lines in the textarea.
export function parseInput(input, delimiter, hasHeaderRow = false) {
  const rows = [];
  const errors = [];
  if (input.length > limits.inputCharacters) {
    return {
      rows,
      errors: [
        `Input exceeds ${limits.inputCharacters.toLocaleString("en-AU")} characters.`,
      ],
    };
  }
  if (![",", "\t"].includes(delimiter))
    return { rows, errors: ["Choose Tab or Comma as the delimiter."] };

  // Papa strips an initial BOM before reporting cursors; use the same text for offsets.
  const source = input.replace(/^\uFEFF/, "");
  let previousCursor = 0;
  let nextLine = 1;
  Papa.parse(source, {
    delimiter,
    comments: "#",
    // Observe empty records too: Papa also considers a quoted empty field empty,
    // and skipping it internally would lose its physical source-line offset.
    skipEmptyLines: false,
    step(result, parser) {
      const segment = source.slice(previousCursor, result.meta.cursor);
      const skipped = segment.match(/^(?:(?:#[^\r\n]*)?(?:\r\n|\r|\n))*/)[0];
      const line = nextLine + countNewlines(skipped);
      nextLine += countNewlines(segment);
      previousCursor = result.meta.cursor;
      if (result.errors.length) {
        errors.push(
          ...result.errors.map((error) => `Line ${line}: ${error.message}`),
        );
        parser.abort();
        return;
      }
      if (result.data.length === 1 && result.data[0] === "") return;
      if (rows.length >= limits.rows + (hasHeaderRow ? 1 : 0)) {
        errors.push(`Line ${line}: maximum ${limits.rows} data rows exceeded.`);
        parser.abort();
        return;
      }
      if (result.data.length > limits.columns) {
        errors.push(
          `Line ${line}: maximum ${limits.columns} columns exceeded.`,
        );
        parser.abort();
        return;
      }
      rows.push({ cells: result.data, line });
    },
  });

  const expectedColumns = rows[0]?.cells.length;
  for (const [index, row] of rows.entries()) {
    if (row.cells.length !== expectedColumns) {
      errors.push(
        `Line ${row.line}: expected ${expectedColumns} columns, found ${row.cells.length}.`,
      );
      continue;
    }
    if (hasHeaderRow && index === 0) continue;
    // Display exactly the trimmed value that is encoded.
    const last = row.cells.length - 1;
    row.cells[last] = row.cells[last].trim();
    if (!row.cells[last]) errors.push(`Line ${row.line}: no barcode value.`);
    else if (
      new TextEncoder().encode(row.cells[last]).length > limits.payloadBytes
    ) {
      errors.push(
        `Line ${row.line}: barcode value exceeds ${limits.payloadBytes.toLocaleString("en-AU")} UTF-8 bytes.`,
      );
    }
  }
  return { rows, errors };
}
