// Keep barcode content aligned with the rows that will actually be rendered.
export const getRenderableRows = (records, hasHeaderRow = false) =>
  hasHeaderRow ? records.slice(1) : records;

export const getBarcodeContents = (records, hasHeaderRow = false) =>
  getRenderableRows(records, hasHeaderRow).map((row) => {
    // The barcode payload is always the last cell, with spreadsheet padding removed.
    const value = row[row.length - 1];

    return typeof value === "string" ? value.trim() : "";
  });

export const getInvalidBarcodeRows = (records, hasHeaderRow = false) =>
  getBarcodeContents(records, hasHeaderRow).reduce((invalidRows, value, index) => {
    // Report row numbers as users see them in the input, including an optional header row.
    const rowNumber = hasHeaderRow ? index + 2 : index + 1;

    if (value === "") invalidRows.push(rowNumber);

    return invalidRows;
  }, []);
