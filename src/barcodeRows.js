// Keep barcode content aligned with the rows that will actually be rendered.
export const getRenderableRows = (records, hasHeaderRow = false) =>
  hasHeaderRow ? records.slice(1) : records;

export const getBarcodeContents = (records, hasHeaderRow = false) =>
  getRenderableRows(records, hasHeaderRow).map((row) => row[row.length - 1]);
